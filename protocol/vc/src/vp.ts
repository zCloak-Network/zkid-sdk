// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { Did } from '@zcloak/did';
import type {
  HashType,
  Proof,
  VerifiableCredential,
  VerifiablePresentation,
  VerifiablePresentationType,
  VerifiablePresentationVersion
} from './types';

import { assert, isHex, objectCopy, stringToU8a, u8aConcat, u8aToHex } from '@polkadot/util';

import { base58Encode } from '@zcloak/crypto';
import { isSameUri } from '@zcloak/did/utils';

import { DEFAULT_CONTEXT, DEFAULT_VP_HASH_TYPE, DEFAULT_VP_VERSION } from './defaults';
import { HASHER } from './hasher';
import { isPublicVC, isVC } from './is';
import { calcRoothash } from './rootHash';
import { rlpEncode, encodeAsSol, signedVPMessage } from './utils';

// @internal
// transform private Verifiable Credential by [[VerifiablePresentationType]]
function transformVC(
  vc: VerifiableCredential<false>,
  type: VerifiablePresentationType,
  selectedAttributes?: string[]
): VerifiableCredential<false> {
  vc = objectCopy(vc);
  assert(vc.credentialSubjectHashes, 'Credential subject hashes no provided');
  assert(vc.credentialSubjectNonceMap, 'Credential subject nonce-map no provided');
  assert(!isHex(vc.credentialSubject), 'Credential subject is not key-value');

  if (type === 'VP') {
    return vc;
  } else if (type === 'VP_SelectiveDisclosure') {
    assert(selectedAttributes, 'no selected attributes provided');

    const subject = vc.credentialSubject;
    const nonceMap = vc.credentialSubjectNonceMap;

    vc.credentialSubject = {};
    vc.credentialSubjectNonceMap = {};

    for (const key of selectedAttributes) {
      vc.credentialSubject[key] = subject[key];
      let encode: HexString;
      if (vc.version === '2') {
        if (vc.hasher[0] == 'Keccak256') {
          encode = encodeAsSol(subject[key]);
        } else {
          encode = u8aToHex(rlpEncode(subject[key], vc.hasher[0]));
        }
      } else if (vc.version === '0' || vc.version === '1') {
        encode = u8aToHex(rlpEncode(subject[key], vc.hasher[0]));
      } else {
        const check: never = vc.version;
        return check;
      }
      vc.credentialSubjectNonceMap[encode] = nonceMap[encode];
    }
  } else if (type === 'VP_Digest') {
    const { rootHash } = calcRoothash(vc.credentialSubject, vc.hasher[0], vc.version, vc.credentialSubjectNonceMap);

    vc.credentialSubject = rootHash;
    vc.credentialSubjectHashes = [];
    vc.credentialSubjectNonceMap = {};
  } else {
    const check: never = type;
    return check;
  }

  return vc;
}

export function vpID(
  digests: HexString[],
  version: VerifiablePresentationVersion,
  hashType: HashType = 'Keccak256'
): { hash: HexString; type: HashType } {
  const content = u8aConcat(...digests);

  let hash: HexString;

  if (version === '0') {
    hash = u8aToHex(content);
  } else {
    hash = u8aToHex(HASHER[hashType](content));
  }

  return { hash, type: hashType };
}

/**
 * A class to build [[VerifiablePresentation]]
 *
 * @example
 * ```typescript
 * import { helpers, Did } from '@zcloak/did';
 * import { VerifiablePresentationBuilder } from '@zcloak/vc';
 *
 * const mnemonic = 'health correct setup usage father decorate curious copper sorry recycle skin equal';
 * const keyring: Keyring = new Keyring();
 * const did: Did = helpers.createEcdsaFromMnemonic(mnemonic, keyring);
 * const vpBuilder = new VerifiablePresentationBuilder(did);
 *
 * const vp = vpBuilder.addVC({...anyVC}).build('Keccak256')
 * ```
 */
export class VerifiablePresentationBuilder {
  #did: Did;
  // [[VerifiableCredential]] => [[VerifiablePresentation]]
  public vcMap: Map<VerifiableCredential<boolean>, VerifiablePresentationType> = new Map();
  public version: VerifiablePresentationVersion;

  constructor(did: Did, version = DEFAULT_VP_VERSION) {
    this.#did = did;
    this.version = version;
  }

  /**
   * add VC and transform by vpType and selectedAttributes
   * @param vc [[VerifiableCredential]]
   * @param vpType [[VerifiablePresentationType]]
   * @param selectedAttributes optional, only used when `vpType` is `VP_SelectiveDisclosure`
   */
  public addVC(
    vc: VerifiableCredential<boolean>,
    vpType: VerifiablePresentationType,
    selectedAttributes?: string[]
  ): this {
    assert(isSameUri(this.#did.id, vc.holder), `the did "${this.#did.id}" is not the holder of "${vc.digest}" VC`);
    assert(isVC(vc), 'input `vc` is not a VerifiableCredential object');

    this.vcMap.set(isPublicVC(vc) ? vc : transformVC(vc, vpType, selectedAttributes), vpType);

    return this;
  }

  /**
   * build to an [[VerifiablePresentation]]
   * @param hashType the [[HashType]] to generate `id` field
   */
  public async build(hashType: HashType = DEFAULT_VP_HASH_TYPE, challenge?: string): Promise<VerifiablePresentation> {
    const vcs: VerifiableCredential<boolean>[] = [];
    const vpTypes: VerifiablePresentationType[] = [];

    for (const [vc, vpType] of this.vcMap.entries()) {
      vcs.push(vc);
      vpTypes.push(vpType);
    }

    const { hash, type: hashTypeOut } = vpID(
      vcs.map(({ digest }) => digest),
      this.version,
      hashType
    );

    const proof = await this._sign(hash, challenge);

    return {
      '@context': DEFAULT_CONTEXT,
      version: this.version,
      type: vpTypes,
      verifiableCredential: vcs,
      id: hash,
      proof,
      hasher: [hashTypeOut]
    };
  }

  // sign digest by did, the signed message is `concat(VersionedCredPresentation, version, id, challenge)`
  private async _sign(hash: HexString, challenge?: string): Promise<Proof> {
    let message: Uint8Array;

    if (this.version === '0') {
      message = u8aConcat(hash, stringToU8a(challenge));
    } else {
      message = signedVPMessage(hash, this.version, challenge);
    }

    const { id, signature, type: signType } = await this.#did.signWithKey(message, 'controller');

    return {
      type: signType,
      created: Date.now(),
      verificationMethod: id,
      proofPurpose: 'controller',
      proofValue: base58Encode(signature),
      challenge
    };
  }
}

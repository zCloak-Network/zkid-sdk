// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type {
  HashType,
  VerifiableCredential,
  VerifiablePresentation,
  VerifiablePresentationType
} from './types';

import { assert, isHex, stringToU8a, u8aConcat, u8aToHex } from '@polkadot/util';

import { base58Encode } from '@zcloak/crypto';
import { Did } from '@zcloak/did';
import { isSameUri } from '@zcloak/did/utils';

import { DEFAULT_CONTEXT } from './defaults';
import { rootHashFromMerkle } from './rootHash';
import { keyTypeToSignatureType } from './utils';

// @internal
// transform Verifiable Credential by [[VerifiablePresentationType]]
function transformVC(
  vc: VerifiableCredential,
  type: VerifiablePresentationType,
  selectedAttributes?: string[]
): VerifiableCredential {
  assert(vc.credentialSubjectHashes, 'Credential subject hashes no provided');
  assert(vc.credentialSubjectNonceMap, 'Credential subject nonce-map no provided');
  assert(!isHex(vc.credentialSubject), 'Credential subject is not key-value');

  if (type === 'VP') {
    return vc;
  } else if (type === 'VP_SelectiveDisclosure') {
    assert(selectedAttributes, 'no selected attributes provided');

    for (const key in vc.credentialSubject) {
      if (!selectedAttributes.includes(key)) {
        delete vc.credentialSubject[key];
      }
    }
  } else {
    const rootHash = rootHashFromMerkle(
      vc.credentialSubjectHashes,
      vc.credentialSubjectNonceMap,
      vc.hasher[0]
    );

    vc.credentialSubject = rootHash;
  }

  return vc;
}

function hashDigests(
  digests: HexString[],
  hashType: HashType = 'Keccak256'
): { hash: HexString; type: HashType } {
  const hash = u8aToHex(u8aConcat(...digests));

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
  public vcMap: Map<VerifiableCredential, VerifiablePresentationType> = new Map();

  constructor(did: Did) {
    this.#did = did;
  }

  /**
   * add VC and transform by vpType and selectedAttributes
   * @param vc [[VerifiableCredential]]
   * @param vpType [[VerifiablePresentationType]]
   * @param selectedAttributes optional, only used when `vpType` is `VP_SelectiveDisclosure`
   */
  public addVC(
    vc: VerifiableCredential,
    vpType: VerifiablePresentationType,
    selectedAttributes?: string[]
  ): this {
    assert(
      isSameUri(this.#did.id, vc.holder),
      `the did "${this.#did.id}" is not the holder of "${vc.digest}" VC`
    );

    this.vcMap.set(transformVC(vc, vpType, selectedAttributes), vpType);

    return this;
  }

  /**
   * build to an [[VerifiablePresentation]]
   * @param hashType the [[HashType]] to generate `id` field
   */
  public build(hashType: HashType, challenge?: string): VerifiablePresentation {
    const vcs: VerifiableCredential[] = [];
    const vpTypes: VerifiablePresentationType[] = [];

    for (const [vc, vpType] of this.vcMap.entries()) {
      vcs.push(vc);
      vpTypes.push(vpType);
    }

    const { hash, type: hashTypeOut } = hashDigests(
      vcs.map(({ digest }) => digest),
      hashType
    );

    const {
      didUrl,
      signature,
      type: signType
    } = this.#did.signWithKey('authentication', u8aConcat(hash, stringToU8a(challenge)));

    return {
      '@context': DEFAULT_CONTEXT,
      version: '0',
      type: vpTypes,
      verifiableCredential: vcs,
      id: hash,
      proof: {
        type: keyTypeToSignatureType(signType),
        created: Date.now(),
        verificationMethod: didUrl,
        proofPurpose: 'authentication',
        proofValue: base58Encode(signature)
      },
      hasher: [hashTypeOut]
    };
  }
}

// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';
import type { CType } from '@zcloak/ctype/types';
import type { Did } from '@zcloak/did';
import type { DidResolver } from '@zcloak/did-resolver';
import type { DidUrl } from '@zcloak/did-resolver/types';
import type { HashType, Proof, RawCredential, VerifiableCredential, VerifiableCredentialVersion } from '../types';

import { assert } from '@polkadot/util';

import { base58Encode } from '@zcloak/crypto';
// import { vcVerify } from '@zcloak/verify/vcVerify';

import { DEFAULT_CONTEXT, DEFAULT_VC_VERSION } from '../defaults';
import { calcDigest, DigestPayload } from '../digest';
import { isRawCredential } from '../is';
import { calcRoothash, RootHashResult } from '../rootHash';
import { signedVCMessage } from '../utils';
import { Raw } from './raw';

/**
 * @name VerifiableCredentialBuilder
 *
 * @description
 * A builder to make [[VerifiableCredential]] for attester.
 *
 * Use this builder to set attributes for [[VerifiableCredential]], and sign proof for [[VerifiableCredential]]
 *
 * @example
 * ```typescript
 * import { Did, helpers } from '@zcloak/did';
 * import { DEFAULT_ROOT_HASH_TYPE } from '@zcloak/defaults';
 * import { VerifiableCredential } from '@zcloak/types';
 * import { Raw } from '@zcloak/vc';
 * import { VerifiableCredentialBuilder } from './vc';
 *
 * const raw = new Raw({
 *   contents: {},
 *   hashType: DEFAULT_ROOT_HASH_TYPE,
 *   ctype: '0x...',
 *   owner: 'did:zk:claimer'
 * });
 *
 *
 * const builder = VerifiableCredentialBuilder.fromRaw(raw)
 *   .setExpirationDate(null); // if you don't want the vc to expirate, set it to `null`
 *
 * const issuer: Did = helpers.createEcdsaFromMnemonic('pass your mnemonic')
 * const vc: VerifiableCredential = builder.build(issuer)
 * ```
 */
export class VerifiableCredentialBuilder {
  public '@context'?: string[];
  public version?: VerifiableCredentialVersion;
  public issuanceDate?: number;
  public expirationDate?: number | null;
  public raw: Raw;
  public digestHashType?: HashType;

  /**
   * instance by [[RawCredential]]
   */
  public static fromRawCredential(rawCredential: RawCredential, ctype: CType): VerifiableCredentialBuilder {
    assert(isRawCredential(rawCredential), 'input is not a RawCredential object');
    assert(ctype.$id === rawCredential.ctype, '`ctype` is not the raw credential ctype');

    const raw = Raw.fromRawCredential(rawCredential, ctype);
    const builder = new VerifiableCredentialBuilder(raw);

    return builder
      .setContext(DEFAULT_CONTEXT)
      .setVersion(DEFAULT_VC_VERSION)
      .setIssuanceDate(Date.now())
      .setDigestHashType(rawCredential.hasher[1]);
  }

  constructor(raw: Raw) {
    this.raw = raw;
  }

  /**
   * Build to [[PublicVerifiableCredential]]
   */
  public async build(issuer: Did, isPublic: true): Promise<VerifiableCredential<true>>;

  /**
   * Build to [[PrivateVerifiableCredential]]
   */
  public async build(issuer: Did, isPublic: false): Promise<VerifiableCredential<false>>;

  /**
   *
   * @param issuer this is Did type, because we need to sign vc to fulfill the proof field
   * @param isPublic
   * @param moreIssuers this is only DidUrl type, because we just add them to the issuer field( not proof field)
   * @returns
   */
  public async build(issuer: Did, isPublic = false): Promise<VerifiableCredential<boolean>> {
    assert(this.raw.checkSubject(), `Subject check failed when use ctype ${this.raw.ctype}`);

    if (
      this['@context'] &&
      this.version &&
      this.issuanceDate &&
      this.digestHashType &&
      this.expirationDate !== undefined
    ) {
      let rootHashResult: RootHashResult;

      if (isPublic) {
        rootHashResult = calcRoothash(this.raw.contents, this.raw.hashType, this.version);
      } else {
        rootHashResult = calcRoothash(this.raw.contents, this.raw.hashType, this.version, {});
      }

      const digestPayload: DigestPayload<VerifiableCredentialVersion> = {
        rootHash: rootHashResult.rootHash,
        expirationDate: this.expirationDate || undefined,
        holder: this.raw.owner,
        ctype: this.raw.ctype.$id,
        issuanceDate: this.issuanceDate
      };

      const { digest, type: digestHashType } = calcDigest(this.version, digestPayload, this.digestHashType);

      const proof = await VerifiableCredentialBuilder._signDigest(issuer, digest, this.version);

      // NOTE: at this moment, the first proof is fullfiled, this maybe not enough because of multiple issuers
      // Use addIssuerProof() to add more proofs
      let vc: VerifiableCredential<boolean> = {
        '@context': this['@context'],
        version: this.version,
        ctype: this.raw.ctype.$id,
        issuanceDate: this.issuanceDate,
        credentialSubject: this.raw.contents,
        issuer: [issuer.id],
        holder: this.raw.owner,
        hasher: [rootHashResult.type, digestHashType],
        digest,
        proof: [proof]
      };

      if (!isPublic) {
        vc = {
          ...vc,
          credentialSubjectHashes: rootHashResult.hashes,
          credentialSubjectNonceMap: rootHashResult.nonceMap
        };
      }

      if (this.expirationDate) {
        vc.expirationDate = this.expirationDate;
      }

      return vc;
    }

    throw new Error('Can not to build an VerifiableCredential');
  }

  /**
   * since @2.0.0
   * @param issuer
   * @param vc
   * @returns
   */
  public static async addProof(
    issuer: Did,
    vc: VerifiableCredential<boolean>,
    resolverOrDidDocument?: DidResolver
  ): Promise<VerifiableCredential<boolean>> {
    const existedIssuer = vc.issuer;
    const existedProof = vc.proof;
    const exitedDigest = vc.digest;

    assert(vc.version === '2', 'Only version2 support addProof');

    // Must have  proof
    assert(existedIssuer.length > 0 && existedProof.length > 0, 'field issuer or proof is empty');

    // const vcVerifyResult = await vcVerify(vc, resolverOrDidDocument);
    // assert(vcVerifyResult, 'The VC is invalid')

    // addProof available since vc@2.0.0
    const version = '2';
    const proof = await VerifiableCredentialBuilder._signDigest(issuer, exitedDigest, version);
    const modifiedVC: VerifiableCredential<boolean> = {
      ...vc,
      issuer: [...existedIssuer, issuer.id] as any,
      proof: [...existedProof, proof]
    };

    return modifiedVC;
  }

  /**
   * set arrtibute `@context`
   */
  public setContext(context: string[]): this {
    this['@context'] = context;

    return this;
  }

  /**
   * set arrtibute `version`
   */
  public setVersion(version: VerifiableCredentialVersion): this {
    this.version = version;

    return this;
  }

  /**
   * set arrtibute `issuanceDate`
   */
  public setIssuanceDate(timestamp: number): this {
    this.issuanceDate = timestamp;

    return this;
  }

  /**
   * set arrtibute `expirationDate`, if you want to set the expiration date, pass `null` to this method.
   */
  public setExpirationDate(timestamp: number | null): this {
    this.expirationDate = timestamp;

    return this;
  }

  /**
   * set arrtibute `raw`
   * @param rawIn instance of [[Raw]]
   */
  public setRaw(rawIn: Raw): this {
    this.raw = rawIn;

    return this;
  }

  /**
   * set attribute `digestHashType`
   */
  public setDigestHashType(hashType: HashType): this {
    this.digestHashType = hashType;

    return this;
  }

  // sign digest by did, the signed message is `concat('CredentialVersionedDigest', version, digest)`
  private static async _signDigest(did: Did, digest: HexString, version: VerifiableCredentialVersion): Promise<Proof> {
    let message: Uint8Array | HexString;

    if (version === '1') {
      message = signedVCMessage(digest, version);
    } else if (version === '0' || version === '2') {
      message = digest;
    } else {
      const check: never = version;
      throw new Error(`VC Version invalid, the wrong VC Version is ${check}`);
    }

    const signDidUrl: DidUrl = did.getKeyUrl('assertionMethod');

    const { id, signature, type: signType } = await did.signWithKey(message, signDidUrl);

    return {
      type: signType,
      created: Date.now(),
      verificationMethod: id,
      proofPurpose: 'assertionMethod',
      proofValue: base58Encode(signature)
    };
  }
}

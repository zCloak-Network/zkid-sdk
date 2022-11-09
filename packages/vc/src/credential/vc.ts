// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type {
  HashType,
  Proof,
  RawCredential,
  VerifiableCredential,
  VerifiableCredentialVersion
} from '../types';
import type { IRaw } from './types';

import { base58Encode } from '@zcloak/crypto';
import { Did } from '@zcloak/did';

import { DEFAULT_CONTEXT, DEFAULT_DIGEST_HASH_TYPE, DEFAULT_VC_VERSION } from '../defaults';
import { calcDigest } from '../digest';
import { keyTypeToSignatureType } from '../utils';
import { Raw } from './raw';

/**
 * A builder to make [[VerifiableCredential]]
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
  public raw: IRaw;
  public digestHashType?: HashType;

  /**
   * instance by [[RawCredential]]
   */
  public static fromRawCredential(rawCredential: RawCredential): VerifiableCredentialBuilder {
    const raw = Raw.fromRawCredential(rawCredential);
    const builder = new VerifiableCredentialBuilder(raw);

    return builder
      .setContext(DEFAULT_CONTEXT)
      .setVersion(DEFAULT_VC_VERSION)
      .setIssuanceDate(Date.now())
      .setDigestHashType(rawCredential.hasher[1]);
  }

  constructor(raw: IRaw) {
    this.raw = raw;
  }

  /**
   * Build to [[VerifiableCredential]], it will calc digest and  sign proof use `issuer:Did`
   */
  public build(issuer: Did): VerifiableCredential {
    if (
      this['@context'] &&
      this.version &&
      this.issuanceDate &&
      this.digestHashType &&
      this.expirationDate !== undefined
    ) {
      const raw = new Raw(this.raw);

      const { hashes, nonceMap, rootHash, type: rootHashType } = raw.calcRootHash();

      const { digest, type: digestHashType } = calcDigest(
        {
          rootHash,
          expirationDate: this.expirationDate || undefined,
          holder: this.raw.owner,
          ctype: this.raw.ctype
        },
        this.digestHashType
      );

      const { didUrl, signature, type: keyType } = issuer.signWithKey('assertionMethod', digest);

      const proof: Proof = {
        type: keyTypeToSignatureType(keyType),
        created: Date.now(),
        verificationMethod: didUrl,
        proofPurpose: 'assertionMethod',
        proofValue: base58Encode(signature)
      };

      const vc: VerifiableCredential = {
        '@context': this['@context'],
        version: this.version,
        ctype: this.raw.ctype,
        issuanceDate: this.issuanceDate,
        credentialSubject: this.raw.contents,
        credentialSubjectNonceMap: nonceMap,
        credentialSubjectHashes: hashes,
        issuer: issuer.id,
        holder: this.raw.owner,
        hasher: [rootHashType, digestHashType],
        digest,
        proof: [proof]
      };

      return vc;
    }

    throw new Error('Can not to build an VerifiableCredential');
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
   * set arrtibute `expirationDate`
   */
  public setExpirationDate(timestamp: number | null): this {
    this.expirationDate = timestamp;

    return this;
  }

  /**
   * set arrtibute `raw`
   * @param rawIn object of [[IRaw]]
   */
  public setRaw(rawIn: IRaw): this {
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
}

// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type {
  HashType,
  Proof,
  RawCredential,
  VerifiableCredential,
  VerifiableCredentialVersion
} from '../types';

import { assert } from '@polkadot/util';

import { base58Encode } from '@zcloak/crypto';
import { CType } from '@zcloak/ctype/types';
import { Did } from '@zcloak/did';

import { DEFAULT_CONTEXT, DEFAULT_VC_VERSION } from '../defaults';
import { calcDigest } from '../digest';
import { isRawCredential, keyTypeToSignatureType } from '../utils';
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
  public static fromRawCredential(
    rawCredential: RawCredential,
    ctype: CType
  ): VerifiableCredentialBuilder {
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
   * Build to [[VerifiableCredential]], it will calc digest and  sign proof use `issuer:Did`
   */
  public async build(issuer: Did): Promise<VerifiableCredential> {
    if (
      this['@context'] &&
      this.version &&
      this.issuanceDate &&
      this.digestHashType &&
      this.expirationDate !== undefined
    ) {
      const { hashes, nonceMap, rootHash, type: rootHashType } = this.raw.calcRootHash();

      const { digest, type: digestHashType } = calcDigest(
        {
          rootHash,
          expirationDate: this.expirationDate || undefined,
          holder: this.raw.owner,
          ctype: this.raw.ctype.$id
        },
        this.digestHashType
      );

      const { id, signature, type: keyType } = await issuer.signWithKey(digest, 'assertionMethod');

      const proof: Proof = {
        type: keyTypeToSignatureType(keyType),
        created: Date.now(),
        verificationMethod: id,
        proofPurpose: 'assertionMethod',
        proofValue: base58Encode(signature)
      };

      const vc: VerifiableCredential = {
        '@context': this['@context'],
        version: this.version,
        ctype: this.raw.ctype.$id,
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

      if (this.expirationDate) {
        vc.expirationDate = this.expirationDate;
      }

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
}

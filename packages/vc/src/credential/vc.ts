// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HashType, Proof, VerifiableCredential, VerifiableCredentialVersion } from '../types';
import type { ISubject } from './types';

import { base58Encode } from '@zcloak/crypto';
import { Did } from '@zcloak/did';

import { DEFAULT_DIGEST_HASH_TYPE, DEFAULT_VC_VERSION } from '../defaults';
import { calcDigest } from '../digest';
import { calcRoothash } from '../rootHash';
import { keyTypeToSignatureType } from '../utils';

/**
 * A builder to make [[VerifiableCredential]]
 *
 * @example
 * ```typescript
 * import { Did, helpers } from '@zcloak/did';
 * import { DEFAULT_ROOT_HASH_TYPE } from '../defaults';
 * import { VerifiableCredential } from '../types';
 * import { Subject } from './subject';
 * import { VerifiableCredentialBuilder } from './vc';
 *
 * const subject = new Subject({
 *   contents: {},
 *   hashType: DEFAULT_ROOT_HASH_TYPE,
 *   ctype: '0x...',
 *   owner: 'did:zk:claimer'
 * });
 *
 *
 * const builder = VerifiableCredentialBuilder.fromSubject(subject)
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
  public subject: ISubject;
  public digestHashType?: HashType;

  public static fromSubject(subject: ISubject): VerifiableCredentialBuilder {
    const builder = new VerifiableCredentialBuilder(subject);

    return builder
      .setVersion(DEFAULT_VC_VERSION)
      .setIssuanceDate(Date.now())
      .setDigestHashType(DEFAULT_DIGEST_HASH_TYPE);
  }

  constructor(subject: ISubject) {
    this.subject = subject;
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
      const {
        hashes,
        nonceMap,
        rootHash,
        type: rootHashType
      } = calcRoothash(this.subject.contents, this.subject.hashType, this.subject.nonceMap);

      const { digest, type: digestHashType } = calcDigest(
        {
          rootHash,
          expirationDate: this.expirationDate || undefined,
          holder: this.subject.owner,
          ctype: this.subject.ctype
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
        ctype: this.subject.ctype,
        issuanceDate: this.issuanceDate,
        credentialSubject: this.subject.contents,
        credentialSubjectNonceMap: nonceMap,
        credentialSubjectHashes: hashes,
        issuer: issuer.id,
        holder: this.subject.owner,
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
   * set arrtibute `subject`
   * @param subjectIn object of [[ISubject]]
   */
  public setSubject(subjectIn: ISubject): this {
    this.subject = subjectIn;

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

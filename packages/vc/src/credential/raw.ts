// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidUrl } from '@zcloak/did-resolver/types';
import type { AnyJson, HashType, RawCredential, VerifiableCredentialVersion } from '../types';

import { assert } from '@polkadot/util';

import { calcRoothash } from '../rootHash';

/**
 * A builder implements for [[RawCredential]]
 *
 * Use this builder, you can build an [[RawCredential]]
 *
 * @example
 * ```typescript
 * import type { AnyJson, RawCredential } from '@zcloak/vc/types'
 * import { RawCredentialBuilder } from '@zcloak/vc'
 *
 * const subject: AnyJson = { name: "zCloak" };
 * const ctype = '0x....';
 * const builder = RawCredentialBuilder
 *   .fromSubjectAndCtype(subject, ctype)
 *   .setExpirationDate(Date.now() + 60 * 60 * 24 * 30 * 36 * 1000) // expiration date in 36 month
 *
 * const rawCredential: RawCredential = builder.build('did:zk:holder', 'did:zk:issuer');
 * ```
 */
export class RawCredentialBuilder {
  public '@context'?: string[];
  public version?: VerifiableCredentialVersion;
  public ctype?: HexString;
  public issuanceDate?: number;
  public expirationDate?: number;
  public credentialSubject?: AnyJson;
  public credentialSubjectHashes?: HexString[];
  public credentialSubjectNonceMap?: Record<HexString, HexString>;
  public issuer?: DidUrl;
  public holder?: DidUrl;
  public hasher?: [HashType, HashType];

  public static fromSubjectAndCtype(subject: AnyJson, ctype: HexString): RawCredentialBuilder {
    const builder = new RawCredentialBuilder();

    builder
      .setContext(['https://www.w3.org/2018/credentials/v1'])
      .setVersion('0')
      .setCtype(ctype)
      .setIssuanceDate(Date.now())
      .setSubject(subject);

    return builder;
  }

  /**
   * convert `this` to [[RawCredential]] object, if the field is not enought, it will return `null`
   */
  public convert(): RawCredential | null {
    let rawCredential: RawCredential | null = null;

    if (
      this['@context'] &&
      this.version === '0' &&
      this.ctype &&
      this.issuanceDate &&
      this.issuer &&
      this.holder &&
      this.hasher &&
      this.credentialSubject &&
      this.credentialSubjectNonceMap &&
      this.credentialSubjectHashes
    ) {
      rawCredential = {
        '@context': this['@context'],
        version: this.version,
        ctype: this.ctype,
        issuanceDate: this.issuanceDate,
        credentialSubject: this.credentialSubject,
        credentialSubjectNonceMap: this.credentialSubjectNonceMap,
        credentialSubjectHashes: this.credentialSubjectHashes,
        issuer: this.issuer,
        holder: this.holder,
        hasher: this.hasher
      };
    }

    return rawCredential;
  }

  /**
   * Build to [[RawCredential]], it will set `holder` and `issuer` if you provided.
   * this method also check the subject is valid
   */
  public build(holder?: DidUrl, issuer?: DidUrl): RawCredential {
    holder && this.setHolder(holder);
    issuer && this.setIssuer(issuer);

    const rawCredential = this.convert();

    assert(rawCredential, 'Could not build to an RawCredential');

    // TODO check subject use the ctype

    return rawCredential;
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
   * set arrtibute `ctype`
   */
  public setCtype(ctype: HexString): this {
    this.ctype = ctype;

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
  public setExpirationDate(timestamp?: number): this {
    this.expirationDate = timestamp;

    return this;
  }

  /**
   * set arrtibute `credentialSubject`, `credentialSubjectHashes`, `credentialSubjectNonceMap` and `hasher[0]`
   * this method will call `calcRootHash` function, pass `subject` and `nonceMapIn`
   * @param subject map of [[AnyJson]]
   * @param nonceMapIn(optional) map of HexString => HexString
   */
  public setSubject(
    subject: AnyJson,
    nonceMapIn?: Record<HexString, HexString>,
    hashType?: HashType
  ): this {
    this.credentialSubject = subject;
    const { hashes, nonceMap, type } = calcRoothash(subject, nonceMapIn, hashType);

    this.credentialSubjectHashes = hashes;
    this.credentialSubjectNonceMap = nonceMap;

    this.hasher = [type, this.hasher?.[1] ?? 'Keccak256'];

    return this;
  }

  /**
   * set arrtibute `issuer`
   */
  public setIssuer(issuer: DidUrl): this {
    this.issuer = issuer;

    return this;
  }

  /**
   * set arrtibute `holder`
   */
  public setHolder(holder: DidUrl): this {
    this.holder = holder;

    return this;
  }

  /**
   * set attribute `hasher[1]`
   */
  public setDigestHashType(hashType: HashType): this {
    this.hasher = [this.hasher?.[0] ?? 'Rescue', hashType];

    return this;
  }
}

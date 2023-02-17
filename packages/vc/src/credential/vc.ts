// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';
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
import { SignedData } from '@zcloak/did/types';

import { DEFAULT_CONTEXT, DEFAULT_VC_VERSION } from '../defaults';
import { calcDigest, DigestPayload } from '../digest';
import { isRawCredential } from '../is';
import { calcRoothash, RootHashResult } from '../rootHash';
import { getAttestationTypedData } from '../utils';
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
        rootHashResult = calcRoothash(this.raw.contents, this.raw.hashType);
      } else {
        rootHashResult = calcRoothash(this.raw.contents, this.raw.hashType, {});
      }

      const digestPayload: DigestPayload<VerifiableCredentialVersion> = {
        rootHash: rootHashResult.rootHash,
        expirationDate: this.expirationDate || undefined,
        holder: this.raw.owner,
        ctype: this.raw.ctype.$id,
        issuanceDate: this.issuanceDate
      };

      const { digest, type: digestHashType } = calcDigest(
        this.version,
        digestPayload,
        this.digestHashType
      );
      const {
        id,
        signature,
        type: signType
      } = await this._signDigest(issuer, digest, this.version);

      const proof: Proof = {
        type: signType,
        created: Date.now(),
        verificationMethod: id,
        proofPurpose: 'assertionMethod',
        proofValue: base58Encode(signature)
      };

      let vc: VerifiableCredential<boolean> = {
        '@context': this['@context'],
        version: this.version,
        ctype: this.raw.ctype.$id,
        issuanceDate: this.issuanceDate,
        credentialSubject: this.raw.contents,
        issuer: issuer.id,
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

  // sign digest by did, if the key type is `Ed25519VerificationKey2020`, it will sign `digest`,
  // if the key type is `EcdsaSecp256k1VerificationKey2019`, it will sign `getAttestationTypedData`.
  // otherwise, it will throw Error
  private _signDigest(
    did: Did,
    digest: HexString,
    version: VerifiableCredentialVersion
  ): Promise<SignedData> {
    const { id, type } = did.get(did.getKeyUrl('assertionMethod'));

    if (type === 'EcdsaSecp256k1VerificationKey2019') {
      return did.signWithKey(getAttestationTypedData(digest, version), id);
    } else if (type === 'Ed25519VerificationKey2020') {
      return did.signWithKey(digest, id);
    }

    throw new Error(`Unable to sign with id: ${id}, because type is ${type}`);
  }
}

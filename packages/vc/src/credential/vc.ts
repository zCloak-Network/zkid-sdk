// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Did } from '@zcloak/did';
import type { Proof, RawCredential, VerifiableCredential } from '../types';

import { assert, isHex } from '@polkadot/util';

import { base58Encode } from '@zcloak/crypto';
import { HexString } from '@zcloak/crypto/types';
import { isSameUri } from '@zcloak/did/utils';

import { calcDigest } from '../digest';
import { calcRoothash } from '../rootHash';
import { keyTypeToSignatureType } from '../utils';

/**
 * A class implements [[ICredential]]
 *
 * Use the class, you can generate a credential, and calc `rootHash`, get a `digest`, and attester can sign a proof to this.
 *
 * @example
 * ```typescript
 * import { helpers, Did } from '@zcloak/did'
 * import { VerifiableCredentialBuilder } from '@zcloak/vc';
 * import { RawCredential, VerifiableCredential } from '@zcloak/vc/types';
 *
 * const rawCredential: RawCredential = {...};
 * const vcBuilder = new VerifiableCredentialBuilder(rawCredential);
 *
 * const mnemonic = 'health correct setup usage father decorate curious copper sorry recycle skin equal';
 * const keyring: Keyring = new Keyring();
 * const did: Did = helpers.createEcdsaFromMnemonic(mnemonic, keyring);
 * const vc: VerifiableCredential = vcBuilder.build(did);
 * ```
 */
export class VerifiableCredentialBuilder {
  public raw: RawCredential;

  constructor(raw: RawCredential) {
    this.raw = raw;
  }

  /**
   * Build to a [[VerifiableCredential]], it will calcDigest by 'RawCredential`, and sign the proof with assertionMethod of `did`
   * @param did The [[Did]] instance
   */
  public build(did: Did): VerifiableCredential {
    assert(isSameUri(did.id, this.raw.issuer), `The did of raw is not equal to ${did.id}`);
    let rootHash: HexString;

    if (isHex(this.raw.credentialSubject)) {
      rootHash = this.raw.credentialSubject;
    } else {
      rootHash = calcRoothash(
        this.raw.credentialSubject,
        this.raw.credentialSubjectNonceMap
      ).rootHash;
    }

    const { digest } = calcDigest(
      {
        rootHash,
        expirationDate: this.raw.expirationDate,
        holder: this.raw.holder,
        ctype: this.raw.ctype
      },
      this.raw.hasher[1]
    );

    const { didUrl, signature, type: keyType } = did.signWithKey('assertionMethod', digest);

    const proof: Proof = {
      type: keyTypeToSignatureType(keyType),
      created: Date.now(),
      verificationMethod: didUrl,
      proofPurpose: 'assertionMethod',
      proofValue: base58Encode(signature)
    };

    const vc: VerifiableCredential = {
      ...this.raw,
      digest,
      proof: [proof]
    };

    return vc;
  }
}

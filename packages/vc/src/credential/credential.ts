// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { Did } from '@zcloak/did';
import type { DidUrl, VerificationMethodType } from '@zcloak/did-resolver/types';
import type { HashType, Proof, SignatureType } from '../types';

import { base58Encode } from '@zcloak/crypto';

import { Base } from './base';

function keyTypeToSignatureType(type: VerificationMethodType): SignatureType {
  switch (type) {
    case 'EcdsaSecp256k1VerificationKey2019':
      return 'EcdsaSecp256k1Signature2019';
    case 'Ed25519VerificationKey2020':
      return 'Ed25519Signature2018';

    default:
      throw new Error(`Can not transform type: ${type}`);
  }
}

/**
 * A class implements [[ICredential]]
 *
 * @example
 * <BR>
 * ```typescript
 * import { helpers, Did } from '@zcloak/did'
 * import { Credential } from '@zcloak/vc';
 *
 * const credential = new Credential();
 * credential.setContext();
 * credential.setCtype();
 * credential.setIssuanceDate();
 * credential.setExpirationDate();
 * credential.setCredentialSubject();
 * credential.setIssuer();
 * credential.setHolder();
 *
 * const mnemonic = 'health correct setup usage father decorate curious copper sorry recycle skin equal';
 * const keyring: Keyring = new Keyring();
 * const did: Did = helpers.createEcdsaFromMnemonic(mnemonic, keyring);
 * credential.signProof(did, did.assertionMethod.values[0]);
 * ```
 */
export class Credential extends Base {
  /**
   * calc rootHash from `this.credentialSubject`
   * @param hashType [[HashType]] defaults is Keccak256
   * @returns `rootHash` and `hashType` object
   */
  public calcRootHash(hashType: HashType = 'Keccak256'): { rootHash: HexString; type: HashType } {
    return { type: hashType, rootHash: '0x' };
  }

  /**
   * get credential digest
   * 1. it will encode by ctype, expirationDate, rootHash, holder
   * 2. generate hash value use provide [[hashType]]
   * @param hashType [[HashType]] defaults is Keccak256
   * @returns `digest` and `hashType` object
   */
  public getDigest(hashType: HashType = 'Keccak256'): { digest: HexString; type: HashType } {
    return { type: hashType, digest: '0x' };
  }

  /**
   * sign and add a [[Proof]]
   * @param did The [[Did]] instance
   * @param didUrl Used did, it will be a [[DidUrl]] such as `did:zk:abcd#key-0`
   * @param hashType [[HashType]] defaults is Keccak256
   */
  public signProof(did: Did, didUrl: DidUrl, hashType: HashType = 'Keccak256'): void {
    const { digest, type } = this.getDigest(hashType);
    const { keyUrl, signature, type: keyType } = did.signWithKey(didUrl, digest);

    const proof: Proof = {
      type: `${type}+${keyTypeToSignatureType(keyType)}`,
      created: Date.now(),
      verificationMethod: keyUrl,
      proofPurpose: 'assertionMethod',
      proofValue: base58Encode(signature)
    };

    this.setProof(proof);
  }
}

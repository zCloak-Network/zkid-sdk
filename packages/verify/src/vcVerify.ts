// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidResolver } from '@zcloak/did-resolver';
import type { DidDocument } from '@zcloak/did-resolver/types';
import type { VerifiableCredential } from '@zcloak/vc/types';

import { assert, bufferToU8a, isHex, u8aConcat, u8aToHex } from '@polkadot/util';

import { makeMerkleTree } from '@zcloak/vc';
import { HASHER } from '@zcloak/vc/hasher';
import { isVC, rlpEncode } from '@zcloak/vc/utils';

import { digestVerify } from './digestVerify';
import { proofVerify } from './proofVerify';

// @internal used for all vc verify types
async function verifyShared(
  vc: VerifiableCredential,
  rootHash: HexString,
  resolverOrDidDocument?: DidResolver | DidDocument
): Promise<boolean> {
  const { ctype, digest, expirationDate, hasher, holder, proof } = vc;

  if (expirationDate && expirationDate < Date.now()) {
    return false;
  }

  const digestValid = digestVerify(
    digest,
    {
      rootHash,
      holder,
      expirationDate,
      ctype
    },
    hasher[1]
  );

  const proofValid = await (resolverOrDidDocument
    ? proofVerify(digest, proof[0], resolverOrDidDocument)
    : proofVerify(digest, proof[0]));

  return digestValid && proofValid;
}

/**
 * @name vcVerify
 * @summary Verifies the vc is valid.
 * @description
 * Verifies the `vc` is valid. `true` on success, `false` otherwise.
 *
 * This function has below steps:
 * 1. check the `vc` is an [[VerifiableVerifiable]] object.
 * 2. calc `rootHash` and call `digestVerify` use `vc.digest`.
 * 3. call `proofVerify` use `vc.proof`.
 * 4. verify the `vc.hashes` field is valid.
 *
 * @see [[isVC]] `@zcloak/vc/utils`
 * @see [[proofVerify]]
 * @see [[digestVerify]]
 *
 * @example
 * <BR>
 * ```typescript
 * import { vcVerify } from '@zcloak/vc'
 *
 * vcVerify({}); // true/false
 * ```
 */
export async function vcVerify(
  vc: VerifiableCredential,
  resolverOrDidDocument?: DidResolver | DidDocument
): Promise<boolean> {
  assert(isVC(vc), 'input `vc` is not a VerifiableCredential');

  const { credentialSubject, credentialSubjectHashes, credentialSubjectNonceMap, hasher } = vc;

  assert(!isHex(credentialSubject), 'subject must be an object');

  const tree = makeMerkleTree(credentialSubjectHashes, hasher[0]);
  const rootHash = u8aToHex(bufferToU8a(tree.getRoot()));

  for (const value of Object.values(credentialSubject)) {
    const encode = u8aToHex(rlpEncode(value, hasher[0]));
    const hash = u8aToHex(HASHER[hasher[0]](u8aConcat(encode, credentialSubjectNonceMap[encode])));

    if (!credentialSubjectHashes.includes(hash)) return false;
  }

  return verifyShared(vc, rootHash, resolverOrDidDocument);
}

/**
 * @name vcVerify
 * @summary Verifies the vc is valid, only check the digest.
 * @description
 * Verifies the digest on `vc` is valid. `true` on success, `false` otherwise.
 *
 * This function has below steps:
 * 1. check the `vc` is an [[VerifiableVerifiable]] object.
 * 2. makesure this `vc.credentialSubject` is rootHash value, and call `digestVerify` use `vc.digest`.
 * 3. call `proofVerify` use `vc.proof`.
 *
 * @see [[isVC]] `@zcloak/vc/utils`
 * @see [[proofVerify]]
 * @see [[digestVerify]]
 *
 * @example
 * <BR>
 * ```typescript
 * import { vcVerifyDigest } from '@zcloak/vc'
 *
 * vcVerifyDigest({ credentialSubject: '0x....', ... }); // true/false
 * ```
 */
export async function vcVerifyDigest(
  vc: VerifiableCredential,
  resolverOrDidDocument?: DidResolver | DidDocument
): Promise<boolean> {
  assert(isVC(vc), 'input `vc` is not a VerifiableCredential');

  const { credentialSubject } = vc;

  assert(isHex(credentialSubject), 'subject must be an hash value');

  const rootHash = credentialSubject;

  return verifyShared(vc, rootHash, resolverOrDidDocument);
}

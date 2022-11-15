// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
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
  didDocument?: DidDocument
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

  const proofValid = await (didDocument
    ? proofVerify(digest, proof[0], didDocument)
    : proofVerify(digest, proof[0]));

  return digestValid && proofValid;
}

export async function vcVerify(
  vc: VerifiableCredential,
  didDocument?: DidDocument
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

  return verifyShared(vc, rootHash, didDocument);
}

export async function vcVerifyDigest(
  vc: VerifiableCredential,
  didDocument?: DidDocument
): Promise<boolean> {
  assert(isVC(vc), 'input `vc` is not a VerifiableCredential');

  const { credentialSubject } = vc;

  assert(isHex(credentialSubject), 'subject must be an hash value');

  const rootHash = credentialSubject;

  return verifyShared(vc, rootHash, didDocument);
}

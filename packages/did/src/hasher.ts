// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidDocument, DidDocumentVersion } from '@zcloak/did-resolver/types';

import { numberToU8a, stringToU8a, u8aConcat } from '@polkadot/util';

import { jsonCanonicalize, keccak256AsU8a, sha256AsU8a } from '@zcloak/crypto';

/**
 * serialize did document as sha256, used to sign it, do not encode proof, because the signature will push to.
 * @param document an object of [[DidDocument]]
 * @returns [[Uint8Array]]
 */
export function hashDidDocument(document: DidDocument): Uint8Array {
  const obj = { ...document };

  delete obj.proof;
  delete obj.creationTime;

  let hash: Uint8Array;

  if (obj.version === '0') {
    hash = keccak256AsU8a(stringToU8a(jsonCanonicalize(obj)));
  } else {
    hash = sha256AsU8a(stringToU8a(jsonCanonicalize(obj)));
  }

  return hash;
}

export function signedDidDocumentMessage(hash: Uint8Array | HexString, version: DidDocumentVersion): Uint8Array {
  return u8aConcat(
    stringToU8a('VersionedDidDocument'),
    numberToU8a(Number(version), 16), // default to set version `0`
    hash
  );
}

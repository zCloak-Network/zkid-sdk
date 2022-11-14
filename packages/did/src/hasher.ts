// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DidDocument } from '@zcloak/did-resolver/types';

import { stringToU8a } from '@polkadot/util';

import { jsonCanonicalize, sha256AsU8a } from '@zcloak/crypto';

/**
 * serialize did document as sha256, used to sign it, do not encode proof, because the signature will push to.
 * @param document an object of [[DidDocument]]
 * @returns [[Uint8Array]]
 */
export function hashDidDocument(document: DidDocument, withCreationTime = true): Uint8Array {
  const obj = { ...document };

  delete obj.proof;
  if (!withCreationTime) delete obj.creationTime;

  return sha256AsU8a(stringToU8a(jsonCanonicalize(obj)));
}

// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DidDocument } from '@zcloak/did-resolver/types';

import jsonabc from 'jsonabc';

import { sha256AsU8a } from '@zcloak/crypto';
import { stringToU8a } from '@polkadot/util';

/**
 * serialize did document as sha256, used to sign it, do not encode proof, because the signature will push to.
 * @param document an object of [[DidDocument]]
 * @returns [[Uint8Array]]
 */
export function hashDidDocument(document: DidDocument, withCreationTime = true): Uint8Array {
  let obj = { ...document };

  delete obj.proof;
  if (!withCreationTime) delete obj.creationTime;

  obj = jsonabc.sortObj(obj);

  return sha256AsU8a(stringToU8a(JSON.stringify(obj)));
}

// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { AnyJson, HashType } from '@zcloak/vc/types';

import { assert, bufferToU8a, u8aConcat, u8aToHex } from '@polkadot/util';

import { calcRoothash, makeMerkleTree } from '@zcloak/vc';
import { HASHER } from '@zcloak/vc/hasher';
import { rlpEncode } from '@zcloak/vc/utils';

/**
 * @name rootHashVerify
 * @description verify rootHash is valid. `hashes.length` must greater or equal than `Object.keys(input).length`.
 * if the `Object.keys(input).length` less than `hashes.length`, it  means that is selective presentation to verify.
 * else, it means full text presentation to verify
 * @param hashType [[HashType]], the `rootHash` generate type
 * @param hashes the leaves to make merkle tree
 * @param input the plaintext of user's personal infomation
 * @param nonceMap the map of `encode(input) => randomHex(32)`
 * @param rootHashIn expectd rootHash
 */
export function rootHashVerify(
  hashType: HashType,
  hashes: HexString[],
  input: AnyJson,
  nonceMap: Record<HexString, HexString>,
  rootHashIn: HexString
): boolean {
  assert(
    Object.keys(input).length === Object.keys(nonceMap).length,
    `input and nonceMap must has the same keys length, receive input keys length: ${
      Object.keys(input).length
    }, nonceMap keys length: ${Object.keys(nonceMap).length}`
  );
  assert(
    hashes.length >= Object.keys(input).length,
    'hashes length must greater than input length'
  );

  if (hashes.length === Object.keys(input).length) {
    // full text presentation
    const { rootHash } = calcRoothash(input, hashType, nonceMap);

    return rootHash === rootHashIn;
  }

  // others, selective disclosure presentation
  const tree = makeMerkleTree(hashes, hashType);
  const rootHash = u8aToHex(bufferToU8a(tree.getRoot()));

  for (const value of Object.values(input)) {
    const encode = u8aToHex(rlpEncode(value, hashType));
    const hash = u8aToHex(HASHER[hashType](u8aConcat(encode, nonceMap[encode])));

    if (!hashes.includes(hash)) return false;
  }

  return rootHash === rootHashIn;
}

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
 * @description
 * verify the `rootHashIn` is equal to rootHash by (`hashType`, `hashes`, `contents`, `nonceMap`).
 *
 * `hashes.length` must greater or equal than `Object.keys(contents).length`.
 *
 * if the `Object.keys(contents).length` less than `hashes.length`, it  means that is selective presentation to verify.
 *
 * else, it means full text presentation to verify
 *
 * @example
 * ```typescript
 * import { rootHashVerify } from '@zcloak/verify`
 *
 * const nonceMap = {'0x9ad57aefa90d9473f855c14221f330fe959a554b3d86c9d701db11c7559ce107': '0xd50f5298fda74ff0b46be740e602fa5ce0bc2a48fc5ddfbbae3c0678f59b5b97'};
 * const content = { age: 19 };
 * const hashes = [
 *   '0x147c2e0b39f6ac6db8bbfb7ded2083fa2f4d5ee0c3f1a12eed52d42b487ec893',
 *   '0xa88dd3ffe858082e38035a3bf06f7967a1bcd6d59a2544d01c25f436efde166e',
 *   '0x42f5864b05270386f4cd220c0a0ce534b96ab407e75c0a05d5a1a941bafb3467',
 *   '0xc88ba770f3d9748cda017e1f528729e137c03350eb8f48e8ec2493f8bec42cd7'
 * ]
 *
 * rootHashVerify('Rescue', hashes, contents, nonceMap, '0x0a86d6642395770ac481f8a215b08a881e9e0229de2686d498893dec0572649a') // true
 * ```
 */
export function rootHashVerify(
  hashType: HashType,
  hashes: HexString[],
  contents: AnyJson,
  nonceMap: Record<HexString, HexString>,
  rootHashIn: HexString
): boolean {
  assert(
    Object.keys(contents).length === Object.keys(nonceMap).length,
    `contents and nonceMap must has the same keys length, receive contents keys length: ${
      Object.keys(contents).length
    }, nonceMap keys length: ${Object.keys(nonceMap).length}`
  );
  assert(
    hashes.length >= Object.keys(contents).length,
    'hashes length must greater than contents length'
  );

  if (hashes.length === Object.keys(contents).length) {
    // full text presentation
    const { rootHash } = calcRoothash(contents, hashType, nonceMap);

    return rootHash === rootHashIn;
  }

  // others, selective disclosure presentation
  const tree = makeMerkleTree(hashes, hashType);
  const rootHash = u8aToHex(bufferToU8a(tree.getRoot()));

  for (const value of Object.values(contents)) {
    const encode = u8aToHex(rlpEncode(value, hashType));
    const hash = u8aToHex(HASHER[hashType](u8aConcat(encode, nonceMap[encode])));

    if (!hashes.includes(hash)) return false;
  }

  return rootHash === rootHashIn;
}

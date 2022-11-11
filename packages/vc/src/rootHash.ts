// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { AnyJson, HashType } from './types';

import { bufferToU8a, u8aConcat, u8aToHex } from '@polkadot/util';
import { MerkleTree } from 'merkletreejs';

import { randomAsHex } from '@zcloak/crypto';

import { DEFAULT_ROOT_HASH_TYPE } from './defaults';
import { HASHER } from './hasher';
import { rlpEncode } from './utils';

export type RootHashResult = {
  rootHash: HexString;
  hashes: HexString[];
  nonceMap: Record<HexString, HexString>;
  type: HashType;
};

function merkleHash(hashType: HashType) {
  return (value: Buffer) => {
    const u8a = bufferToU8a(value);

    return HASHER[hashType](u8a);
  };
}

export function makeMerkleTree(leaves: Uint8Array[], hashType: HashType): MerkleTree {
  return new MerkleTree(leaves, merkleHash(hashType));
}

/**
 * generate roothash from merkle tree
 * @param encoded the encoded value, used to generate with nonce
 * @param nonceMap the map of `encoded => nonce`, used to generate with encoded
 * @param hashType [[HashType]]
 */
export function rootHashFromMerkle(
  encoded: HexString[],
  nonceMap: Record<HexString, HexString>,
  hashType: HashType
): Omit<RootHashResult, 'type' | 'nonceMap'> {
  const leaves: Uint8Array[] = [];

  for (const encode of encoded) {
    const leave = HASHER[hashType](u8aConcat(encode, nonceMap[encode]));

    leaves.push(leave);
  }

  const tree = makeMerkleTree(leaves, hashType);

  return {
    hashes: leaves.map((leave) => u8aToHex(leave)),
    rootHash: u8aToHex(bufferToU8a(tree.getRoot()))
  };
}

/**
 * calc rootHash from `this.credentialSubject`
 * @param hashType [[HashType]] defaults is Keccak256
 * @returns `rootHash` and `hashType` object
 */
export function calcRoothash(
  input: AnyJson,
  hashType: HashType = DEFAULT_ROOT_HASH_TYPE,
  nonceMap?: Record<HexString, HexString>
): RootHashResult {
  const values = Object.values(input);
  const encoded: HexString[] = values.map((value) => rlpEncode(value, hashType)).map((value) => u8aToHex(value));

  if (!nonceMap) {
    nonceMap = {};

    for (const encode of encoded) {
      nonceMap[encode] = randomAsHex(32);
    }
  }

  return {
    type: hashType,
    nonceMap,
    ...rootHashFromMerkle(encoded, nonceMap, hashType)
  };
}

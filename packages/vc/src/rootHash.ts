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

export function rootHashFromMerkle(
  hashes: HexString[],
  nonceMap: Record<HexString, HexString>,
  type: HashType
): HexString {
  const leaves: Uint8Array[] = [];

  for (const hash of hashes) {
    const leave = u8aConcat(hash, nonceMap[hash]);

    const hashLeave: Uint8Array = HASHER[type](leave);

    leaves.push(hashLeave);
  }

  const tree = new MerkleTree(leaves, merkleHash(type));

  return u8aToHex(bufferToU8a(tree.getRoot()));
}

/**
 * calc rootHash from `this.credentialSubject`
 * @param hashType [[HashType]] defaults is Keccak256
 * @returns `rootHash` and `hashType` object
 */
export function calcRoothash(
  input: AnyJson,
  type: HashType = DEFAULT_ROOT_HASH_TYPE,
  nonceMap?: Record<HexString, HexString>
): RootHashResult {
  const values = Object.values(input);
  const hashes: HexString[] = rlpEncode(values.map((value) => {
    if (Array.isArray(value)) {
      throw new Error('Not support array');
    }

    return value;
  }), type).map((value) => u8aToHex(value));

  if (!nonceMap) {
    nonceMap = {};

    for (const hash of hashes) {
      nonceMap[hash] = randomAsHex(32);
    }
  }

  return {
    type,
    hashes,
    nonceMap,
    rootHash: rootHashFromMerkle(hashes, nonceMap, type)
  };
}

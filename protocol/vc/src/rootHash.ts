// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { AnyJson, HashType, VerifiableCredentialVersion } from './types';

import { assert, bufferToU8a, u8aConcat, u8aToHex, u8aToU8a } from '@polkadot/util';
import { MerkleTree } from 'merkletreejs';

import { randomAsHex } from '@zcloak/crypto';

import { HASHER } from './hasher';
import { encodeAsSol, rlpEncode } from './utils';

export type RootHashResult = {
  rootHash: HexString;
  hashes?: HexString[];
  nonceMap?: Record<HexString, HexString>;
  type: HashType;
};

function merkleHash(hashType: HashType) {
  return (value: Buffer) => {
    const u8a = bufferToU8a(value);

    return HASHER[hashType](u8a);
  };
}

export function makeMerkleTree(leaves: (Uint8Array | HexString)[], hashType: HashType): MerkleTree {
  leaves = leaves.map((leave) => u8aToU8a(leave));

  return new MerkleTree(leaves, merkleHash(hashType));
}

/**
 * generate roothash from merkle tree, the merkle tree leaves is `hash(encoded[i], nonceMap[encoded[i]])`,
 * if you don't provide `nonceMap` param, the merkle tree leaves is `hash(encoded[i])`
 * @param encoded the encoded value, used to generate with nonce
 * @param hashType [[HashType]]
 * @param nonceMap the map of `encoded => nonce`, used to generate with encoded
 */
export function rootHashFromMerkle(
  encoded: HexString[],
  hashType: HashType,
  nonceMap?: Record<HexString, HexString>
): Omit<RootHashResult, 'type' | 'nonceMap'> {
  const leaves: Uint8Array[] = [];

  for (const encode of encoded) {
    if (nonceMap) {
      assert(nonceMap[encode], `Nonce not found in nonceMap with encode: ${encode}`);
    }

    const leave = HASHER[hashType](nonceMap ? u8aConcat(encode, nonceMap[encode]) : encode);
    leaves.push(leave);
  }

  const tree = makeMerkleTree(leaves, hashType);

  return {
    hashes: leaves.map((leave) => u8aToHex(leave)),
    rootHash: u8aToHex(bufferToU8a(tree.getRoot()))
  };
}

/**
 * @name calcRoothash
 * @summary calc rootHash from any json.
 * @description
 * calc rootHash with supplied `input` and `hashType`. Returns [[RootHashResult]].
 */
export function calcRoothash(input: AnyJson, hashType: HashType, version: VerifiableCredentialVersion): RootHashResult;
/**
 * @name calcRoothash
 * @summary calc rootHash from any json.
 * @description
 * calc rootHash with supplied `input` and `hashType`, the `nonceMap` must be passed. Returns [[RootHashResult]].
 *
 * if you pass an empty object for `nonceMap`, it will random 32-bytes value to the obect.
 */
export function calcRoothash(
  input: AnyJson,
  hashType: HashType,
  version: VerifiableCredentialVersion,
  nonceMap: Record<HexString, HexString>,
): RootHashResult;

export function calcRoothash(
  input: AnyJson,
  hashType: HashType,
  version: VerifiableCredentialVersion,
  nonceMap?: Record<HexString, HexString>,
): RootHashResult {
  const values = Object.values(input);
  let encoded: HexString[] = [];

  // if the version is `2` and the hash in merkletree is Keccak256, we assume this vc aims to be used on chain.
  if (version === '2') {
    if (hashType == 'Keccak256'){
      encoded = values.map((values) => encodeAsSol(values));
    } else {
      encoded = values.map((value) => rlpEncode(value, hashType)).map((value) => u8aToHex(value));
    }
  } else if (version === '0' || version === '1') {
    encoded = values.map((value) => rlpEncode(value, hashType)).map((value) => u8aToHex(value));
  } else {
    const check: never = version;
    throw new Error(`VC Version invalid, the wrong VC Version is ${check}`);
  }

  if (nonceMap) {
    for (const encode of encoded) {
      if (!nonceMap[encode]) nonceMap[encode] = randomAsHex(32);
    }
  }

  return {
    type: hashType,
    nonceMap,
    ...rootHashFromMerkle(encoded, hashType, nonceMap)
  };
}

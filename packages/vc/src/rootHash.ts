// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { AnyJson, HashType } from './types';

export type RootHashResult = {
  rootHash: HexString;
  hashes: HexString[];
  nonceMap: Record<HexString, HexString>;
  type: HashType;
};

export function rootHashFromMerkle(
  hashes: HexString[],
  nonceMap: Record<HexString, HexString>
): Omit<RootHashResult, 'type'> {
  return {
    hashes,
    nonceMap,
    rootHash: '0x'
  };
}

/**
 * calc rootHash from `this.credentialSubject`
 * @param hashType [[HashType]] defaults is Keccak256
 * @returns `rootHash` and `hashType` object
 */
export function calcRoothash(
  input: AnyJson,
  nonceMap?: Record<HexString, HexString>,
  type: HashType = 'Rescue'
): RootHashResult {
  nonceMap = {};

  return {
    type,
    ...rootHashFromMerkle([], nonceMap)
  };
}

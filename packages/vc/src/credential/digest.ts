// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidUrl } from '@zcloak/did-resolver/types';
import type { HashType } from '../types';

export type DigestResult = { digest: HexString; type: HashType };

// todo: make it clearer, e.g. DigestFactors
type Input = {
  rootHash: HexString;
  holder: DidUrl;
  expirationDate?: number;
  ctype: HexString;
};

/**
 * calc credential digest
 * 1. it will encode by ctype, expirationDate, rootHash, holder
 * 2. generate hash value use provide [[hashType]]
 * @param input [[Input]] object
 * @param hashType defaults is Keccak256
 * @returns [[DigestResult]]
 */
export function calcDigest(input: Input, hashType: HashType = 'Keccak256'): DigestResult {
  return {
    type: hashType,
    digest: '0x'
  };
}

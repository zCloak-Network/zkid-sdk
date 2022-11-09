// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidUrl } from '@zcloak/did-resolver/types';
import type { HashType } from './types';

import { DEFAULT_DIGEST_HASH_TYPE } from './defaults';

export type DigestResult = { digest: HexString; type: HashType };

export type DigestPayload = {
  rootHash: HexString;
  holder: DidUrl;
  expirationDate?: number;
  ctype: HexString;
};

/**
 * calc credential digest
 * 1. it will encode by ctype, expirationDate, rootHash, holder
 * 2. generate hash value use provide [[hashType]]
 * @param payload [[DigestPayload]] object
 * @param hashType defaults is Keccak256
 * @returns [[DigestResult]]
 */
export function calcDigest(
  payload: DigestPayload,
  hashType: HashType = DEFAULT_DIGEST_HASH_TYPE
): DigestResult {
  return {
    type: hashType,
    digest: '0x'
  };
}

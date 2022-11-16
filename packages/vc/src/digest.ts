// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidUrl } from '@zcloak/did-resolver/types';
import type { HashType } from './types';

import { numberToU8a, stringToU8a, u8aConcat, u8aToHex } from '@polkadot/util';

import { DEFAULT_DIGEST_HASH_TYPE } from './defaults';
import { HASHER } from './hasher';

export type DigestResult = { digest: HexString; type: HashType };

export type DigestPayload = {
  /**
   * rootHash of credential subject
   */
  rootHash: HexString;
  /**
   * the holder of vc
   */
  holder: DidUrl;
  /**
   * expiration date
   */
  expirationDate?: number;
  /**
   * ctype hash
   */
  ctype: HexString;
};

/**
 * @name calcDigest
 * @summary calc credential digest
 * @description
 * 1. it will encode by ctype, expirationDate, rootHash, holder
 * 2. generate hash value use provide [[hashType]]
 * @example
 * ```typescript
 * import { calcDigest } from '@zcloak/vc';
 *
 * calcDigest({ rootHash: '0x...', holder: 'did:zk:...', ctype: '0x...' }); // { digest: '0x...', type: 'Keccak256' }
 * ```
 */
export function calcDigest(
  payload: DigestPayload,
  hashType: HashType = DEFAULT_DIGEST_HASH_TYPE
): DigestResult {
  const encoded = u8aConcat(
    payload.rootHash,
    stringToU8a(payload.holder),
    numberToU8a(payload.expirationDate),
    payload.ctype
  );

  return {
    type: hashType,
    digest: u8aToHex(HASHER[hashType](encoded))
  };
}

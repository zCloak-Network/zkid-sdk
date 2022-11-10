// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '../types';

import { blake3 } from '@noble/hashes/blake3';
import { u8aToHex, u8aToU8a } from '@polkadot/util';

/**
 * @name blake3AsU8a
 * @summary Creates a blake3 u8a from the input.
 * @description
 * From a `Uint8Array` input, create the blake3 and return the result as a u8a.
 * @example
 * <BR>
 *
 * ```javascript
 * import { blake3AsU8a } from '@zcloak/crypto';
 *
 * blake3AsU8a('abcd1234'); // => [135,118,41,144,40,252,65,100,204,245,252,44,138,223,209,13,119,200,131,115,120,31,210,44,253,198,228,212,122,61,87,245]
 * ```
 */
export function blake3AsU8a(data: HexString | Uint8Array | string, bitLength: 64 | 128 | 256 | 384 | 512 = 256, key?: Uint8Array | null): Uint8Array {
  const byteLength = Math.ceil(bitLength / 8);

  const u8a = u8aToU8a(data);

  return blake3(u8a, { dkLen: byteLength, key: key || undefined });
}

/**
 * @description Creates a blake3 hex from the input.
 */
export function blake3AsHex(data: HexString | Uint8Array | string): HexString {
  return u8aToHex(blake3AsU8a(data));
}

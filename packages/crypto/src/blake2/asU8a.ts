// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';

import { blake2b } from '@noble/hashes/blake2b';
import { u8aToHex, u8aToU8a } from '@polkadot/util';

/**
 * @name blake2AsU8a
 * @summary Creates a blake2b u8a from the input.
 * @description
 * From a `Uint8Array` input, create the blake2b and return the result as a u8a with the specified `bitLength`.
 * @example
 * <BR>
 *
 * ```javascript
 * import { blake2AsU8a } from '@zcloak/crypto';
 *
 * blake2AsU8a('abc'); // => [0xba, 0x80, 0xa5, 0x3f, 0x98, 0x1c, 0x4d, 0x0d]
 * ```
 */
export function blake2AsU8a(
  data: HexString | Uint8Array | string,
  bitLength: 64 | 128 | 256 | 384 | 512 = 256,
  key?: Uint8Array | null
): Uint8Array {
  const byteLength = Math.ceil(bitLength / 8);
  const u8a = u8aToU8a(data);

  return blake2b(u8a, { dkLen: byteLength, key: key || undefined });
}

/**
 * @name blake2AsHex
 * @description Creates a blake2b hex from the input.
 */
export function blake2AsHex(
  data: HexString | Uint8Array | string,
  bitLength: 64 | 128 | 256 | 384 | 512 = 256,
  key?: Uint8Array | null
): HexString {
  return u8aToHex(blake2AsU8a(data, bitLength, key));
}

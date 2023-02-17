// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '../types';

import { blake3 } from '@noble/hashes/blake3';
import { u8aToHex, u8aToU8a } from '@polkadot/util';

/**
 * @name blake32to1AsU8a
 * @summary Creates a blake3 u8a from the input.
 * @description
 * From a `Uint8Array` input, create the blake3 using padding and iterative rules, and return the result as a u8a.
 *
 * If `bitLength` is not 256 by default, this function will get the same result as `blake3AsU8a` from `@zcloak/crypto`.
 *
 * If `bitLength` is 256, then this function will do the following things:
 *   - If the `Uint8Array` input's length is less than 32, we will padding it to 32 bytes, and will not perform blake3.
 *   - If the `Uint8Array` input's length is 33-64 bytes, we will padding it to 64 bytes, and do one-time blake3.
 *   - If the `Uint8Array` input's length is 64-96 bytes, we will padding it to 96 bytes, and do blake3 for the first 64 bytes, and generate a 32-byte result; Then, concat the '32-bytes hash result' with the remain 32 bytes, do another blake3;
 *
 *    So, this function will automatically do padding and iterative blake3 hash for the `Uint8Array` input.
 * @example
 * <BR>
 *
 * ```javascript
 * import { blake32to1AsU8a } from '@zcloak/crypto';
 *
 * blake32to1AsU8a(new Uint8Array([97, 98, 99])); // => [97, 98, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
 * blake32to1AsU8a(new Uint8Array([54, 55, 56, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100])); // => [232, 47,  46, 107,  55, 116,  93, 176, 134, 64,  55, 208, 111, 192, 208, 198, 153, 56, 115, 176, 118, 175,  22,  23, 115, 46, 199, 235, 163, 203, 250,  51]
 * ```
 */
export function blake32to1AsU8a(
  data: HexString | Uint8Array | string,
  bitLength: 64 | 128 | 256 | 384 | 512 = 256,
  key?: Uint8Array | null
): Uint8Array {
  const byteLength = Math.ceil(bitLength / 8);
  const u8a = u8aToU8a(data);
  const sliceCount =
    u8a.length % 32 === 0 ? Math.floor(u8a.length / 32) : Math.floor(u8a.length / 32) + 1;

  const dataPadding = new Uint8Array(32 * sliceCount);

  dataPadding.set(u8a);

  let blake3Result = dataPadding.slice(0, 32);

  // if the data is lte 32, we do not need to hash it.
  if (sliceCount === 1) {
    blake3Result = dataPadding;
  } else {
    for (let i = 1; i < sliceCount; i++) {
      const interHash = new Uint8Array(64);

      interHash.set(blake3Result);
      interHash.set(dataPadding.slice(32 * i, 32 * (i + 1)), 32);
      blake3Result = blake3(interHash, { dkLen: byteLength, key: key || undefined });
    }
  }

  return byteLength === 32
    ? blake3Result
    : blake3(u8a, { dkLen: byteLength, key: key || undefined });
}

/**
 * @description Creates a blake3 hex from the input.
 */
export function blake32to1AsHex(data: HexString | Uint8Array | string): HexString {
  return u8aToHex(blake32to1AsU8a(data));
}

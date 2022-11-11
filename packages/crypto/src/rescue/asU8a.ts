// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '../types';

import { assert, u8aToHex, u8aToU8a } from '@polkadot/util';

import { rescueHash } from '@zcloak/wasm';

/**
 * @name rescueAsU8a
 * @summary Creates a rescue u8a from the input.
 * @description
 * From a `Uint8Array` input, create the rescue and return the result as a u8a.
 * @example
 * <BR>
 *
 * ```javascript
 * import { rescueAsU8a } from '@zcloak/crypto';
 *
 * rescueAsU8a('abcd1234'); // => [135,118,41,144,40,252,65,100,204,245,252,44,138,223,209,13,119,200,131,115,120,31,210,44,253,198,228,212,122,61,87,245]
 * ```
 */
export function rescueAsU8a(data: HexString | Uint8Array | string, asU64a = false): Uint8Array {
  const u8a = u8aToU8a(data);

  let u64a: BigUint64Array;

  if (asU64a) {
    u64a = new BigUint64Array(u8a.length);
    u8a.forEach((value, index) => {
      u64a[index] = BigInt(value);
    });
  } else {
    assert(u8a.length % 8 === 0, 'byte length of BigUint64Array should be a multiple of 8');
    u64a = new BigUint64Array(u8a.buffer);
  }

  const result = rescueHash(u64a);

  const resultU8a = new Uint8Array(result.buffer);

  return resultU8a;
}

/**
 * @description Creates a rescue hex from the input.
 */
export function rescueAsHex(data: HexString | Uint8Array | string): HexString {
  return u8aToHex(rescueAsU8a(data));
}

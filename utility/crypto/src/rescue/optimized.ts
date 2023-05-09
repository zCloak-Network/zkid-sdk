// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '../types';

import { assert, u8aToHex, u8aToU8a } from '@polkadot/util';

import { rescuePrimeOptimizedHash } from '../wasm';

/**
 * @name rescuePrimeOptimizedAsU8a
 * @summary Creates a rescue prime u8a from the input.
 * @description
 * From a `Uint8Array` input, create the rescue prime and return the result as a u8a.
 *
 * if `asU64a` set true, the u8a data each items will as `biguint64`,
 * if `asU64a` set false, the u8a will transform to buffer and generate `BigUint64Array`.
 * @example
 * <BR>
 *
 * ```javascript
 * import { rescuePrimeOptimizedAsU8a } from '@zcloak/crypto';
 *
 * rescuePrimeOptimizedAsU8a('abcd1234'); // => [16, 75, 170, 23, 222, 70, 142, 40, 16, 103, 147, 222, 221, 21, 60, 164, 69, 106, 95, 221, 24, 137, 217, 4, 226, 10, 28, 45, 210, 33, 73, 44]
 * ```
 */
export function rescuePrimeOptimizedAsU8a(data: HexString | Uint8Array | string, asU64a = false): Uint8Array {
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

  const result = rescuePrimeOptimizedHash(u64a);

  const resultU8a = new Uint8Array(result.buffer);

  return resultU8a;
}

/**
 * @description Creates a rescue prime optimized hex from the input.
 */
export function rescuePrimeOptimizedAsHex(data: HexString | Uint8Array | string, asU64a?: boolean): HexString {
  return u8aToHex(rescuePrimeOptimizedAsU8a(data, asU64a));
}

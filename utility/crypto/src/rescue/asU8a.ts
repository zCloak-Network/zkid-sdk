// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '../types';

import { assert, u8aToHex, u8aToU8a } from '@polkadot/util';

import { rescuePrimeHash } from '@zcloak/wasm-bridge';

/**
 * @name rescuePrimeAsU8a
 * @summary Creates a rescue prime u8a from the input.
 * @description
 * From a `Uint8Array` input, create the rescue prime and return the result as a u8a.
 * @example
 * <BR>
 *
 * ```javascript
 * import { rescuePrimeAsU8a } from '@zcloak/crypto';
 *
 * rescuePrimeAsU8a('abcd1234'); // => [212, 187, 16, 176, 223, 111, 125, 152, 232, 223, 53, 52, 239, 99, 173, 71, 181, 59, 174, 51, 80, 175, 78, 174, 66, 122, 204, 8, 39, 100, 158, 253]
 * ```
 */
export function rescuePrimeAsU8a(data: HexString | Uint8Array | string, asU64a = false): Uint8Array {
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

  const result = rescuePrimeHash(u64a);

  const resultU8a = new Uint8Array(result.buffer);

  return resultU8a;
}

/**
 * @description Creates a rescue prime hex from the input.
 */
export function rescuePrimeAsHex(data: HexString | Uint8Array | string): HexString {
  return u8aToHex(rescuePrimeAsU8a(data));
}

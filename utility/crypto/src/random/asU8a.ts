// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { u8aToHex } from '@polkadot/util';

import { HexString } from '../types';

/**
 * @name randomAsU8a
 * @summary Creates a Uint8Array filled with random bytes.
 * @description
 * Returns a `Uint8Array` with the specified (optional) length filled with random bytes.
 * @example
 * <BR>
 *
 * ```javascript
 * import { randomAsU8a } from '@zcloak/crypto';
 *
 * randomAsU8a(); // => Uint8Array([...])
 * ```
 */
export function randomAsU8a(length = 32): Uint8Array {
  const value = new Uint8Array(length);

  value.forEach((_, i) => {
    value[i] = Math.floor(Math.random() * 256);
  });

  return value;
}

/**
 * @name randomAsHex
 * @description Creates a hex string filled with random bytes.
 */
export function randomAsHex(length = 32): HexString {
  return u8aToHex(randomAsU8a(length));
}

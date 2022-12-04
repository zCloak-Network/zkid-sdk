// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { u8aToHex, u8aToU8a } from '@polkadot/util';

import { keccak256, keccak512 } from '@zcloak/wasm';

import { HexString } from '../types';

/**
 * @name keccak256AsU8a
 * @description Creates a keccak256 Uint8Array from the input.
 * @example
 * <BR>
 *
 * ```javascript
 * import { keccak256AsU8a } from '@zcloak/crypto';
 *
 * keccak256AsU8a('123'); // => Uint8Array
 * ```
 */
export function keccak256AsU8a(value: Uint8Array | HexString | string): Uint8Array {
  return keccak256(u8aToU8a(value));
}

/**
 * @name keccak512AsU8a
 * @description Creates a keccak512 Uint8Array from the input.
 * @example
 * <BR>
 *
 * ```javascript
 * import { keccak512AsU8a } from '@zcloak/crypto';
 *
 * keccak512AsU8a('123'); // => Uint8Array
 * ```
 */
export function keccak512AsU8a(value: Uint8Array | HexString | string): Uint8Array {
  return keccak512(u8aToU8a(value));
}

/**
 * @name keccak256AsHex
 * @description Creates a keccak256 hex string from the input.
 */
export function keccak256AsHex(value: Uint8Array | HexString | string): HexString {
  return u8aToHex(keccak256AsU8a(value));
}

/**
 * @name keccak512AsHex
 * @description Creates a keccak512 hex string from the input.
 */
export function keccak512AsHex(value: Uint8Array | HexString | string): HexString {
  return u8aToHex(keccak512AsU8a(value));
}

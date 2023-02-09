// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { keccak_256 as keccak256, keccak_512 as keccak512 } from '@noble/hashes/sha3';
import { u8aToHex, u8aToU8a } from '@polkadot/util';

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

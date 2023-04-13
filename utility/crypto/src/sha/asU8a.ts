// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { sha256 } from '@noble/hashes/sha256';
import { sha512 } from '@noble/hashes/sha512';
import { u8aToU8a } from '@polkadot/util';

import { HexString } from '../types';

/**
 * @name sha256AsU8a
 * @summary Creates a sha256 Uint8Array from the input.
 */
export function sha256AsU8a(value: Uint8Array | HexString | string): Uint8Array {
  const u8a = u8aToU8a(value);

  return sha256(u8a);
}

/**
 * @name sha512AsU8a
 * @summary Creates a sha512 Uint8Array from the input.
 */
export function sha512AsU8a(value: Uint8Array | HexString | string): Uint8Array {
  const u8a = u8aToU8a(value);

  return sha512(u8a);
}

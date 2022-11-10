// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable camelcase */

import { rescue_hash, u8_to_u64, u64_to_u8 } from './wasm';

export function rescueHash(values: string): BigUint64Array {
  return rescue_hash(values);
}

export function u8ToU64(values: string): BigUint64Array {
  return u8_to_u64(values);
}

export function u64ToU8(values: string): Uint8Array {
  return u64_to_u8(values);
}

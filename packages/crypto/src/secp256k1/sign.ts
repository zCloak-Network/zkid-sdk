// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Keypair } from '../types';

import { secp256k1Sign as wasm } from '@zcloak/wasm';

import { keccak256AsU8a } from '../keccak';

/**
 * @name secp256k1Sign
 * @description Returns message signature of `message`, using the supplied pair
 */
export function secp256k1Sign(
  message: Uint8Array | string,
  { secretKey }: Partial<Keypair>
): Uint8Array {
  if (secretKey?.length !== 32) {
    throw new Error('Expected valid secp256k1 secretKey, 32-bytes');
  }

  const data = keccak256AsU8a(message);

  return wasm(data, secretKey);
}

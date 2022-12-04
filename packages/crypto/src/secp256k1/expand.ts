// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { secp256k1Expand as wasm } from '@zcloak/wasm';

export function secp256k1Expand(publicKey: Uint8Array): Uint8Array {
  if (publicKey.length === 65) {
    return publicKey.subarray(1);
  }

  if (publicKey.length !== 33) {
    throw new Error('Invalid publicKey provided');
  }

  return wasm(publicKey).subarray(1);
}

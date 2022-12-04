// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { secp256k1Compress as wasm } from '@zcloak/wasm';

export function secp256k1Compress(publicKey: Uint8Array): Uint8Array {
  if (publicKey.length === 33) {
    return publicKey;
  }

  if (publicKey.length !== 65) {
    throw new Error('Invalid publicKey provided');
  }

  return wasm(publicKey);
}

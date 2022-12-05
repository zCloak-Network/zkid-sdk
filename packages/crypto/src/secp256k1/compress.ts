// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Point } from '@noble/secp256k1';

export function secp256k1Compress(publicKey: Uint8Array): Uint8Array {
  if (publicKey.length === 33) {
    return publicKey;
  }

  if (publicKey.length !== 65) {
    throw new Error('Invalid publicKey provided');
  }

  return Point.fromHex(publicKey).toRawBytes(true);
}

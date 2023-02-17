// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Point } from '@noble/secp256k1';
import { bnToU8a, u8aConcat } from '@polkadot/util';

import { BN_BE_256_OPTS } from '../bn';

export function secp256k1Expand(publicKey: Uint8Array): Uint8Array {
  if (publicKey.length === 65) {
    return publicKey.subarray(1);
  }

  if (publicKey.length !== 33) {
    throw new Error('Invalid publicKey provided');
  }

  const { x, y } = Point.fromHex(publicKey);

  return u8aConcat(bnToU8a(x, BN_BE_256_OPTS), bnToU8a(y, BN_BE_256_OPTS));
}

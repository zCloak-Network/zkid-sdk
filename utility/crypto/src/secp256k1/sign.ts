// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Keypair } from '../types';

import { Signature, signSync } from '@noble/secp256k1';
import { bnToU8a, u8aConcat } from '@polkadot/util';

import { BN_BE_256_OPTS } from '../bn';

/**
 * @name secp256k1Sign
 * @description Returns message signature of `message`, using the supplied pair
 */
export function secp256k1Sign(message: Uint8Array | string, { secretKey }: Partial<Keypair>): Uint8Array {
  if (secretKey?.length !== 32) {
    throw new Error('Expected valid secp256k1 secretKey, 32-bytes');
  }

  const [sigBytes, recoveryParam] = signSync(message, secretKey, {
    canonical: true,
    recovered: true
  });
  const { r, s } = Signature.fromHex(sigBytes);

  return u8aConcat(bnToU8a(r, BN_BE_256_OPTS), bnToU8a(s, BN_BE_256_OPTS), new Uint8Array([recoveryParam || 0]));
}

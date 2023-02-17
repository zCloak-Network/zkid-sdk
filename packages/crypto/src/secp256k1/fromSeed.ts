// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString, Keypair } from '../types';

import { getPublicKey } from '@noble/secp256k1';
import { u8aToU8a } from '@polkadot/util';

/**
 * @name secp256k1PairFromSeed
 * @description Returns a object containing a `publicKey` & `secretKey` generated from the supplied seed.
 */
export function secp256k1PairFromSeed(seed: Uint8Array | HexString): Keypair {
  const seedU8a = u8aToU8a(seed);

  if (seedU8a.length !== 32) {
    throw new Error('Expected valid 32-byte private key as a seed');
  }

  return {
    publicKey: getPublicKey(seedU8a, true),
    secretKey: seedU8a
  };
}

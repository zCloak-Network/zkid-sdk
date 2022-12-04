// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString, Keypair } from '../types';

import { u8aEmpty, u8aToU8a } from '@polkadot/util';

import { secp256k1FromSeed } from '@zcloak/wasm';

/**
 * @name secp256k1PairFromSeed
 * @description Returns a object containing a `publicKey` & `secretKey` generated from the supplied seed.
 */
export function secp256k1PairFromSeed(seed: Uint8Array | HexString): Keypair {
  const seedU8a = u8aToU8a(seed);

  if (seedU8a.length !== 32) {
    throw new Error('Expected valid 32-byte private key as a seed');
  }

  const full = secp256k1FromSeed(seedU8a);
  const publicKey = full.slice(32);

  // There is an issue with the secp256k1 when running in an ASM.js environment where
  // it seems that the lazy static section yields invalid results on the _first_ run.
  // If this happens, fail outright, we cannot allow invalid return values
  // https://github.com/polkadot-js/wasm/issues/307
  if (u8aEmpty(publicKey)) {
    throw new Error('Invalid publicKey generated from WASM interface');
  }

  return {
    publicKey,
    secretKey: full.slice(0, 32)
  };
}

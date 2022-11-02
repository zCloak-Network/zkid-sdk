// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString, Keypair } from './types';

import {
  convertPublicKeyToCurve25519,
  convertSecretKeyToCurve25519,
  ed25519PairFromSeed
} from '@polkadot/util-crypto';

import { u8aToU8a } from '@polkadot/util';

/**
 * Returns a object containing a `publicKey` & `secretKey` generated from the supplied secretKey.
 */
export function x25519PairFromSeed(seed: HexString | Uint8Array): Keypair {
  const pair = ed25519PairFromSeed(u8aToU8a(seed));

  return convertEd25519ToX25519(pair);
}

export function convertEd25519ToX25519(pair: Keypair): Keypair {
  return {
    secretKey: convertSecretKeyToCurve25519(pair.secretKey),
    publicKey: convertPublicKeyToCurve25519(pair.publicKey)
  };
}

// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Keypair } from '../types';

import nacl from 'tweetnacl';

/**
 * @name ed25519PairFromSeed
 * @summary Creates a new public/secret keypair from a seed.
 * @description
 * Returns a object containing a `publicKey` & `secretKey` generated from the supplied seed.
 * @example
 * <BR>
 *
 * ```javascript
 * import { ed25519PairFromSeed } from '@zcloak/crypto';
 *
 * ed25519PairFromSeed(...); // => { secretKey: [...], publicKey: [...] }
 * ```
 */
export function ed25519PairFromSeed(seed: Uint8Array): Keypair {
  return nacl.sign.keyPair.fromSeed(seed);
}

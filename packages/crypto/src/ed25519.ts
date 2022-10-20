import type { HexString, Keypair } from './types';

import { u8aToU8a } from '@polkadot/util';
import * as crypto from '@polkadot/util-crypto';

/**
 * Returns message signature of `message`, using the `secretKey`.
 */
export function ed25519Sign(
  message: HexString | Uint8Array,
  secretKey: HexString | Uint8Array
): Uint8Array {
  return crypto.ed25519Sign(message, { secretKey: u8aToU8a(secretKey) });
}

/**
 * Verifies the `signature` on `message` with the supplied `publicKey`. Returns `true` on sucess, `false` otherwise.
 */
export function ed25519Verify(
  message: HexString | Uint8Array,
  signature: HexString | Uint8Array,
  publicKey: HexString | Uint8Array
): boolean {
  return crypto.ed25519Verify(message, signature, publicKey);
}

/**
 * Returns a object containing a `publicKey` & `secretKey` generated from the supplied seed.
 */
export function ed25519PairFromSeed(seed: HexString | Uint8Array): Keypair {
  return crypto.ed25519PairFromSeed(u8aToU8a(seed));
}

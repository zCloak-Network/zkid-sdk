import type { Keypair } from './types';

import { u8aToU8a } from '@polkadot/util';
import nacl from 'tweetnacl';

import { HexString } from '../types';

/**
 * Returns message signature of `message`, using the `secretKey`.
 */
export function ed25519Sign(
  message: HexString | Uint8Array,
  secretKey: HexString | Uint8Array
): Uint8Array {
  return nacl.sign.detached(u8aToU8a(message), u8aToU8a(secretKey));
}

/**
 * Verifies the `signature` on `message` with the supplied `publicKey`. Returns `true` on sucess, `false` otherwise.
 */
export function ed25519Verify(
  message: HexString | Uint8Array,
  signature: HexString | Uint8Array,
  publicKey: HexString | Uint8Array
): boolean {
  const messageU8a = u8aToU8a(message);
  const publicKeyU8a = u8aToU8a(publicKey);
  const signatureU8a = u8aToU8a(signature);

  if (publicKeyU8a.length !== 32) {
    throw new Error(`Invalid publicKey, received ${publicKeyU8a.length}, expected 32`);
  } else if (signatureU8a.length !== 64) {
    throw new Error(`Invalid signature, received ${signatureU8a.length} bytes, expected 64`);
  }

  return nacl.sign.detached.verify(messageU8a, signatureU8a, publicKeyU8a);
}

/**
 * Returns a object containing a `publicKey` & `secretKey` generated from the supplied seed.
 */
export function ed25519PairFromSeed(seed: HexString | Uint8Array): Keypair {
  return nacl.sign.keyPair.fromSeed(u8aToU8a(seed));
}

/**
 * Returns a object containing a `publicKey` & `secretKey` generated from the supplied secretKey.
 */
export function ed25519PairFromSecret(secretKey: HexString | Uint8Array): Keypair {
  return nacl.sign.keyPair.fromSecretKey(u8aToU8a(secretKey));
}

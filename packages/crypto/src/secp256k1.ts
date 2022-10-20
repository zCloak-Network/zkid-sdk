import type { HexString, Keypair } from './types';

import { stringToU8a, u8aConcat, u8aToU8a } from '@polkadot/util';
import * as crypto from '@polkadot/util-crypto';

/**
 * Returns message signature of `message`, using the supplied pair
 */

export function secp256k1Sign(
  message: HexString | Uint8Array,
  secretKey: HexString | Uint8Array
): Uint8Array {
  const messageU8a = u8aToU8a(message);
  const secretKeyU8a = u8aToU8a(secretKey);

  if (secretKeyU8a?.length !== 32) {
    throw new Error('Expected valid secp256k1 secretKey, 32-bytes');
  }

  return crypto.secp256k1Sign(messageU8a, { secretKey: secretKeyU8a }, 'keccak');
}

/**
 * Verifies the signature of `message`, using the supplied pair
 */
export function secp256k1Verify(
  msgHash: HexString | Uint8Array,
  signature: HexString | Uint8Array,
  publicKey: HexString | Uint8Array
): boolean {
  return crypto.secp256k1Verify(msgHash, signature, crypto.ethereumEncode(publicKey), 'keccak');
}

/**
 * Returns a object containing a `publicKey` & `secretKey` generated from the supplied secretKey.
 */
export function secp256k1PairFromSeed(seed: HexString | Uint8Array): Keypair {
  const seedU8a = u8aToU8a(seed);

  return crypto.secp256k1PairFromSeed(seedU8a);
}

export function hashMessage(message: HexString | Uint8Array): Uint8Array {
  const messageU8a = u8aToU8a(message);

  return u8aConcat(
    stringToU8a('\x19Ethereum Signed Message:\n'),
    stringToU8a(String(messageU8a.length)),
    message
  );
}

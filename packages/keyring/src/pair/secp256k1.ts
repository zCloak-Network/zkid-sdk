import type { HexString } from '../types';
import type { Keypair } from './types';

import { stringToU8a, u8aConcat, u8aEq, u8aToU8a } from '@polkadot/util';
import { keccak256 } from 'ethereum-cryptography/keccak';
import {
  getPublicKey,
  recoverPublicKey,
  Signature,
  signSync
} from 'ethereum-cryptography/secp256k1';

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

  const [sigBytes, recoveryParam] = signSync(keccak256(messageU8a), secretKeyU8a, {
    canonical: true,
    recovered: true
  });

  return u8aConcat(
    Signature.fromHex(sigBytes).toCompactRawBytes(),
    new Uint8Array([recoveryParam || 0])
  );
}

/**
 * Verifies the signature of `message`, using the supplied pair
 */
export function secp256k1Verify(
  msgHash: HexString | Uint8Array,
  signature: HexString | Uint8Array,
  publicKey: HexString | Uint8Array
): boolean {
  const sig = u8aToU8a(signature);

  if (sig.length !== 65) {
    throw new Error(`Expected signature with 65 bytes, ${sig.length} found instead`);
  }

  const msgHashU8a = u8aToU8a(msgHash);

  const publicKeyResult = recoverPublicKey(
    keccak256(msgHashU8a),
    Signature.fromCompact(sig.slice(0, 64)),
    sig[64],
    true
  );

  return u8aEq(publicKeyResult, publicKey);
}

/**
 * Returns a object containing a `publicKey` & `secretKey` generated from the supplied secretKey.
 */
export function secp256k1PairFromSecret(secretKey: HexString | Uint8Array): Keypair {
  const secretKeyU8a = u8aToU8a(secretKey);

  if (secretKeyU8a.length !== 32) {
    throw new Error('Expected valid 32-byte private key as a secretKey');
  }

  return {
    publicKey: getPublicKey(secretKeyU8a, true),
    secretKey: secretKeyU8a
  };
}

export function hashMessage(message: HexString | Uint8Array): Uint8Array {
  const messageU8a = u8aToU8a(message);

  return u8aConcat(
    stringToU8a('\x19Ethereum Signed Message:\n'),
    stringToU8a(String(messageU8a.length)),
    message
  );
}

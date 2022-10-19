import type { HexString } from '../types';
import type { Keypair } from './types';

import { u8aToU8a } from '@polkadot/util';
import nacl, { randomBytes } from 'tweetnacl';

interface Sealed {
  sealed: Uint8Array;
  nonce: Uint8Array;
}

/**
 * Returns an encrypted message which can be open only by receiver's secretKey. If the `nonce` was not supplied, a random value is generated.
 */
export function naclSeal(
  message: HexString | Uint8Array,
  senderBoxSecret: HexString | Uint8Array,
  receiverBoxPublic: HexString | Uint8Array,
  nonce: HexString | Uint8Array = randomBytes(24)
): Sealed {
  const messageU8a = u8aToU8a(message);
  const nonceU8a = u8aToU8a(nonce);
  const senderBoxSecretU8a = u8aToU8a(senderBoxSecret);
  const receiverBoxPublicU8a = u8aToU8a(receiverBoxPublic);

  return {
    nonce: nonceU8a,
    sealed: nacl.box(messageU8a, nonceU8a, receiverBoxPublicU8a, senderBoxSecretU8a)
  };
}

/**
 * Returns a message sealed by the sender, using the receiver's `secret` and `nonce`.
 */
export function naclOpen(
  sealed: HexString | Uint8Array,
  nonce: HexString | Uint8Array,
  senderBoxPublic: HexString | Uint8Array,
  receiverBoxSecret: HexString | Uint8Array
): Uint8Array | null {
  const sealedU8a = u8aToU8a(sealed);
  const nonceU8a = u8aToU8a(nonce);
  const senderBoxPublicU8a = u8aToU8a(senderBoxPublic);
  const receiverBoxSecretU8a = u8aToU8a(receiverBoxSecret);

  return nacl.box.open(sealedU8a, nonceU8a, senderBoxPublicU8a, receiverBoxSecretU8a) || null;
}

/**
 * Returns a object containing a `publicKey` & `secretKey` generated from the supplied secretKey.
 */
export function x25519PairFromSecret(secretKey: HexString | Uint8Array): Keypair {
  const secretKeyU8a = u8aToU8a(secretKey);

  if (secretKeyU8a.length !== 32) {
    throw new Error('Expected valid 32-byte private key as a secretKey');
  }

  return nacl.box.keyPair.fromSecretKey(secretKeyU8a);
}

import nacl, { randomBytes } from 'tweetnacl';

interface Sealed {
  sealed: Uint8Array;
  nonce: Uint8Array;
}

/**
 * Returns an encrypted message which can be open only by receiver's secretKey. If the `nonce` was not supplied, a random value is generated.
 */
export function naclSeal(
  message: Uint8Array,
  senderBoxSecret: Uint8Array,
  receiverBoxPublic: Uint8Array,
  nonce: Uint8Array = randomBytes(24)
): Sealed {
  return {
    nonce,
    sealed: nacl.box(message, nonce, receiverBoxPublic, senderBoxSecret)
  };
}

/**
 * Returns a message sealed by the sender, using the receiver's `secret` and `nonce`.
 */
export function naclOpen(
  sealed: Uint8Array,
  nonce: Uint8Array,
  senderBoxPublic: Uint8Array,
  receiverBoxSecret: Uint8Array
): Uint8Array | null {
  return nacl.box.open(sealed, nonce, senderBoxPublic, receiverBoxSecret) || null;
}

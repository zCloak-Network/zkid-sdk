// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from './types';

import { u8aToU8a } from '@polkadot/util';
import nacl from 'tweetnacl';

import { randomAsU8a } from './random';

interface Sealed {
  sealed: Uint8Array;
  nonce: Uint8Array;
}

interface Encrypted {
  encrypted: Uint8Array;
  nonce: Uint8Array;
}

/**
 * Returns an encrypted message which can be open only by receiver's secretKey. If the `nonce` was not supplied, a random value is generated.
 */
export function naclSeal(
  message: HexString | Uint8Array,
  senderBoxSecret: HexString | Uint8Array,
  receiverBoxPublic: HexString | Uint8Array,
  nonce: HexString | Uint8Array = randomAsU8a(24)
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
 * Returns an encrypted message, using the `secretKey` and `nonce`. If the `nonce` was not supplied, a random value is generated.
 */
export function naclEncrypt(
  message: HexString | Uint8Array,
  secret: HexString | Uint8Array,
  nonce: HexString | Uint8Array = randomAsU8a(24)
): Encrypted {
  const messageU8a = u8aToU8a(message);
  const nonceU8a = u8aToU8a(nonce);
  const secretU8a = u8aToU8a(secret);

  return {
    encrypted: nacl.secretbox(messageU8a, nonceU8a, secretU8a),
    nonce: nonceU8a
  };
}

/**
 * Returns an decrypted message, using the `secret` and `nonce`.
 */
export function naclDecrypt(
  encrypted: HexString | Uint8Array,
  nonce: HexString | Uint8Array,
  secret: HexString | Uint8Array
): Uint8Array | null {
  const encryptedU8a = u8aToU8a(encrypted);
  const nonceU8a = u8aToU8a(nonce);
  const secretU8a = u8aToU8a(secret);

  return nacl.secretbox.open(encryptedU8a, nonceU8a, secretU8a) || null;
}

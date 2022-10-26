// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Keypair } from '@zcloak/crypto/types';

import { assert, u8aEq, u8aFixLength } from '@polkadot/util';

import { naclDecrypt, scryptEncode, scryptFromU8a } from '@zcloak/crypto';

import { NONCE_LENGTH, PKCS8_DIVIDER, PKCS8_HEADER, SCRYPT_LENGTH } from './defaults';

export function decodePair(encrypted?: Uint8Array, passphrase?: string): Keypair {
  assert(encrypted, 'No encrypted data available to decode');

  let decoded: Uint8Array | null;

  if (passphrase) {
    const { params, salt } = scryptFromU8a(encrypted);
    const { password } = scryptEncode(passphrase, salt, params);

    encrypted = encrypted.subarray(SCRYPT_LENGTH);

    decoded = naclDecrypt(
      encrypted.subarray(NONCE_LENGTH),
      encrypted.subarray(0, NONCE_LENGTH),
      u8aFixLength(password, 256, true)
    );
  } else {
    decoded = encrypted;
  }

  assert(decoded, 'Unable to decode using the supplied passphrase');

  const header = decoded.subarray(0, PKCS8_HEADER.length);

  if (!u8aEq(header, PKCS8_HEADER)) {
    throw new Error('Invalid Pkcs8 header found in body');
  }

  let secretKey: Uint8Array;
  let publicKey: Uint8Array;

  if (decoded.length === 65 + PKCS8_HEADER.length + PKCS8_DIVIDER.length) {
    // ecdsa [PKCS8_HEADER.length + 32 + PKCS8_DIVIDER.length + 33]
    secretKey = decoded.subarray(PKCS8_HEADER.length, PKCS8_HEADER.length + 32);
    publicKey = decoded.subarray(PKCS8_HEADER.length + 32 + PKCS8_DIVIDER.length);
  } else if (decoded.length === 96 + PKCS8_HEADER.length + PKCS8_DIVIDER.length) {
    // ed25519 [PKCS8_HEADER.length + 64 + PKCS8_DIVIDER.length + 33]
    secretKey = decoded.subarray(PKCS8_HEADER.length, PKCS8_HEADER.length + 64);
    publicKey = decoded.subarray(PKCS8_HEADER.length + 64 + PKCS8_DIVIDER.length);
  } else if (decoded.length === 64 + PKCS8_HEADER.length + PKCS8_DIVIDER.length) {
    // x25519 [PKCS8_HEADER.length + 32 + PKCS8_DIVIDER.length + 32]
    secretKey = decoded.subarray(PKCS8_HEADER.length, PKCS8_HEADER.length + 32);
    publicKey = decoded.subarray(PKCS8_HEADER.length + 32 + PKCS8_DIVIDER.length);
  } else {
    throw new Error('Invalid Pkcs8 length');
  }

  return {
    publicKey,
    secretKey
  };
}

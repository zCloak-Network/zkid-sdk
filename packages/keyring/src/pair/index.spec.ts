// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString, Keypair } from '@zcloak/crypto/types';

import { stringToU8a, u8aConcat, u8aEq, u8aToU8a } from '@polkadot/util';

import { ed25519Verify, initCrypto, secp256k1Verify } from '@zcloak/crypto';

import { createPair } from '.';

export function hashMessage(message: HexString | Uint8Array): Uint8Array {
  const messageU8a = u8aToU8a(message);

  return u8aConcat(
    stringToU8a('\x19Ethereum Signed Message:\n'),
    stringToU8a(String(messageU8a.length)),
    message
  );
}

const KEYPAIR_ECDSA: Keypair = {
  secretKey: new Uint8Array([
    220, 15, 230, 226, 89, 22, 43, 42, 153, 91, 12, 66, 173, 13, 164, 155, 252, 164, 191, 0, 154,
    128, 98, 193, 158, 255, 131, 166, 204, 208, 118, 252
  ]),
  publicKey: new Uint8Array([
    2, 73, 127, 28, 162, 129, 114, 146, 80, 141, 203, 39, 86, 139, 211, 3, 70, 101, 96, 27, 138, 82,
    53, 70, 140, 193, 77, 203, 22, 198, 108, 197, 55
  ])
};

const KEYPAIR_ED25519: Keypair = {
  secretKey: new Uint8Array([
    75, 155, 112, 151, 106, 167, 149, 167, 3, 2, 115, 76, 88, 47, 182, 137, 157, 138, 181, 238, 158,
    142, 219, 131, 236, 238, 38, 97, 168, 163, 193, 14, 103, 141, 192, 0, 208, 56, 166, 161, 173,
    131, 158, 229, 242, 236, 250, 183, 155, 122, 194, 21, 226, 52, 183, 84, 2, 158, 119, 218, 113,
    244, 63, 132
  ]),
  publicKey: new Uint8Array([
    103, 141, 192, 0, 208, 56, 166, 161, 173, 131, 158, 229, 242, 236, 250, 183, 155, 122, 194, 21,
    226, 52, 183, 84, 2, 158, 119, 218, 113, 244, 63, 132
  ])
};

const KEYPAIR_X25519_1: Keypair = {
  secretKey: new Uint8Array([
    220, 15, 230, 226, 89, 22, 43, 42, 153, 91, 12, 66, 173, 13, 164, 155, 252, 164, 191, 0, 154,
    128, 98, 193, 158, 255, 131, 166, 204, 208, 118, 252
  ]),
  publicKey: new Uint8Array([
    10, 98, 81, 84, 96, 50, 233, 178, 244, 17, 4, 87, 23, 1, 155, 212, 23, 14, 56, 172, 4, 100, 108,
    196, 122, 153, 46, 146, 195, 45, 141, 34
  ])
};

const KEYPAIR_X25519_2: Keypair = {
  secretKey: new Uint8Array([
    220, 15, 230, 226, 89, 22, 43, 42, 153, 91, 12, 66, 173, 13, 164, 155, 252, 164, 191, 0, 154,
    128, 98, 193, 158, 255, 131, 166, 204, 208, 118, 252
  ]),
  publicKey: new Uint8Array([
    10, 98, 81, 84, 96, 50, 233, 178, 244, 17, 4, 87, 23, 1, 155, 212, 23, 14, 56, 172, 4, 100, 108,
    196, 122, 153, 46, 146, 195, 45, 141, 34
  ])
};

const message = stringToU8a('abcd');

describe('Keyring pair', (): void => {
  beforeAll(async () => {
    await initCrypto();
  });

  it('create ecdsa pair', (): void => {
    const pair = createPair(KEYPAIR_ECDSA, { type: 'ecdsa' });

    const signature = pair.sign(hashMessage(message));

    expect(secp256k1Verify(hashMessage(message), signature, pair.publicKey)).toBe(true);
  });

  it('create ed25519 pair', (): void => {
    const pair = createPair(KEYPAIR_ED25519, { type: 'ed25519' });

    const signature = pair.sign(message);

    expect(ed25519Verify(message, signature, pair.publicKey)).toEqual(true);
  });

  it('create x25519 pair', (): void => {
    const pair1 = createPair(KEYPAIR_X25519_1, { type: 'x25519' });
    const pair2 = createPair(KEYPAIR_X25519_2, { type: 'x25519' });

    const encrypted = pair1.encrypt(message, pair2.publicKey);

    const decrypted = pair2.decrypt(encrypted, pair1.publicKey);

    expect(u8aEq(decrypted, message)).toEqual(true);
  });
});

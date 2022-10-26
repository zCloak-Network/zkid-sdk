// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  ed25519PairFromSeed,
  randomAsU8a,
  secp256k1PairFromSeed,
  x25519PairFromSeed
} from '@zcloak/crypto';

import { NONCE_LENGTH, PKCS8_DIVIDER, PKCS8_HEADER } from './defaults';
import { encodePair } from './encode';

describe('encode', (): void => {
  it('returns PKCS8 when no passphrase supplied', (): void => {
    expect(encodePair(secp256k1PairFromSeed(randomAsU8a(32)))).toHaveLength(
      PKCS8_DIVIDER.length + PKCS8_HEADER.length + 32 + 33
    );
    expect(encodePair(ed25519PairFromSeed(randomAsU8a(32)))).toHaveLength(
      PKCS8_DIVIDER.length + PKCS8_HEADER.length + 64 + 32
    );
    expect(encodePair(x25519PairFromSeed(randomAsU8a(32)))).toHaveLength(
      PKCS8_DIVIDER.length + PKCS8_HEADER.length + 32 + 32
    );
  });

  it('returns encoded PKCS8 when passphrase supplied', (): void => {
    expect(encodePair(secp256k1PairFromSeed(randomAsU8a(32)), 'password')).toHaveLength(
      44 + NONCE_LENGTH + (PKCS8_DIVIDER.length + PKCS8_HEADER.length + 32 + 33) + 16
    );
    expect(encodePair(ed25519PairFromSeed(randomAsU8a(32)), 'password')).toHaveLength(
      44 + NONCE_LENGTH + (PKCS8_DIVIDER.length + PKCS8_HEADER.length + 64 + 32) + 16
    );
    expect(encodePair(x25519PairFromSeed(randomAsU8a(32)), 'password')).toHaveLength(
      44 + NONCE_LENGTH + (PKCS8_DIVIDER.length + PKCS8_HEADER.length + 32 + 32) + 16
    );
  });
});

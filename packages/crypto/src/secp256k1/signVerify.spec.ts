// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { stringToU8a } from '@polkadot/util';

import { initCrypto } from '../initCrypto';
import { keccak256AsU8a } from '../keccak';
import { randomAsU8a } from '../random/asU8a';
import { secp256k1Expand, secp256k1PairFromSeed, secp256k1Sign, secp256k1Verify } from '.';

const MESSAGE = stringToU8a('this is a message');

describe('sign and verify', (): void => {
  beforeAll(async () => {
    await initCrypto();
  });

  it('has 65-byte signatures', (): void => {
    const pair = secp256k1PairFromSeed(randomAsU8a());

    expect(secp256k1Sign(MESSAGE, pair)).toHaveLength(65);
  });

  it('signs/verifies a message by random key (keccak)', (): void => {
    const pair = secp256k1PairFromSeed(randomAsU8a());
    const signature = secp256k1Sign(MESSAGE, pair);
    const address = keccak256AsU8a(secp256k1Expand(pair.publicKey));

    expect(secp256k1Verify(MESSAGE, signature, address)).toEqual(true);
  });

  it('works over a range of random keys (keccak)', (): void => {
    for (let i = 0; i < 256; i++) {
      const pair = secp256k1PairFromSeed(randomAsU8a());

      try {
        expect(
          secp256k1Verify(
            MESSAGE,
            secp256k1Sign(MESSAGE, pair),
            keccak256AsU8a(secp256k1Expand(pair.publicKey))
          )
        ).toEqual(true);
      } catch (error) {
        console.error(`keccak failed on #${i}`);
        throw error;
      }
    }
  }, 120000);
});

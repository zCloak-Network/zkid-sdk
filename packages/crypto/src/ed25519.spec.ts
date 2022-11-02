// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Keypair } from './types';

import { stringToU8a, u8aEq } from '@polkadot/util';

import { ed25519PairFromSeed, ed25519Sign, ed25519Verify } from './ed25519';

const SEED: Uint8Array = new Uint8Array([
  75, 155, 112, 151, 106, 167, 149, 167, 3, 2, 115, 76, 88, 47, 182, 137, 157, 138, 181, 238, 158,
  142, 219, 131, 236, 238, 38, 97, 168, 163, 193, 14
]);

const KEYPAIR: Keypair = {
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

const message = stringToU8a('abcd');

describe('ed25519', (): void => {
  it('create keypair', (): void => {
    const keypair = ed25519PairFromSeed(SEED);

    expect(u8aEq(keypair.secretKey, KEYPAIR.secretKey)).toEqual(true);
    expect(u8aEq(keypair.publicKey, KEYPAIR.publicKey)).toEqual(true);
  });

  it('sign and verify', (): void => {
    const signature = ed25519Sign(message, KEYPAIR.secretKey);

    expect(ed25519Verify(message, signature, KEYPAIR.publicKey)).toEqual(true);
  });
});

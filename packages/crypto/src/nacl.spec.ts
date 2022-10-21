// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Keypair } from './types';

import { stringToU8a, u8aEq } from '@polkadot/util';

import { naclOpen, naclSeal } from './nacl';

const KEYPAIR1: Keypair = {
  secretKey: new Uint8Array([
    220, 15, 230, 226, 89, 22, 43, 42, 153, 91, 12, 66, 173, 13, 164, 155, 252, 164, 191, 0, 154,
    128, 98, 193, 158, 255, 131, 166, 204, 208, 118, 252
  ]),
  publicKey: new Uint8Array([
    10, 98, 81, 84, 96, 50, 233, 178, 244, 17, 4, 87, 23, 1, 155, 212, 23, 14, 56, 172, 4, 100, 108,
    196, 122, 153, 46, 146, 195, 45, 141, 34
  ])
};
const KEYPAIR2: Keypair = {
  secretKey: new Uint8Array([
    51, 141, 192, 0, 208, 56, 166, 161, 173, 131, 75, 229, 242, 156, 250, 57, 155, 28, 156, 21, 226,
    52, 183, 184, 12, 158, 119, 218, 113, 55, 63, 13
  ]),
  publicKey: new Uint8Array([
    108, 98, 205, 185, 48, 65, 141, 188, 46, 201, 5, 86, 37, 68, 255, 229, 12, 161, 150, 49, 135,
    128, 145, 20, 85, 38, 219, 66, 203, 103, 65, 73
  ])
};

const message = stringToU8a('abcd');

const BOX = {
  nonce: new Uint8Array([
    124, 239, 113, 158, 94, 242, 79, 220, 205, 57, 199, 255, 188, 85, 169, 194, 64, 218, 7, 164,
    111, 52, 37, 43
  ]),
  sealed: new Uint8Array([
    53, 147, 44, 3, 5, 139, 242, 11, 251, 187, 53, 196, 255, 231, 26, 248, 236, 76, 185, 49
  ])
};

describe('nacl', (): void => {
  it('encrypt', (): void => {
    console.log(naclSeal(message, KEYPAIR1.secretKey, KEYPAIR2.publicKey));
  });

  it('decrypt', (): void => {
    const decrypted = naclOpen(BOX.sealed, BOX.nonce, KEYPAIR1.publicKey, KEYPAIR2.secretKey);

    expect(decrypted && u8aEq(decrypted, message)).toEqual(true);
  });
});

// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { u8aToHex } from '@polkadot/util';

import { initCrypto } from '../initCrypto';
import { pbkdf2Encode } from '.';

const KNOWN_SALT = new Uint8Array([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32
]);
const TEST_PASSWORD = 'test password';

describe('pbkdf2Encode', (): void => {
  beforeAll(async (): Promise<void> => {
    await initCrypto();
  });

  it('creates known iterations', (): void => {
    expect(u8aToHex(pbkdf2Encode(TEST_PASSWORD, KNOWN_SALT, 2048).password)).toEqual(
      '0x600ba9ad65e4294d112e028fdad5dd8fce0a6a6e6b89fb36ed006785ccc3b3aec46831b3105c24237293e6cfa1a0ef6717c113f87ff9237a3f73d210adfa6634'
    );
  });
});

// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { testKeyring } from 'test-support';

import { initCrypto, mnemonicGenerate } from '@zcloak/crypto';

import { backup } from './backup';
import { fromMnemonic } from './from';
import { restore } from './restore';

describe('Restore did', (): void => {
  beforeAll(async () => {
    await initCrypto();
  });

  it('backup did and restore', () => {
    const mnemonic = mnemonicGenerate(12);
    const did = fromMnemonic(testKeyring, mnemonic);
    const json = backup(testKeyring, did, '1234');

    expect(restore(testKeyring, json, '1234')).toMatchObject(did);
  });
});

// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { u8aEq } from '@polkadot/util';

import { ed25519PairFromSeed, initCrypto, mnemonicToMiniSecret } from '..';
import { mnemonicGenerate } from './generate';

// generate either a JS or WASM mnemonic
describe('mnemonicToMiniSecret (compare)', () => {
  beforeAll(async (): Promise<void> => {
    await initCrypto();
  });

  const mnemonic = mnemonicGenerate(12);

  it('check', (): void => {
    const minisecret = mnemonicToMiniSecret(mnemonic, '1');
    const edpub = ed25519PairFromSeed(minisecret).publicKey;

    const testmini = mnemonicToMiniSecret(mnemonic, '1');

    // explicit minisecret compare
    expect(u8aEq(minisecret, testmini)).toEqual(true);

    // compare ed both in WASM and JS
    expect(u8aEq(edpub, ed25519PairFromSeed(testmini).publicKey)).toEqual(true);
  });
});

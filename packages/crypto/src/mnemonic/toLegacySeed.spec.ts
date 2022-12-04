// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { u8aToHex } from '@polkadot/util';

import { initCrypto } from '../initCrypto';
import { mnemonicToLegacySeed } from './';

const MNEMONIC = 'seed sock milk update focus rotate barely fade car face mechanic mercy';
const SEED_64 =
  '0x3c121e20de068083b49c2315697fb59a2d9e8643c24e5ea7628132c58969a0275693dd5bd9d4cc9e648475eba9613ed4678f4d62560a9c42f75bac04022ded25';

describe('mnemonicToLegacySeed', (): void => {
  beforeAll(async (): Promise<void> => {
    await initCrypto();
  });

  it('generates a valid 64bytes seed', (): void => {
    expect(u8aToHex(mnemonicToLegacySeed(MNEMONIC, undefined))).toEqual(SEED_64);
  });

  it('fails with non-mnemonics', (): void => {
    expect(() => mnemonicToLegacySeed('foo bar baz', undefined)).toThrow(/mnemonic specified/);
  });
});

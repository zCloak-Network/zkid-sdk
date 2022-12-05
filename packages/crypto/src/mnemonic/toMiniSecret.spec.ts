// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { u8aToHex } from '@polkadot/util';

import { initCrypto } from '../initCrypto';
import { mnemonicToMiniSecret } from './toMiniSecret';

const MNEMONIC = 'seed sock milk update focus rotate barely fade car face mechanic mercy';
const SEED = '0x4d1ab2a57929edfd018aaa974e62ed557e3f54b4104acabedf73c8f5a1dbb029';

describe('mnemonicToMiniSecret', (): void => {
  beforeAll(async (): Promise<void> => {
    await initCrypto();
  });

  it('generates a valid seed', (): void => {
    expect(u8aToHex(mnemonicToMiniSecret(MNEMONIC, undefined))).toEqual(SEED);
  });

  it('fails with non-mnemonics', (): void => {
    expect(() => mnemonicToMiniSecret('foo bar baz', undefined)).toThrow(/mnemonic specified/);
  });
});

// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initCrypto } from '../initCrypto';
import { mnemonicGenerate } from './generate';
import { mnemonicValidate } from './validate';

describe('mnemonicGenerate', (): void => {
  beforeAll(async (): Promise<void> => {
    await initCrypto();
  });

  it('generates a valid mnemonic (default strength)', (): void => {
    expect(mnemonicValidate(mnemonicGenerate())).toEqual(true);
  });

  it.each([12, 15, 18, 21, 24] as 12[])('generates a valid mnemonic (%p words)', (num): void => {
    const mnemonic = mnemonicGenerate(num);
    const isValid = mnemonicValidate(mnemonic);

    expect(mnemonic.split(' ')).toHaveLength(num);
    expect(isValid).toEqual(true);
  });

  it('generates not deterministic', (): void => {
    const m1 = mnemonicGenerate(24);
    const m2 = mnemonicGenerate(24);

    expect(m1 === m2).toEqual(false);
    expect(mnemonicValidate(m1)).toEqual(true);
    expect(mnemonicValidate(m2)).toEqual(true);
  });
});

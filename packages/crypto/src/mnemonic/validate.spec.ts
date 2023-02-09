// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initCrypto } from '../initCrypto';
import { mnemonicValidate } from './validate';

describe('mnemonicValidate', (): void => {
  beforeAll(async (): Promise<void> => {
    await initCrypto();
  });

  it('returns true on valid', (): void => {
    expect(
      mnemonicValidate('seed sock milk update focus rotate barely fade car face mechanic mercy')
    ).toEqual(true);
  });

  it('returns false on invalid', (): void => {
    expect(
      mnemonicValidate('wine photo extra cushion basket dwarf humor cloud truck job boat submit')
    ).toEqual(false);
  });
});

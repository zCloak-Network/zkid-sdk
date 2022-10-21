// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  generateMnemonic,
  mnemonicToLegacySeed,
  mnemonicToMiniSecret,
  validateMnemonic
} from './mnemonic';

const MNEMONIC =
  'health correct setup usage father decorate curious copper sorry recycle skin equal';

describe('mnemonic', (): void => {
  it('generate mnemonic', (): void => {
    console.log(generateMnemonic(12));
  });

  it('validate mnemonic', (): void => {
    validateMnemonic(MNEMONIC);
  });

  it('mnemonic to legacy seed', (): void => {
    const seed = mnemonicToLegacySeed(MNEMONIC);

    console.log(seed);
  });

  it('mnemonic to secret', (): void => {
    const seed = mnemonicToMiniSecret(MNEMONIC);

    console.log(seed);
  });
});

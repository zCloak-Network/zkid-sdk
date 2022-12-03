// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { generateMnemonic } from '@zcloak/crypto';
import { Keyring } from '@zcloak/keyring';

import { createEcdsaFromMnemonic } from '../did/helpers';
import { backup } from './backup';
import { restore } from './restore';

describe('Restore did', (): void => {
  const keyring = new Keyring();

  it('backup did and restore', () => {
    const mnemonic = generateMnemonic(12);
    const did = createEcdsaFromMnemonic(mnemonic, keyring);

    const json = backup(keyring, did, '1234');

    expect(restore(keyring, json, '1234')).toMatchObject(did);
  });
});

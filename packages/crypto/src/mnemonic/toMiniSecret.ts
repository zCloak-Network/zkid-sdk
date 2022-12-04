// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { hexToU8a, stringToU8a } from '@polkadot/util';
import { mnemonicToEntropy } from 'bip39';

import { pbkdf2Encode } from '../pbkdf2';
import { mnemonicValidate } from './validate';

export function mnemonicToMiniSecret(mnemonic: string, password = ''): Uint8Array {
  if (!mnemonicValidate(mnemonic)) {
    throw new Error('Invalid bip39 mnemonic specified');
  }

  const entropy = hexToU8a(mnemonicToEntropy(mnemonic));
  const salt = stringToU8a(`mnemonic${password}`);

  // return the first 32 bytes as the seed
  return pbkdf2Encode(entropy, salt).password.slice(0, 32);
}

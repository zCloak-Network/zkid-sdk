// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initCrypto } from '@zcloak/crypto';
import { keys } from '@zcloak/did';
import { Keyring } from '@zcloak/keyring';

import { choseResolver, passwordPrompt } from '../utils';

export async function exportDidKeysFile(didResolver: string, mnemonic: string) {
  const baseUrl = choseResolver(didResolver);

  if (!baseUrl) {
    return false;
  }

  await initCrypto();

  const keyring = new Keyring();

  if (!mnemonic) {
    return false;
  }

  const did = keys.fromMnemonic(keyring, mnemonic, 'ecdsa');

  const password = await passwordPrompt('Enter the password to encrypt the DID-keys file:');
  const repeatPassword = await passwordPrompt('Enter the password Again:', (input) => input === password);

  const json = keys.backup(keyring, did, repeatPassword);

  console.log(JSON.stringify(json));

  return true;
}

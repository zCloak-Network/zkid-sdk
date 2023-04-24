// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initCrypto, mnemonicGenerate } from '@zcloak/crypto';
import { keys } from '@zcloak/did';
import { Keyring } from '@zcloak/keyring';

import { choseResolver, publishDidDoc } from '../utils';

export async function generate(didResolver: string) {
  const baseUrl = choseResolver(didResolver);

  if (!baseUrl) {
    return false;
  }

  await initCrypto();

  const keyring = new Keyring();
  const mnemonic = mnemonicGenerate(12);
  const did = keys.fromMnemonic(keyring, mnemonic, 'ecdsa');

  await publishDidDoc(baseUrl, did);

  console.log(`upload ${did.id} on chain!`);

  console.log(`mnemonic phrase: ${mnemonic}`);

  return true;
}

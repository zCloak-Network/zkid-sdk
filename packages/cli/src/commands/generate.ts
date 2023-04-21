// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initCrypto, mnemonicGenerate } from '@zcloak/crypto';
import { keys } from '@zcloak/did';
import { Keyring } from '@zcloak/keyring';

import { choseResolver, passwordPrompt, publishDidDoc } from '../utils';

export async function generate(didResolver: string, deriveIndex: number, mnemonic?: string, showMn = false) {
  const baseUrl = choseResolver(didResolver);

  if (!baseUrl) {
    return false;
  }

  await initCrypto();

  const keyring = new Keyring();

  if (!mnemonic) {
    mnemonic = mnemonicGenerate(12);
  }

  const did = keys.fromMnemonic(keyring, mnemonic, 'ecdsa', deriveIndex);

  // console.log(`did: ${JSON.stringify(did)}`);
  // console.log(`Doc: ${JSON.stringify(did.getDocument())}`);

  const password = await passwordPrompt('Enter the password to encrypt the DID-keys file:');
  const repeatPassword = await passwordPrompt('Enter the password Again:', (input) => input === password);

  const json = keys.backup(keyring, did, repeatPassword);

  await publishDidDoc(baseUrl, did);

  const result: { output: any; mnemonic?: string; deriveIndex: number } = { output: json, deriveIndex };

  if (showMn) {
    result.mnemonic = mnemonic;
  }

  console.log(`${JSON.stringify(result.output)}`);

  if (result.mnemonic) {
    console.log();
    console.log('mnemonic phrase:', mnemonic);
  }

  return true;
}

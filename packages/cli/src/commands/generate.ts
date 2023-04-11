// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs-extra';

import { mnemonicGenerate } from '@zcloak/crypto';
import { keys } from '@zcloak/did';
import { Keyring } from '@zcloak/keyring';

import { passwordPrompt } from '../utils';

export async function generate(
  deriveIndex: number,
  mnemonic?: string,
  output?: string,
  showMn = false,
  dryRun = false
): Promise<void> {
  const keyring = new Keyring();

  if (!mnemonic) {
    mnemonic = mnemonicGenerate(12);
  }

  const did = keys.fromMnemonic(keyring, mnemonic, 'ecdsa', deriveIndex);

  const password = await passwordPrompt('Enter the password to encrypt the DID-keys file:');
  const repeatPassword = await passwordPrompt('Enter the password Again:', (input) => input === password);

  const json = keys.backup(keyring, did, repeatPassword);

  if (!output) {
    output = `${json.didUrl}.json`;
  }

  const result: { output: any; mnemonic?: string; deriveIndex: number } = { output: json, deriveIndex };

  if (showMn) {
    result.mnemonic = mnemonic;
  }

  if (dryRun) {
    console.log(JSON.stringify(result));

    return;
  }

  fs.writeJsonSync(output, result.output);

  console.log(`DID-keys file export to ${output}`);

  if (result.mnemonic) {
    console.log();
    console.log('mnemonic phrase', mnemonic);
  }
}

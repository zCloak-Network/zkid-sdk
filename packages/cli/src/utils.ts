// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';
import inquirer from 'inquirer';
import qs from 'qs';

import { CType } from '@zcloak/ctype/types';
import { Did, keys } from '@zcloak/did';
import { DidDocument } from '@zcloak/did-resolver/types';
import { Keyring } from '@zcloak/keyring';

export async function passwordPrompt(description: string, validate?: (input: string) => boolean) {
  const passwordPrompt = await inquirer.prompt<{ password: string }>([
    {
      type: 'password',
      name: 'password',
      message: description,
      mask: '*',
      validate: (input) => {
        if (typeof input === 'string' && input.length > 0) {
          return validate ? validate(input) : true;
        }

        return false;
      }
    }
  ]);

  return passwordPrompt.password;
}

export async function getCType(baseUrl: string, ctypeHash: string): Promise<CType> {
  const ctypeRes = await axios.get(`${baseUrl}/ctype?${qs.stringify({ id: ctypeHash })}`);

  if (ctypeRes.status !== 200) {
    throw new Error(`ctype query failed ${ctypeHash}`);
  }

  const ctype: CType = ctypeRes.data.data[0].rawData;

  return ctype;
}

export async function getDidDoc(baseUrl: string, didUrl: string): Promise<DidDocument> {
  const didRes = await axios.get(`${baseUrl}/did/${didUrl}`);

  if (didRes.status !== 200) {
    throw new Error(`get ${didUrl} did document failed`);
  }

  const holderDidDoc: DidDocument = didRes.data.data.rawData;

  return holderDidDoc;
}

export function getDidFromMnemonic(mnemonic: string): Did {
  const keyring = new Keyring();
  const did: Did = keys.fromMnemonic(keyring, mnemonic);

  return did;
}

export async function sendEncryptedMessage(baseUrl: string, message: any) {
  try {
    await axios.post(`${baseUrl}/message`, message);
  } catch (err) {
    console.error(err);
  }
}

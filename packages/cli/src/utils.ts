// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';
import inquirer from 'inquirer';
import qs from 'qs';

import { CType } from '@zcloak/ctype/types';
import { Did, keys } from '@zcloak/did';
import { DidDocument, DidUrl } from '@zcloak/did-resolver/types';
import { Keyring } from '@zcloak/keyring';
import { Raw, VerifiableCredentialBuilder } from '@zcloak/vc';
import { HashType, RawCredential, VerifiableCredential } from '@zcloak/vc/types';

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

export async function createVC(
  baseUrl: string,
  attester: Did,
  claimerDid: string,
  ctypeHash: string,
  content: string,
  isPublic: number,
  rawHashType = 'Blake3',
  rawCredHashType = 'Keccak256'
): Promise<VerifiableCredential<false> | VerifiableCredential<true>> {
  // step 1: get ctype
  const ctype: CType = await getCType(baseUrl, ctypeHash);

  // step 2: build raw
  const claimerDidUrl = claimerDid as DidUrl;
  const realRawHashType = rawHashType as HashType;
  const raw = new Raw({
    contents: JSON.parse(content),
    owner: claimerDidUrl,
    ctype,
    hashType: realRawHashType
  });

  // step 3: build rawCredential from raw
  const realRawCredHashType = rawCredHashType as HashType;
  const rawCredential: RawCredential = raw.toRawCredential(realRawCredHashType);

  // step 4: build a vcBuilder by using rawCredential and ctype
  const vcBuilder = VerifiableCredentialBuilder.fromRawCredential(rawCredential, ctype)
    .setExpirationDate(null)
    .setIssuanceDate(Date.now());

  // step5: build a vc
  if (isPublic === 0) {
    return await vcBuilder.build(attester, false);
  } else if (isPublic === 1) {
    return await vcBuilder.build(attester, true);
  } else {
    throw new Error('invalid is-public flag value');
  }
}

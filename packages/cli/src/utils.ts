// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';
import fs from 'fs';
import inquirer from 'inquirer';
import path from 'path';
import qs from 'qs';

import { CType } from '@zcloak/ctype/types';
import { Did, keys } from '@zcloak/did';
import { restore } from '@zcloak/did/keys';
import { DidKeys$Json } from '@zcloak/did/keys/types';
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

export function choseResolver(resolver: string): string | undefined {
  // if (resolver === 'prod') {
  //   return 'https://did-service.zkid.app';
  // } else if (resolver === 'dev') {
  //   return 'https://did-service.zkid.xyz';
  // } else {
  //   console.log('wrong did resolver');

  //   return undefined;
  // }
  if (resolver === null) {
    console.log('resolver is null');

    return undefined;
  } else {
    return resolver;
  }
}

export function writeFileOfJsonArray<T>(filePath: string, newObj: T) {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    fs.writeFileSync(absolutePath, JSON.stringify([newObj]));
  } else {
    // TODO: 应该加一段 检查文件内容是否为 json obj array 的逻辑，有可能出现
    // 文件重名 但文件内容不是 json对象数组 的情况
    const fileContent = fs.readFileSync(absolutePath, { encoding: 'utf-8' });

    const jsonArray: Array<any> = JSON.parse(fileContent);

    jsonArray.push(newObj);

    fs.writeFileSync(absolutePath, JSON.stringify(jsonArray));
  }
}

export function isValidDidUrl(didUrl: string): boolean {
  if (didUrl.length !== 49) {
    // console.error('not equal did url string length');

    return false;
  } else if (didUrl.slice(0, 7) !== 'did:zk:') {
    // console.error('not have did:zk header');

    return false;
  } else {
    return true;
  }
}

export function isValidPath(filePath: string): boolean {
  const absolutePath = path.resolve(filePath);
  const parsedPath = path.parse(absolutePath);

  if (!parsedPath || !parsedPath.root || !parsedPath.dir || !parsedPath.base) {
    // console.error(`invalid path: ${absolutePath}`);

    return false;
  }

  try {
    fs.accessSync(absolutePath, fs.constants.F_OK);

    return true;
  } catch (err) {
    // console.error(`Path is not accessible: ${absolutePath}`);

    return false;
  }
}

export async function getCType(baseUrl: string, ctypeHash: string): Promise<CType | undefined> {
  const ctypeRes = await axios.get(`${baseUrl}/ctype?${qs.stringify({ id: ctypeHash })}`);

  if (ctypeRes.status !== 200) {
    throw new Error(`ctype query failed ${ctypeHash}`);
  }

  const ctype: CType = ctypeRes.data.data[0].rawData;

  if (!ctype) {
    console.log('ctype is null');

    return undefined;
  }

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

export async function getDidFromKeys(json: DidKeys$Json): Promise<Did | false> {
  const keyring = new Keyring();

  const password = await passwordPrompt('Enter the password to decrypt the DID-keys file:');
  const repeatPassword = await passwordPrompt('Enter the password Again:', (input) => input === password);

  try {
    return restore(keyring, json, repeatPassword);
  } catch (error: any) {
    if (error.message === 'Unable to decode using the supplied passphrase') {
      console.log('Wrong password !!!');
    }

    return false;
  }
}

export async function publishDidDoc(baseUrl: string, did: Did): Promise<boolean> {
  try {
    await axios.post(`${baseUrl}/did`, await did.getPublish());

    return true;
  } catch (error) {
    console.log('Publish did document error !!!');
    console.error(error);

    return false;
  }
}

export function getDidFromMnemonic(mnemonic: string): Did {
  const keyring = new Keyring();
  const did: Did = keys.fromMnemonic(keyring, mnemonic);

  return did;
}

export async function sendEncryptedMessage(baseUrl: string, message: any) {
  try {
    await axios.post(`${baseUrl}/wxBlockchainEvent/message`, message);
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
): Promise<VerifiableCredential<false> | VerifiableCredential<true> | false> {
  // step 1: get ctype
  const ctype: CType | undefined = await getCType(baseUrl, ctypeHash);

  if (!ctype) {
    return false;
  }

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

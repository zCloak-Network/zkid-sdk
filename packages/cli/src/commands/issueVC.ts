// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';

import { initCrypto } from '@zcloak/crypto';
import { Did } from '@zcloak/did';
import { fromDidDocument } from '@zcloak/did/did/helpers';
import { DidDocument, DidUrl } from '@zcloak/did-resolver/types';
import { encryptMessage } from '@zcloak/message';
import { VerifiableCredential } from '@zcloak/vc/types';

import { createVC, getDidDoc, getDidFromMnemonic, sendEncryptedMessage } from '../utils';

export const issueVC = async (
  env: string,
  attesterMnemonic: string,
  claimerDid: string | undefined,
  ctypeHash: string | undefined,
  content: string | undefined,
  rawHashType?: string,
  rawCredHashType?: string,
  isPublic?: number,
  claimers?: string | undefined,
  output?: string
) => {
  let baseUrl: string;

  if (claimerDid === undefined || ctypeHash === undefined || content === undefined || isPublic === undefined) {
    console.log('your flag has undefined value');

    return;
  }

  if (env === 'dev') {
    baseUrl = 'https://did-service.starks.network';
  } else if (env === 'prod') {
    baseUrl = 'https://did-service.zkid.app';
  } else {
    console.log('wrong enviroment !!!');

    return;
  }

  // initCrypto for wasm
  await initCrypto();

  // step 0_0: get claimer DID obj
  const claimerDidUrl = claimerDid as DidUrl;
  const claimerDoc: DidDocument = await getDidDoc(baseUrl, claimerDidUrl);
  const claimer: Did = fromDidDocument(claimerDoc);

  // step 0_1: get attester DID obj
  const mnemonicContent = fs.readFileSync(attesterMnemonic, { encoding: 'utf-8' });
  const mnemonicObj = JSON.parse(mnemonicContent);
  const attester: Did = getDidFromMnemonic(mnemonicObj.mnemonic);

  // step 2: create VC
  const rawContent = fs.readFileSync(content, { encoding: 'utf-8' });
  const vc: VerifiableCredential<false | true> = await createVC(
    baseUrl,
    attester,
    claimerDid,
    ctypeHash,
    rawContent,
    isPublic,
    rawHashType,
    rawCredHashType
  );

  if (output === undefined) {
    console.log(`${JSON.stringify(vc)}`);
  } else {
    console.log(`output VC object into: ${output}`);
    fs.writeFileSync(output, JSON.stringify(vc));
  }

  // step 3: encrypt message and send it to server
  const message = await encryptMessage('Send_issuedVC', vc, attester, claimer.getKeyUrl('keyAgreement'));

  await sendEncryptedMessage(baseUrl, message);
};

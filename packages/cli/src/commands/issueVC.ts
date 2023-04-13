// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';

import { initCrypto } from '@zcloak/crypto';
import { CType } from '@zcloak/ctype/types';
import { Did } from '@zcloak/did';
import { fromDidDocument } from '@zcloak/did/did/helpers';
import { DidDocument, DidUrl } from '@zcloak/did-resolver/types';
import { encryptMessage } from '@zcloak/message';
import { Raw, VerifiableCredentialBuilder } from '@zcloak/vc';
import { HashType, RawCredential } from '@zcloak/vc/types';

import { getCType, getDidDoc, getDidFromMnemonic, sendEncryptedMessage } from '../utils';

export const issueVC = async (
  env: string,
  attesterMnemonic: string,
  claimerDid: string | undefined,
  ctypeHash: string | undefined,
  content: string | undefined,
  rawHashType?: string,
  rawCredHashType?: string,
  isPublic?: number,
  output?: string
) => {
  let baseUrl: string;

  if (claimerDid === undefined || ctypeHash === undefined || content === undefined) {
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

  // step 1: get ctype
  const ctype: CType = await getCType(baseUrl, ctypeHash);

  // step 2: build raw
  const realRawHashType = rawHashType as HashType;
  const rawContentContent = fs.readFileSync(content, { encoding: 'utf-8' });
  const rawContent = JSON.parse(rawContentContent);
  const raw = new Raw({
    contents: rawContent,
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
  let vc;

  if (isPublic === 0) {
    vc = await vcBuilder.build(attester, false);
  } else if (isPublic === 1) {
    vc = await vcBuilder.build(attester, true);
  } else {
    console.log('invalid is-public flag value');

    return;
  }

  if (output === undefined) {
    console.log(`${JSON.stringify(vc)}`);
  } else {
    console.log(`output VC object into: ${output}`);
    fs.writeFileSync(output, JSON.stringify(vc));
  }

  // step 6: encrypt message and send it to server
  const message = await encryptMessage('Send_issuedVC', vc, attester, claimer.getKeyUrl('keyAgreement'));

  await sendEncryptedMessage(baseUrl, message);

  //   return 1;
};

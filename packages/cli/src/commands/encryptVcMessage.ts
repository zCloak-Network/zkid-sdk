// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';

import { Did } from '@zcloak/did';
import { fromDidDocument } from '@zcloak/did/did/helpers';
import { DidKeys$Json } from '@zcloak/did/keys/types';
import { DidDocument } from '@zcloak/did-resolver/types';
import { encryptMessage } from '@zcloak/message';
import { VerifiableCredential } from '@zcloak/vc/types';

import { choseResolver, getDidDoc, getDidFromKeys, getDidFromMnemonic, isValidPath } from '../utils';

export async function encryptVcMessage(didResolver: string, vc: string, attesterIdentity: string) {
  const baseUrl = choseResolver(didResolver);

  if (!baseUrl) {
    return false;
  }

  let attesterDid: Did | false;

  if (!isValidPath(attesterIdentity)) {
    // attesterIdentity is string
    attesterDid = getDidFromMnemonic(attesterIdentity);
  } else {
    // attesterIdentity is json file
    const didKeys = JSON.parse(fs.readFileSync(attesterIdentity, { encoding: 'utf-8' })) as DidKeys$Json;

    attesterDid = await getDidFromKeys(didKeys);
  }

  if (attesterDid === false) {
    // console.log('attesterDid is not assigned');

    return false;
  }

  if (!isValidPath(vc)) {
    // vc is string
    const vcred = JSON.parse(vc) as VerifiableCredential<false | true>;
    const { holder: claimerDidUrl } = vcred;
    const claimerDoc: DidDocument = await getDidDoc(baseUrl, claimerDidUrl);
    const claimer: Did = fromDidDocument(claimerDoc);

    console.log(await encryptMessage('Send_issuedVC', vcred, attesterDid, claimer.getKeyUrl('keyAgreement')));

    return true;
  } else {
    // vc is json file
    console.log('vc flag argument can not be a file with path !!!');

    return false;
  }
}

// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';

import { initCrypto } from '@zcloak/crypto';
import { CType } from '@zcloak/ctype/types';
import { Did } from '@zcloak/did';
import { DidKeys$Json } from '@zcloak/did/keys/types';
import { VerifiableCredentialBuilder } from '@zcloak/vc';
import { RawCredential, VerifiableCredential } from '@zcloak/vc/types';

import { choseResolver, getCType, getDidFromKeys, isValidPath } from '../utils';

export async function signRawVcFlow(
  baseUrl: string,
  rawCredential: RawCredential,
  attesterDid: Did,
  isPublic: boolean
): Promise<VerifiableCredential<false | true> | false> {
  const { ctype: ctypeHash } = rawCredential;

  const ctype: CType | undefined = await getCType(baseUrl, ctypeHash);

  if (!ctype) {
    console.log('ctype is undefined');

    return false;
  }

  await initCrypto();

  const vcBuilder = VerifiableCredentialBuilder.fromRawCredential(rawCredential, ctype)
    .setExpirationDate(null)
    .setIssuanceDate(Date.now());

  if (!isPublic) {
    return await vcBuilder.build(attesterDid, false);
  } else {
    return await vcBuilder.build(attesterDid, true);
  }
}

export async function signRawVC(
  didResolver: string,
  attesterIdentity: string,
  rawCredential: string,
  isPublic = false
): Promise<boolean> {
  const baseUrl = choseResolver(didResolver);

  if (!baseUrl) {
    return false;
  }

  let attesterDid: Did | false;

  let vc: VerifiableCredential<false | true> | boolean;

  if (!isValidPath(attesterIdentity)) {
    // attesterIdentity is string
    console.log('invalid keys-file path');

    return false;
  } else {
    // attesterIdentity is json file
    const didKeys = JSON.parse(fs.readFileSync(attesterIdentity, { encoding: 'utf-8' })) as DidKeys$Json;

    attesterDid = await getDidFromKeys(didKeys);
  }

  if (attesterDid === false) {
    // console.log('attesterDid is not assigned');

    return false;
  }

  if (!isValidPath(rawCredential)) {
    // rawCredential is string
    const rawCred = JSON.parse(rawCredential) as RawCredential;

    vc = await signRawVcFlow(baseUrl, rawCred, attesterDid, isPublic);
  } else {
    // rawCredential is json file file
    console.log('rawCredential only support string input');

    return false;
  }

  if (vc === false) {
    return false;
  } else {
    console.log(`${JSON.stringify(vc)}`);

    return true;
  }
}

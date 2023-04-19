// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';

import { initCrypto } from '@zcloak/crypto';
import { CType } from '@zcloak/ctype/types';
import { Did } from '@zcloak/did';
import { VerifiableCredentialBuilder } from '@zcloak/vc';
import { RawCredential, VerifiableCredential } from '@zcloak/vc/types';

import { choseResolver, getCType, getDidFromMnemonic, isValidPath } from '../utils';

export async function buildVcFlow(
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

export async function buildVC(
  didResolver: string,
  attesterMnemonic: string,
  rawCredential: string,
  isPublic?: boolean
): Promise<boolean> {
  const baseUrl = choseResolver(didResolver);

  if (!baseUrl || isPublic === undefined) {
    return false;
  }

  let attesterDid: Did;

  let vc: VerifiableCredential<false | true> | boolean;

  if (!isValidPath(attesterMnemonic)) {
    // attesterMnemonic is string
    attesterDid = getDidFromMnemonic(attesterMnemonic);
  } else {
    // attesterMnemonic is json file
    const { mnemonic } = JSON.parse(fs.readFileSync(attesterMnemonic, { encoding: 'utf-8' }));

    attesterDid = getDidFromMnemonic(mnemonic);
  }

  if (!isValidPath(rawCredential)) {
    // rawCredential is string
    const rawCred = JSON.parse(rawCredential) as RawCredential;

    vc = await buildVcFlow(baseUrl, rawCred, attesterDid, isPublic);
  } else {
    // rawCredential is json file file
    const fileContent = fs.readFileSync(rawCredential, { encoding: 'utf-8' });
    const rawCred = JSON.parse(fileContent);

    vc = await buildVcFlow(baseUrl, rawCred, attesterDid, isPublic);
  }

  if (vc === false) {
    return false;
  } else {
    console.log(`${JSON.stringify(vc)}`);

    return true;
  }
}

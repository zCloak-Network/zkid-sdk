// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';

import { CType } from '@zcloak/ctype/types';
import { DidUrl } from '@zcloak/did-resolver/types';
import { Raw } from '@zcloak/vc';
import { HashType } from '@zcloak/vc/types';

import { choseResolver, getCType, isValidPath } from '../utils';

export async function buildRawCredential(
  didResolver: string,
  content: string,
  claimerDidUrl: string,
  ctypeHash: string,
  rawHash = 'Blake3',
  rawCredHash = 'Keccak256'
) {
  const baseUrl = choseResolver(didResolver);

  if (!baseUrl) {
    return false;
  }

  if (!isValidPath(content)) {
    console.log('invalid content file path');

    return false;
  }

  // step 0: get cType object
  const ctype: CType | undefined = await getCType(baseUrl, ctypeHash);

  if (!ctype) {
    console.log('ctype is null');

    return false;
  }

  // step 1: build raw
  const raw = new Raw({
    contents: JSON.parse(fs.readFileSync(content, { encoding: 'utf-8' })),
    owner: claimerDidUrl as DidUrl,
    ctype,
    hashType: rawHash as HashType
  });

  // step 2: build rawCredential
  console.log(`${JSON.stringify(raw.toRawCredential(rawCredHash as HashType))}`);

  return true;
}

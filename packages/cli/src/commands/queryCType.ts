// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';

import { CType } from '@zcloak/ctype/types';

import { getCType } from '../utils';

export const queryCType = async (didResolver: string, ctypeHash: string, output?: string) => {
  let baseUrl: string;

  if (ctypeHash === null) {
    console.log('your ctype hash input is null !!!');

    return;
  }

  if (didResolver === 'dev') {
    baseUrl = 'https://did-service.zkid.xyz';
  } else if (didResolver === 'prod') {
    baseUrl = 'https://did-service.zkid.app';
  } else {
    console.log('wrong did resolver !!!');

    return;
  }

  const ctype: CType | undefined = await getCType(baseUrl, ctypeHash);

  if (!ctype) {
    return false;
  }

  if (output === undefined) {
    console.log(`${JSON.stringify(ctype)}`);
  } else {
    console.log(`output ctype object into: ${output}`);
    fs.writeFileSync(output, JSON.stringify(ctype));
  }

  return ctype;
};

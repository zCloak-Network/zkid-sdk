// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';
import fs from 'fs';
import qs from 'qs';

import { CType } from '@zcloak/ctype/types';

export const queryCType = async (env: string, ctypeHash: string, output?: string) => {
  let baseUrl: string;

  if (ctypeHash === null) {
    console.log('your ctype hash input is null !!!');

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

  const ctypeRes = await axios.get(`${baseUrl}/ctype?${qs.stringify({ id: ctypeHash })}`);

  if (ctypeRes.status !== 200) {
    throw new Error(`ctype query failed ${ctypeHash}`);
  }

  const ctype: CType = ctypeRes.data.data[0].rawData;

  if (output === undefined) {
    console.log(`${JSON.stringify(ctype)}`);
  } else {
    console.log(`output ctype object into: ${output}`);
    fs.writeFileSync(output, JSON.stringify(ctype));
  }

  return ctype;
};

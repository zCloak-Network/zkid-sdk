// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';

import { getDidDoc } from '../utils';

export const queryDidDoc = async (env: string, didUrl: string, output?: string) => {
  let baseUrl: string;

  if (env === 'dev') {
    baseUrl = 'https://did-service.starks.network';
  } else if (env === 'prod') {
    baseUrl = 'https://did-service.zkid.app';
  } else {
    console.log('wrong enviroment !!!');

    return;
  }

  const holderDidDoc = await getDidDoc(baseUrl, didUrl);

  if (output === undefined) {
    console.log(`${JSON.stringify(holderDidDoc)}`);
  } else {
    console.log(`output did object into: ${output}`);
    fs.writeFileSync(output, JSON.stringify(holderDidDoc));
  }

  return holderDidDoc;
};

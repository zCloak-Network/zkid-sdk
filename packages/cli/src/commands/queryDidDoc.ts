// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';
import fs from 'fs';

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

  const didRes = await axios.get(`${baseUrl}/did/${didUrl}`);

  if (didRes.status !== 200) {
    throw new Error(`get ${didUrl} did document failed`);
  }

  const holderDidDoc = didRes.data.data.rawData;

  if (output === undefined) {
    console.log(`holder Did Doc: ${JSON.stringify(holderDidDoc)}`);
  } else {
    console.log(`output did object into: ${output}`);
    fs.writeFileSync(output, JSON.stringify(holderDidDoc));
  }

  return holderDidDoc;
};

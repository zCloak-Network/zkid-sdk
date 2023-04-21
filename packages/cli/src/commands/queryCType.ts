// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CType } from '@zcloak/ctype/types';

import { choseResolver, getCType } from '../utils';

export const queryCType = async (didResolver: string, ctypeHash: string) => {
  const baseUrl = choseResolver(didResolver);

  if (!baseUrl) {
    return false;
  }

  if (ctypeHash === null) {
    console.log('your ctype hash input is null !!!');

    return false;
  }

  const ctype: CType | undefined = await getCType(baseUrl, ctypeHash);

  if (!ctype) {
    return false;
  }

  console.log(`${JSON.stringify(ctype)}`);

  return true;
};

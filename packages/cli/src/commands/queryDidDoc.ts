// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { choseResolver, getDidDoc } from '../utils';

export const queryDidDoc = async (didResolver: string, didUrl: string | undefined) => {
  const baseUrl = choseResolver(didResolver);

  if (!baseUrl) {
    return false;
  }

  if (didUrl === undefined) {
    console.log('did url flag is undefiend');

    return false;
  }

  const holderDidDoc = await getDidDoc(baseUrl, didUrl);

  console.log(`${JSON.stringify(holderDidDoc)}`);

  return holderDidDoc;
};

// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initCrypto, mnemonicGenerate } from '@zcloak/crypto';
import { getPublish } from '@zcloak/ctype/publish';
import { BaseCType } from '@zcloak/ctype/types';
import { Did, helpers } from '@zcloak/did';

import { ctypeVerify } from './ctypeVerify';

describe('publish ctype', (): void => {
  let publisher: Did;

  beforeAll(async (): Promise<void> => {
    await initCrypto();

    publisher = helpers.createEcdsaFromMnemonic(mnemonicGenerate(12));
  });

  it('get ctype for publish', async () => {
    const base: BaseCType = {
      title: 'Test',
      description: 'Test',
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        age: {
          type: 'integer'
        },
        no: {
          type: 'string'
        }
      },
      required: ['name', 'age']
    };

    const ctype = getPublish(base, publisher);

    expect(await ctypeVerify(ctype, publisher.getDocument())).toBe(true);
  });
});

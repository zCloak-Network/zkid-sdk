// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { alice } from 'test-support';

import { initCrypto } from '@zcloak/crypto';
import { getPublish } from '@zcloak/ctype/publish';
import { BaseCType } from '@zcloak/ctype/types';
import { Did } from '@zcloak/did';

import { ctypeVerify } from './ctypeVerify';

describe('publish ctype', (): void => {
  const publisher: Did = alice;

  beforeAll(async (): Promise<void> => {
    await initCrypto();
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

    const ctype = await getPublish(base, publisher);

    expect(await ctypeVerify(ctype, publisher.getDocument())).toBe(true);
  });
});

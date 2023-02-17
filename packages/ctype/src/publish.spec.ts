// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BaseCType } from './types';

import { charlie } from 'test-support';

import { initCrypto } from '@zcloak/crypto';

import { DEFAULT_CTYPE_SCHEMA } from './defaults';
import { getCTypeHash, getPublish } from './publish';

describe('publish ctype', (): void => {
  beforeAll(async (): Promise<void> => {
    await initCrypto();
  });

  it('get ctype hash', (): void => {
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

    expect(getCTypeHash(base, charlie.id)).toEqual(
      getCTypeHash(base, charlie.getKeyUrl('authentication'))
    );
  });

  it('get ctype for publish', async (): Promise<void> => {
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

    expect(await getPublish(base, charlie)).toMatchObject({
      ...base,
      $schema: DEFAULT_CTYPE_SCHEMA
    });
  });
});

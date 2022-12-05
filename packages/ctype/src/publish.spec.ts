// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BaseCType } from './types';

import { initCrypto, mnemonicGenerate } from '@zcloak/crypto';
import { Did, helpers } from '@zcloak/did';

import { DEFAULT_CTYPE_SCHEMA } from './defaults';
import { getCTypeHash, getPublish } from './publish';

describe('publish ctype', (): void => {
  let publisher: Did;

  beforeAll(async (): Promise<void> => {
    await initCrypto();

    publisher = helpers.createEcdsaFromMnemonic(mnemonicGenerate(12));
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

    expect(getCTypeHash(base, publisher.id)).toEqual(
      getCTypeHash(base, publisher.getKeyUrl('authentication'))
    );
  });

  it('get ctype for publish', (): void => {
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

    expect(getPublish(base, publisher)).toMatchObject({ ...base, $schema: DEFAULT_CTYPE_SCHEMA });
  });
});

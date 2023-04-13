// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { alice } from 'test-support';

import { initCrypto } from '@zcloak/crypto';

import { encodeDidUrl } from './utils';

describe('Did utils', (): void => {
  beforeAll(async () => {
    await initCrypto();
  });

  it('encode did url', () => {
    const encoded = encodeDidUrl(alice.id);

    expect(encoded).toEqual(
      new Uint8Array([
        100, 105, 100, 58, 122, 107, 58, 17, 248, 183, 127, 52, 252, 241, 75, 112, 149, 191, 82, 40, 172, 6, 6, 50, 78,
        130, 209
      ])
    );
  });

  it('encode did has fragment', () => {
    const encoded = encodeDidUrl(alice.getKeyUrl('authentication'));

    expect(encoded).toEqual(
      new Uint8Array([
        100, 105, 100, 58, 122, 107, 58, 17, 248, 183, 127, 52, 252, 241, 75, 112, 149, 191, 82, 40, 172, 6, 6, 50, 78,
        130, 209
      ])
    );
  });
});

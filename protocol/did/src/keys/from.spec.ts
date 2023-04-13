// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DOCUMENTS, testKeyring } from 'test-support';

import { ethereumEncode, initCrypto } from '@zcloak/crypto';

import { fromMnemonic } from './from';

describe('create did use keys', (): void => {
  beforeAll(async () => {
    await initCrypto();
  });

  it('fromMnemonic with index 0 and type ecdsa', () => {
    const mnemonic = 'health correct setup usage father decorate curious copper sorry recycle skin equal';
    const did = fromMnemonic(testKeyring, mnemonic, 'ecdsa', 0);

    expect(did.getDocument()).toMatchObject(DOCUMENTS.alice);
  });

  it.each(Array.from({ length: 10 }).map((_, index) => index))('fromMnemonic with index: %p', (index) => {
    const mnemonic = 'health correct setup usage father decorate curious copper sorry recycle skin equal';
    const did = fromMnemonic(testKeyring, mnemonic, 'ecdsa', index);

    expect(did.identifier).toBe(
      ethereumEncode(testKeyring.createFromMnemonic(mnemonic, `/m/44'/60'/0'/0/${index}`, 'ecdsa').publicKey)
    );
  });
});

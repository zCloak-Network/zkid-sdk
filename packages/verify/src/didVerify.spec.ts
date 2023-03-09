// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { testKeyring } from 'test-support';

import { initCrypto } from '@zcloak/crypto';
import { keys } from '@zcloak/did';

import { verifyDidDocumentProof } from './verifyDidDocumentProof';

describe('did verify', (): void => {
  beforeAll(async () => {
    await initCrypto();
  });

  describe('verify did document proof', (): void => {
    it('create ecdsa did from mnemonic and getPublish and verify', async (): Promise<void> => {
      const mnemonic = 'health correct setup usage father decorate curious copper sorry recycle skin equal';
      const did = keys.fromMnemonic(testKeyring, mnemonic);

      const document = await did.getPublish();

      expect(await verifyDidDocumentProof(document)).toBe(true);
    });
  });
});

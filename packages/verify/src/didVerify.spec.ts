// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createEcdsaFromMnemonic } from '@zcloak/did/did/helpers';

import { verifyDidDocumentProof } from './verifyDidDocumentProof';

describe('did verify', (): void => {
  describe('verify did document proof', (): void => {
    it('create ecdsa did from mnemonic and getPublish and verify', async (): Promise<void> => {
      const mnemonic =
        'health correct setup usage father decorate curious copper sorry recycle skin equal';
      const did = createEcdsaFromMnemonic(mnemonic);

      const document = did.getPublish('did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0');

      expect(await verifyDidDocumentProof(document)).toBe(true);
    });
  });
});

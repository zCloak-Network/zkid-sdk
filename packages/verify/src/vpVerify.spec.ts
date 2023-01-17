// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CType } from '@zcloak/ctype/types';

import { initCrypto, mnemonicGenerate, randomAsHex } from '@zcloak/crypto';
import { getPublish } from '@zcloak/ctype/publish';
import { Did, helpers } from '@zcloak/did';
import { MockDidResolver } from '@zcloak/did-resolver';
import { Raw, VerifiableCredentialBuilder, VerifiablePresentationBuilder } from '@zcloak/vc';

import { vpVerify } from './vpVerify';

const resolver = new MockDidResolver();

const CONTENTS1 = {
  name: 'zCloak',
  age: 19,
  birthday: '2022.10.31',
  isUser: true
};

describe('VerifiablePresentation', (): void => {
  let holder: Did;
  let issuer1: Did;
  let issuer2: Did;
  let issuer3: Did;
  let ctype: CType;
  let rawCtype: Raw;

  beforeAll(async (): Promise<void> => {
    await initCrypto();
    holder = helpers.createEcdsaFromMnemonic(mnemonicGenerate(12));
    issuer1 = helpers.createEcdsaFromMnemonic(mnemonicGenerate(12));
    issuer2 = helpers.createEcdsaFromMnemonic(mnemonicGenerate(12));
    issuer3 = helpers.createEcdsaFromMnemonic(mnemonicGenerate(12));
    resolver.addDocument(holder.getDocument());
    resolver.addDocument(issuer1.getDocument());
    resolver.addDocument(issuer2.getDocument());
    resolver.addDocument(issuer3.getDocument());

    ctype = await getPublish(
      {
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
          birthday: {
            type: 'string'
          },
          isUser: {
            type: 'boolean'
          }
        }
      },
      issuer1
    );
    rawCtype = new Raw({
      contents: CONTENTS1,
      owner: holder.id,
      ctype,
      hashType: 'RescuePrime'
    });

    rawCtype.calcRootHash();
  });

  describe('VerifiablePresentation single vc', (): void => {
    it('verify vp with VPType: VP', async (): Promise<void> => {
      const vc = await VerifiableCredentialBuilder.fromRawCredential(
        rawCtype.toRawCredential(),
        ctype
      )
        .setExpirationDate(null)
        .build(issuer1);

      const vpBuilder = new VerifiablePresentationBuilder(holder);

      const challenge = randomAsHex();
      const vp = await vpBuilder.addVC(vc, 'VP').build(undefined, challenge);

      expect(await vpVerify(vp, resolver)).toBe(true);
    });

    it('create ctype vp with VPType: VP_Digest', async (): Promise<void> => {
      const vc = await VerifiableCredentialBuilder.fromRawCredential(
        rawCtype.toRawCredential(),
        ctype
      )
        .setExpirationDate(null)
        .build(issuer1);

      const vpBuilder = new VerifiablePresentationBuilder(holder);

      const challenge = randomAsHex();
      const vp = await vpBuilder.addVC(vc, 'VP_Digest').build(undefined, challenge);

      expect(await vpVerify(vp, resolver)).toBe(true);
    });

    it('verify vp with VPType: VP_SelectiveDisclosure', async (): Promise<void> => {
      const vc = await VerifiableCredentialBuilder.fromRawCredential(
        rawCtype.toRawCredential(),
        ctype
      )
        .setExpirationDate(null)
        .build(issuer1);

      const vpBuilder = new VerifiablePresentationBuilder(holder);

      const challenge = randomAsHex();
      const vp = await vpBuilder
        .addVC(vc, 'VP_SelectiveDisclosure', ['isUser'])
        .build(undefined, challenge);

      expect(await vpVerify(vp, resolver)).toBe(true);
    });
  });
});

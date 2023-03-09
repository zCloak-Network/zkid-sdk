// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CType } from '@zcloak/ctype/types';

import { alice, bob, testResolver } from 'test-support';

import { initCrypto, randomAsHex } from '@zcloak/crypto';
import { getPublish } from '@zcloak/ctype/publish';
import { Did } from '@zcloak/did';
import { Raw, VerifiableCredentialBuilder, VerifiablePresentationBuilder } from '@zcloak/vc';

import { vpVerify } from './vpVerify';

const CONTENTS1 = {
  name: 'zCloak',
  age: 19,
  birthday: '2022.10.31',
  isUser: true
};

describe('VerifiablePresentation', (): void => {
  const holder: Did = alice;
  const issuer1: Did = bob;
  let ctype: CType;
  let rawCtype: Raw;

  beforeAll(async (): Promise<void> => {
    await initCrypto();

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
  });

  describe('VerifiablePresentation single vc', (): void => {
    it('verify vp with VPType: VP', async (): Promise<void> => {
      const vc = await VerifiableCredentialBuilder.fromRawCredential(rawCtype.toRawCredential(), ctype)
        .setExpirationDate(null)
        .build(issuer1);

      const vpBuilder = new VerifiablePresentationBuilder(holder);

      const challenge = randomAsHex();
      const vp = await vpBuilder.addVC(vc, 'VP').build(undefined, challenge);

      expect(await vpVerify(vp, testResolver)).toBe(true);
    });

    it('create ctype vp with VPType: VP_Digest', async (): Promise<void> => {
      const vc = await VerifiableCredentialBuilder.fromRawCredential(rawCtype.toRawCredential(), ctype)
        .setExpirationDate(null)
        .build(issuer1);

      const vpBuilder = new VerifiablePresentationBuilder(holder);

      const challenge = randomAsHex();
      const vp = await vpBuilder.addVC(vc, 'VP_Digest').build(undefined, challenge);

      expect(await vpVerify(vp, testResolver)).toBe(true);
    });

    it('verify vp with VPType: VP_SelectiveDisclosure', async (): Promise<void> => {
      const vc = await VerifiableCredentialBuilder.fromRawCredential(rawCtype.toRawCredential(), ctype)
        .setExpirationDate(null)
        .build(issuer1);

      const vpBuilder = new VerifiablePresentationBuilder(holder);

      const challenge = randomAsHex();
      const vp = await vpBuilder.addVC(vc, 'VP_SelectiveDisclosure', ['isUser']).build(undefined, challenge);

      expect(await vpVerify(vp, testResolver)).toBe(true);
    });
  });
});

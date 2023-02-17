// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CType } from '@zcloak/ctype/types';

import { initCrypto, mnemonicGenerate } from '@zcloak/crypto';
import { getPublish } from '@zcloak/ctype/publish';
import { Did, helpers } from '@zcloak/did';

import { DEFAULT_CONTEXT, DEFAULT_VC_VERSION } from '../defaults';
import { isPrivateVC, isPublicVC } from '../is';
import { Raw } from './raw';
import { VerifiableCredentialBuilder } from './vc';

const CONTENTS = {
  name: 'zCloak',
  age: 19,
  birthday: '2022.10.31',
  isUser: true
};

describe('VerifiableCredential', (): void => {
  let holder: Did;
  let issuer: Did;
  let ctype: CType;

  beforeAll(async (): Promise<void> => {
    await initCrypto();
    holder = helpers.createEcdsaFromMnemonic(mnemonicGenerate(12));
    issuer = helpers.createEcdsaFromMnemonic(mnemonicGenerate(12));

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
        },
        required: ['name', 'age']
      },
      issuer
    );
  });

  it('check raw', (): void => {
    const raw = new Raw({
      contents: CONTENTS,
      owner: holder.id,
      ctype,
      hashType: 'RescuePrime'
    });

    expect(raw.checkSubject()).toBe(true);
  });

  it('generate RawCredential from raw', (): void => {
    const raw = new Raw({
      contents: CONTENTS,
      owner: holder.id,
      ctype,
      hashType: 'RescuePrime'
    });

    expect(raw.toRawCredential('Keccak256')).toMatchObject({
      ctype: ctype.$id,
      credentialSubject: CONTENTS,
      holder: holder.id,
      hasher: ['RescuePrime', 'Keccak256']
    });
  });

  describe('PrivateVerifiableCredential', () => {
    it('build VC from Raw instance', async (): Promise<void> => {
      const raw = new Raw({
        contents: CONTENTS,
        owner: holder.id,
        ctype,
        hashType: 'RescuePrime'
      });

      const vcBuilder = new VerifiableCredentialBuilder(raw);

      const now = Date.now();

      vcBuilder
        .setContext(DEFAULT_CONTEXT)
        .setVersion(DEFAULT_VC_VERSION)
        .setIssuanceDate(now)
        .setDigestHashType('Keccak256')
        .setExpirationDate(null);

      expect(vcBuilder).toMatchObject({
        raw,
        '@context': DEFAULT_CONTEXT,
        issuanceDate: now,
        digestHashType: 'Keccak256'
      });

      const vc = await vcBuilder.build(issuer);

      expect(isPrivateVC(vc)).toBe(true);

      expect(vc).toMatchObject({
        '@context': DEFAULT_CONTEXT,
        version: DEFAULT_VC_VERSION,
        ctype: ctype.$id,
        issuanceDate: now,
        credentialSubject: CONTENTS,
        issuer: issuer.id,
        holder: holder.id,
        hasher: ['RescuePrime', 'Keccak256'],
        proof: [
          {
            type: 'EcdsaSecp256k1SignatureEip712',
            proofPurpose: 'assertionMethod'
          }
        ]
      });
    });

    it('build VC from RawCredential', async (): Promise<void> => {
      const raw = new Raw({
        contents: CONTENTS,
        owner: holder.id,
        ctype,
        hashType: 'RescuePrime'
      });

      const now = Date.now();

      const vcBuilder = VerifiableCredentialBuilder.fromRawCredential(
        raw.toRawCredential('Keccak256'),
        ctype
      )
        .setExpirationDate(null)
        .setIssuanceDate(now);

      expect(vcBuilder).toMatchObject({
        raw,
        '@context': DEFAULT_CONTEXT,
        issuanceDate: now,
        digestHashType: 'Keccak256'
      });

      const vc = await vcBuilder.build(issuer);

      expect(isPrivateVC(vc)).toBe(true);

      expect(vc).toMatchObject({
        '@context': DEFAULT_CONTEXT,
        version: DEFAULT_VC_VERSION,
        ctype: ctype.$id,
        issuanceDate: now,
        credentialSubject: CONTENTS,
        issuer: issuer.id,
        holder: holder.id,
        hasher: ['RescuePrime', 'Keccak256'],
        proof: [
          {
            type: 'EcdsaSecp256k1SignatureEip712',
            proofPurpose: 'assertionMethod'
          }
        ]
      });
    });
  });

  describe('PublicVerifiableCredential', () => {
    it('build public VC from Raw instance', async (): Promise<void> => {
      const raw = new Raw({
        contents: CONTENTS,
        owner: holder.id,
        ctype,
        hashType: 'RescuePrime'
      });

      const vcBuilder = new VerifiableCredentialBuilder(raw);

      const now = Date.now();

      vcBuilder
        .setContext(DEFAULT_CONTEXT)
        .setVersion(DEFAULT_VC_VERSION)
        .setIssuanceDate(now)
        .setDigestHashType('Keccak256')
        .setExpirationDate(null);

      expect(vcBuilder).toMatchObject({
        raw,
        '@context': DEFAULT_CONTEXT,
        issuanceDate: now,
        digestHashType: 'Keccak256'
      });

      const vc = await vcBuilder.build(issuer, true);

      expect(isPublicVC(vc)).toBe(true);

      expect(vc).toMatchObject({
        '@context': DEFAULT_CONTEXT,
        version: DEFAULT_VC_VERSION,
        ctype: ctype.$id,
        issuanceDate: now,
        credentialSubject: CONTENTS,
        issuer: issuer.id,
        holder: holder.id,
        hasher: ['RescuePrime', 'Keccak256'],
        proof: [
          {
            type: 'EcdsaSecp256k1SignatureEip712',
            proofPurpose: 'assertionMethod'
          }
        ]
      });
    });
  });
});

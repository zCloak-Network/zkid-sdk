// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';

import { generateMnemonic, initCrypto, randomAsHex } from '@zcloak/crypto';
import { Did, helpers } from '@zcloak/did';

import { DEFAULT_CONTEXT, DEFAULT_VC_VERSION } from '../defaults';
import { Raw } from './raw';
import { VerifiableCredentialBuilder } from './vc';

const CONTENTS = {
  name: 'zCloak',
  age: 19,
  birthday: '2022.10.31',
  isUser: true
};

describe('VerifiableCredential', (): void => {
  const holder: Did = helpers.createEcdsaFromMnemonic(generateMnemonic(12));
  const issuer: Did = helpers.createEcdsaFromMnemonic(generateMnemonic(12));
  const ctype: HexString = randomAsHex(32);

  beforeEach(async (): Promise<void> => {
    await initCrypto();
  });

  it('check raw', (): void => {
    const raw = new Raw({
      contents: CONTENTS,
      owner: holder.id,
      ctype,
      hashType: 'Rescue'
    });

    raw.calcRootHash();
    expect(raw.check()).toBe(true);
  });

  it('generate RawCredential from raw', (): void => {
    const raw = new Raw({
      contents: CONTENTS,
      owner: holder.id,
      ctype,
      hashType: 'Rescue'
    });

    raw.calcRootHash();

    expect(raw.toRawCredential('Keccak256')).toMatchObject({
      ctype,
      credentialSubject: CONTENTS,
      holder: holder.id,
      hasher: ['Rescue', 'Keccak256']
    });
  });

  it('build VC from Raw instance', (): void => {
    const raw = new Raw({
      contents: CONTENTS,
      owner: holder.id,
      ctype,
      hashType: 'Rescue'
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

    const vc = vcBuilder.build(issuer);

    expect(vc).toMatchObject({
      '@context': DEFAULT_CONTEXT,
      version: DEFAULT_VC_VERSION,
      ctype,
      issuanceDate: now,
      credentialSubject: CONTENTS,
      issuer: issuer.id,
      holder: holder.id,
      hasher: ['Rescue', 'Keccak256'],
      proof: [
        {
          type: 'EcdsaSecp256k1Signature2019',
          proofPurpose: 'assertionMethod'
        }
      ]
    });
  });

  it('build VC from RawCredential', (): void => {
    const raw = new Raw({
      contents: CONTENTS,
      owner: holder.id,
      ctype,
      hashType: 'Rescue'
    });

    raw.calcRootHash();
    const now = Date.now();

    const vcBuilder = VerifiableCredentialBuilder.fromRawCredential(
      raw.toRawCredential('Keccak256')
    )
      .setExpirationDate(null)
      .setIssuanceDate(now);

    expect(vcBuilder).toMatchObject({
      raw,
      '@context': DEFAULT_CONTEXT,
      issuanceDate: now,
      digestHashType: 'Keccak256'
    });

    const vc = vcBuilder.build(issuer);

    expect(vc).toMatchObject({
      '@context': DEFAULT_CONTEXT,
      version: DEFAULT_VC_VERSION,
      ctype,
      issuanceDate: now,
      credentialSubject: CONTENTS,
      issuer: issuer.id,
      holder: holder.id,
      hasher: ['Rescue', 'Keccak256'],
      proof: [
        {
          type: 'EcdsaSecp256k1Signature2019',
          proofPurpose: 'assertionMethod'
        }
      ]
    });
  });
});

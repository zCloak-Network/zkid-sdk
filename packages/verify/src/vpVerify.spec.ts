// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CType } from '@zcloak/ctype/types';

import { alice, bob, testResolver } from 'test-support';

import { initCrypto, randomAsHex } from '@zcloak/crypto';
import { getPublish } from '@zcloak/ctype/publish';
import { Did } from '@zcloak/did';
import { Raw, VerifiableCredentialBuilder, VerifiablePresentationBuilder } from '@zcloak/vc';
import { VerifiablePresentation } from '@zcloak/vc/types';

import { vpVerify } from './vpVerify';

const CONTENTS1 = {
  name: 'zCloak',
  age: 19,
  birthday: '2022.10.31',
  isUser: true
};

const vp1: VerifiablePresentation = {
  '@context': ['https://www.w3.org/2018/credentials/v1'],
  version: '1',
  type: ['VP_SelectiveDisclosure'],
  verifiableCredential: [
    {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      version: '2',
      ctype: '0xab82151238ca0dbe9e343caf2b1042650d9a977b29ad7180c3a14e5df537ef40',
      issuanceDate: 1693300491044,
      credentialSubject: { isUser: true },
      issuer: ['did:zk:0x57E7b664aaa7C895878DdCa5790526B9659350Ec'],
      holder: 'did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1',
      hasher: ['Keccak256', 'Keccak256'],
      digest: '0xcaf72e5ad65c8fe8d489346b3aed6152e8f02b8487fe16dd7037ec66943f4db4',
      proof: [
        {
          type: 'EcdsaSecp256k1SignatureEip191',
          created: 1693300491046,
          verificationMethod: 'did:zk:0x57E7b664aaa7C895878DdCa5790526B9659350Ec#key-0',
          proofPurpose: 'assertionMethod',
          proofValue: 'z7BbcEoiUpyQKmJ1soNNX6MicHzPpJUcGXLQ65QWYZFY9eArHUPmh4Kgf1D9EsLJbjGYDQpGxGcuA98etPsyXh82C8'
        }
      ],
      credentialSubjectHashes: [
        '0x1e00eee4ae14ff270e57b4c20c43a287bf5ea34828069650d3c4edc4790d2535',
        '0x68500dbd64b29d43a580cf437c0eeb899e2d76ebb06e9fc4565f83d76708509e',
        '0xaa4831bd6cd6adaab67ab872dd606c41bad95814e201d168e92c45c2b41a8724',
        '0x6d7154b2efb83c39a5cf81ade1ec18509435c573211301ef3cd45957619d4121'
      ],
      credentialSubjectNonceMap: {
        '0x5fe7f977e71dba2ea1a68e21057beebb9be2ac30c6410aa38d4f3fbe41dcffd2':
          '0x7e40f40af672df4c16ee00317cac4a1b6ab62b68efeecd18940e041472765fc7'
      }
    }
  ],
  id: '0xbf881c79f3385dca051fbfb367a2fccd86ca28b9dba87b35d47c0d8cece24167',
  proof: {
    type: 'EcdsaSecp256k1SignatureEip191',
    created: 1693300491047,
    verificationMethod: 'did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1',
    proofPurpose: 'controller',
    proofValue: 'zLFLYALJPDUK9LE69LKBnc4FV2ov7cTj7PX6ykYNsdLBDcoux1FW3Q3eeXRoou8EWhnf8xHG1V3waTTC61ezb25Jz3',
    challenge: '0x6ef8cf2355352b0fafd4b1a4b719520a7f2cdd5e10fe27ddd0353955d154f3f5'
  },
  hasher: ['Keccak256']
};

describe('VerifiablePresentation', (): void => {
  const holder: Did = alice;
  const issuer1: Did = bob;
  let ctype: CType;
  let rawCtype: Raw;
  let rawCtype2: Raw;

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

    rawCtype2 = new Raw({
      contents: CONTENTS1,
      owner: holder.id,
      ctype,
      hashType: 'Keccak256'
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
  describe('VerifiablePresentation single vc with Version2 keccak256', (): void => {
    it('verify vp with VPType: VP', async (): Promise<void> => {
      const vc = await VerifiableCredentialBuilder.fromRawCredential(rawCtype2.toRawCredential(), ctype)
        .setExpirationDate(null)
        .build(issuer1);

      const vpBuilder = new VerifiablePresentationBuilder(holder);

      const challenge = randomAsHex();
      const vp = await vpBuilder.addVC(vc, 'VP').build(undefined, challenge);

      expect(await vpVerify(vp, testResolver)).toBe(true);
    });

    it('create ctype vp with VPType: VP_Digest', async (): Promise<void> => {
      const vc = await VerifiableCredentialBuilder.fromRawCredential(rawCtype2.toRawCredential(), ctype)
        .setExpirationDate(null)
        .build(issuer1);

      const vpBuilder = new VerifiablePresentationBuilder(holder);

      const challenge = randomAsHex();
      const vp = await vpBuilder.addVC(vc, 'VP_Digest').build(undefined, challenge);

      expect(await vpVerify(vp, testResolver)).toBe(true);
    });

    it('verify vp with VPType: VP_SelectiveDisclosure', async (): Promise<void> => {
      const vc = await VerifiableCredentialBuilder.fromRawCredential(rawCtype2.toRawCredential(), ctype)
        .setExpirationDate(null)
        .build(issuer1);

      const vpBuilder = new VerifiablePresentationBuilder(holder);

      const challenge = randomAsHex();
      const vp = await vpBuilder.addVC(vc, 'VP_SelectiveDisclosure', ['isUser']).build(undefined, challenge);

      expect(await vpVerify(vp, testResolver)).toBe(true);
    });

    it('verify vp with VPType: VP_SelectiveDisclosure with exist VP', async (): Promise<void> => {
      expect(await vpVerify(vp1, testResolver)).toBe(true);
    });
  });
});

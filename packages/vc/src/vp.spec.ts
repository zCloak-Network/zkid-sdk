// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CType } from '@zcloak/ctype/types';

import { assert } from '@polkadot/util';

import { initCrypto, mnemonicGenerate } from '@zcloak/crypto';
import { getPublish } from '@zcloak/ctype/publish';
import { Did, helpers } from '@zcloak/did';

import { Raw, VerifiableCredentialBuilder } from './credential';
import { DEFAULT_CONTEXT, DEFAULT_VP_HASH_TYPE, DEFAULT_VP_VERSION } from './defaults';
import { isPrivateVC } from './is';
import { calcRoothash } from './rootHash';
import { VerifiablePresentationBuilder, vpID } from './vp';

const CONTENTS1 = {
  name: 'zCloak',
  age: 19,
  birthday: '2022.10.31',
  isUser: true
};
const CONTENTS2 = {
  No: 'E35557645365474',
  birthday: Date.now()
};
const CONTENTS3 = {
  levels: ['1', '2', '3']
};

describe('VerifiablePresentation', (): void => {
  let holder: Did;
  let issuer1: Did;
  let issuer2: Did;
  let issuer3: Did;
  let ctype1: CType;
  let ctype2: CType;
  let ctype3: CType;
  let rawCtype1: Raw;
  let rawCtype2: Raw;
  let rawCtype3: Raw;

  beforeAll(async (): Promise<void> => {
    await initCrypto();
    holder = helpers.createEcdsaFromMnemonic(mnemonicGenerate(12));
    issuer1 = helpers.createEcdsaFromMnemonic(mnemonicGenerate(12));
    issuer2 = helpers.createEcdsaFromMnemonic(mnemonicGenerate(12));
    issuer3 = helpers.createEcdsaFromMnemonic(mnemonicGenerate(12));

    ctype1 = await getPublish(
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

    ctype2 = await getPublish(
      {
        title: 'Test',
        description: 'Test',
        type: 'object',
        properties: {
          No: {
            type: 'string'
          },
          birthday: {
            type: 'integer'
          }
        }
      },
      issuer2
    );

    ctype3 = await getPublish(
      {
        title: 'Test',
        description: 'Test',
        type: 'object',
        properties: {
          levels: {
            type: 'array'
          }
        }
      },
      issuer2
    );

    rawCtype1 = new Raw({
      contents: CONTENTS1,
      owner: holder.id,
      ctype: ctype1,
      hashType: 'RescuePrime'
    });
    rawCtype2 = new Raw({
      contents: CONTENTS2,
      owner: holder.id,
      ctype: ctype2,
      hashType: 'RescuePrime'
    });
    rawCtype3 = new Raw({
      contents: CONTENTS3,
      owner: holder.id,
      ctype: ctype3,
      hashType: 'RescuePrime'
    });
  });

  describe('VerifiablePresentation single vc', (): void => {
    it('create ctype1 vp with VPType: VP', async (): Promise<void> => {
      const vc = await VerifiableCredentialBuilder.fromRawCredential(
        rawCtype1.toRawCredential(),
        ctype1
      )
        .setExpirationDate(null)
        .build(issuer1);

      const vpBuilder = new VerifiablePresentationBuilder(holder);

      const vp = await vpBuilder.addVC(vc, 'VP').build();

      expect(vp).toMatchObject({
        '@context': DEFAULT_CONTEXT,
        version: DEFAULT_VP_VERSION,
        type: ['VP'],
        verifiableCredential: [vc],
        id: vpID([vc.digest], vp.version, DEFAULT_VP_HASH_TYPE).hash,
        proof: {
          type: 'EcdsaSecp256k1SignatureEip191',
          proofPurpose: 'authentication'
        },
        hasher: [DEFAULT_VP_HASH_TYPE]
      });
    });

    it('create ctype1 vp with VPType: VP_Digest', async (): Promise<void> => {
      const vc = await VerifiableCredentialBuilder.fromRawCredential(
        rawCtype1.toRawCredential(),
        ctype1
      )
        .setExpirationDate(null)
        .build(issuer1);

      const vpBuilder = new VerifiablePresentationBuilder(holder);

      const vp = await vpBuilder.addVC(vc, 'VP_Digest').build();

      assert(isPrivateVC(vc), '');

      expect(vp).toMatchObject({
        '@context': DEFAULT_CONTEXT,
        version: DEFAULT_VP_VERSION,
        type: ['VP_Digest'],
        verifiableCredential: [
          {
            ...vc,
            credentialSubject: calcRoothash(CONTENTS1, vc.hasher[0], vc.credentialSubjectNonceMap)
              .rootHash,
            credentialSubjectHashes: [],
            credentialSubjectNonceMap: {}
          }
        ],
        id: vpID([vc.digest], vp.version, DEFAULT_VP_HASH_TYPE).hash,
        proof: {
          type: 'EcdsaSecp256k1SignatureEip191',
          proofPurpose: 'authentication'
        },
        hasher: [DEFAULT_VP_HASH_TYPE]
      });
    });

    it('create ctype1 vp with VPType: VP_SelectiveDisclosure', async (): Promise<void> => {
      const vc = await VerifiableCredentialBuilder.fromRawCredential(
        rawCtype1.toRawCredential(),
        ctype1
      )
        .setExpirationDate(null)
        .build(issuer1);

      const vpBuilder = new VerifiablePresentationBuilder(holder);

      const vp = await vpBuilder.addVC(vc, 'VP_SelectiveDisclosure', ['isUser']).build();

      assert(isPrivateVC(vc), '');

      expect(vp).toMatchObject({
        '@context': DEFAULT_CONTEXT,
        version: DEFAULT_VP_VERSION,
        type: ['VP_SelectiveDisclosure'],
        verifiableCredential: [
          {
            ...vc,
            credentialSubject: {
              isUser: true
            },
            credentialSubjectNonceMap: {
              [Object.keys(vc.credentialSubjectNonceMap)[3]]: Object.values(
                vc.credentialSubjectNonceMap
              )[3]
            }
          }
        ],
        id: vpID([vc.digest], vp.version, DEFAULT_VP_HASH_TYPE).hash,
        proof: {
          type: 'EcdsaSecp256k1SignatureEip191',
          proofPurpose: 'authentication'
        },
        hasher: [DEFAULT_VP_HASH_TYPE]
      });
    });
  });

  describe('VerifiablePresentation multi vc by ctype2', (): void => {
    it('create vp has multi ctype2 vc with VPType: VP', async (): Promise<void> => {
      const vc1 = await VerifiableCredentialBuilder.fromRawCredential(
        rawCtype2.toRawCredential(),
        ctype2
      )
        .setExpirationDate(null)
        .build(issuer1);
      const vc2 = await VerifiableCredentialBuilder.fromRawCredential(
        rawCtype2.toRawCredential(),
        ctype2
      )
        .setExpirationDate(null)
        .build(issuer2);

      const vpBuilder = new VerifiablePresentationBuilder(holder);

      const vp = await vpBuilder.addVC(vc1, 'VP').addVC(vc2, 'VP').build();

      expect(vp).toMatchObject({
        '@context': DEFAULT_CONTEXT,
        version: DEFAULT_VP_VERSION,
        type: ['VP', 'VP'],
        verifiableCredential: [vc1, vc2],
        id: vpID([vc1.digest, vc2.digest], vp.version, DEFAULT_VP_HASH_TYPE).hash,
        proof: {
          type: 'EcdsaSecp256k1SignatureEip191',
          proofPurpose: 'authentication'
        },
        hasher: [DEFAULT_VP_HASH_TYPE]
      });
    });

    it('create vp has multi ctype2 vc with VPType: VP_Digest', async (): Promise<void> => {
      const vc1 = await VerifiableCredentialBuilder.fromRawCredential(
        rawCtype2.toRawCredential(),
        ctype2
      )
        .setExpirationDate(null)
        .build(issuer1);
      const vc2 = await VerifiableCredentialBuilder.fromRawCredential(
        rawCtype2.toRawCredential(),
        ctype2
      )
        .setExpirationDate(null)
        .build(issuer2);

      const vpBuilder = new VerifiablePresentationBuilder(holder);

      const vp = await vpBuilder.addVC(vc1, 'VP_Digest').addVC(vc2, 'VP_Digest').build();

      assert(isPrivateVC(vc1), '');
      assert(isPrivateVC(vc2), '');

      expect(vp).toMatchObject({
        '@context': DEFAULT_CONTEXT,
        version: DEFAULT_VP_VERSION,
        type: ['VP_Digest', 'VP_Digest'],
        verifiableCredential: [
          {
            ...vc1,
            credentialSubject: calcRoothash(CONTENTS2, vc1.hasher[0], vc1.credentialSubjectNonceMap)
              .rootHash,
            credentialSubjectHashes: [],
            credentialSubjectNonceMap: {}
          },
          {
            ...vc2,
            credentialSubject: calcRoothash(CONTENTS2, vc2.hasher[0], vc2.credentialSubjectNonceMap)
              .rootHash,
            credentialSubjectHashes: [],
            credentialSubjectNonceMap: {}
          }
        ],
        id: vpID([vc1.digest, vc2.digest], vp.version, DEFAULT_VP_HASH_TYPE).hash,
        proof: {
          type: 'EcdsaSecp256k1SignatureEip191',
          proofPurpose: 'authentication'
        },
        hasher: [DEFAULT_VP_HASH_TYPE]
      });
    });

    it('create vp has multi ctype2 vc with VPType: VP_SelectiveDisclosure', async (): Promise<void> => {
      const vc1 = await VerifiableCredentialBuilder.fromRawCredential(
        rawCtype2.toRawCredential(),
        ctype2
      )
        .setExpirationDate(null)
        .build(issuer1);
      const vc2 = await VerifiableCredentialBuilder.fromRawCredential(
        rawCtype2.toRawCredential(),
        ctype2
      )
        .setExpirationDate(null)
        .build(issuer2);

      const vpBuilder = new VerifiablePresentationBuilder(holder);

      const vp = await vpBuilder
        .addVC(vc1, 'VP_SelectiveDisclosure', ['birthday'])
        .addVC(vc2, 'VP_SelectiveDisclosure', ['No'])
        .build();

      assert(isPrivateVC(vc1), '');
      assert(isPrivateVC(vc2), '');

      expect(vp).toMatchObject({
        '@context': DEFAULT_CONTEXT,
        version: DEFAULT_VP_VERSION,
        type: ['VP_SelectiveDisclosure', 'VP_SelectiveDisclosure'],
        verifiableCredential: [
          {
            ...vc1,
            credentialSubject: {
              birthday: CONTENTS2.birthday
            },
            credentialSubjectNonceMap: {
              [Object.keys(vc1.credentialSubjectNonceMap)[1]]: Object.values(
                vc1.credentialSubjectNonceMap
              )[1]
            }
          },
          {
            ...vc2,
            credentialSubject: {
              No: CONTENTS2.No
            },
            credentialSubjectNonceMap: {
              [Object.keys(vc2.credentialSubjectNonceMap)[0]]: Object.values(
                vc2.credentialSubjectNonceMap
              )[0]
            }
          }
        ],
        id: vpID([vc1.digest, vc2.digest], vp.version, DEFAULT_VP_HASH_TYPE).hash,
        proof: {
          type: 'EcdsaSecp256k1SignatureEip191',
          proofPurpose: 'authentication'
        },
        hasher: [DEFAULT_VP_HASH_TYPE]
      });
    });
  });

  describe('VerifiablePresentation multi vc by multi ctypes', (): void => {
    it('create vp has multi ctypes vc with multi VPType', async (): Promise<void> => {
      const vc1 = await VerifiableCredentialBuilder.fromRawCredential(
        rawCtype1.toRawCredential(),
        ctype1
      )
        .setExpirationDate(null)
        .build(issuer1);
      const vc2 = await VerifiableCredentialBuilder.fromRawCredential(
        rawCtype2.toRawCredential(),
        ctype2
      )
        .setExpirationDate(null)
        .build(issuer2);
      const vc3 = await VerifiableCredentialBuilder.fromRawCredential(
        rawCtype3.toRawCredential(),
        ctype3
      )
        .setExpirationDate(null)
        .build(issuer3);

      const vpBuilder = new VerifiablePresentationBuilder(holder);

      const vp = await vpBuilder
        .addVC(vc1, 'VP_Digest')
        .addVC(vc2, 'VP_SelectiveDisclosure', ['No'])
        .addVC(vc3, 'VP')
        .build();

      assert(isPrivateVC(vc1), '');
      assert(isPrivateVC(vc2), '');

      expect(vp).toMatchObject({
        '@context': DEFAULT_CONTEXT,
        version: DEFAULT_VP_VERSION,
        type: ['VP_Digest', 'VP_SelectiveDisclosure', 'VP'],
        verifiableCredential: [
          {
            ...vc1,
            credentialSubject: calcRoothash(CONTENTS1, vc1.hasher[0], vc1.credentialSubjectNonceMap)
              .rootHash,
            credentialSubjectHashes: [],
            credentialSubjectNonceMap: {}
          },
          {
            ...vc2,
            credentialSubject: {
              No: CONTENTS2.No
            },
            credentialSubjectNonceMap: {
              [Object.keys(vc2.credentialSubjectNonceMap)[0]]: Object.values(
                vc2.credentialSubjectNonceMap
              )[0]
            }
          },
          vc3
        ],
        id: vpID([vc1.digest, vc2.digest, vc3.digest], vp.version, DEFAULT_VP_HASH_TYPE).hash,
        proof: {
          type: 'EcdsaSecp256k1SignatureEip191',
          proofPurpose: 'authentication'
        },
        hasher: [DEFAULT_VP_HASH_TYPE]
      });
    });
  });
});

// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ethereumEncode } from '@zcloak/crypto';
import { DidDocument } from '@zcloak/did-resolver/types';
import { Keyring } from '@zcloak/keyring';

import { verifyDidDocumentProof } from '../verify';
import { createEcdsaFromMnemonic, keyFromMnemonic } from './helpers';

const DOCUMENT: DidDocument = {
  '@context': ['https://www.w3.org/ns/did/v1'],
  id: 'did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1',
  controller: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1'],
  verificationMethod: [
    {
      id: 'did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0',
      controller: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1'],
      type: 'EcdsaSecp256k1VerificationKey2019',
      publicKeyMultibase: 'zgfhtFiqxRR2vjtPbj4m8kiGkB2b1MUmbdFU167ByZbnU'
    },
    {
      id: 'did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-1',
      controller: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1'],
      type: 'X25519KeyAgreementKey2019',
      publicKeyMultibase: 'zFVD24HQZFfVpt1MVLRpYujPiBy2SXGRHz5LC8umAmoC1'
    }
  ],
  authentication: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0'],
  assertionMethod: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0'],
  keyAgreement: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-1'],
  capabilityInvocation: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0'],
  capabilityDelegation: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0'],
  service: []
};

describe('Did', (): void => {
  describe('create', (): void => {
    let keyring: Keyring;

    const controllerKey = new Uint8Array([
      2, 68, 184, 160, 24, 144, 34, 70, 58, 237, 53, 113, 14, 220, 94, 35, 175, 119, 18, 97, 44,
      234, 243, 237, 184, 253, 96, 196, 125, 196, 127, 56, 220
    ]);
    const key0 = new Uint8Array([
      2, 77, 98, 22, 148, 142, 221, 112, 110, 182, 7, 157, 44, 154, 76, 238, 157, 17, 80, 217, 29,
      247, 123, 130, 123, 173, 175, 83, 198, 110, 47, 17, 213
    ]);
    const key1 = new Uint8Array([
      215, 61, 119, 250, 103, 115, 177, 232, 142, 134, 133, 249, 55, 195, 191, 73, 167, 175, 188,
      41, 243, 75, 31, 239, 68, 226, 17, 65, 245, 245, 74, 102
    ]);

    beforeEach((): void => {
      keyring = new Keyring();
    });

    it('create ecdsa did from mnemonic', (): void => {
      const mnemonic =
        'health correct setup usage father decorate curious copper sorry recycle skin equal';
      const did = createEcdsaFromMnemonic(mnemonic, keyring);

      expect(did.get([...(did.authentication ?? [])][0]).publicKey).toEqual(key0);
      expect(did.get([...(did.keyAgreement ?? [])][0]).publicKey).toEqual(key1);
      expect([...did.controller][0]).toEqual(`did:zk:${ethereumEncode(controllerKey)}`);
      console.log(JSON.stringify(did.getDocument()));
    });
  });

  describe('did details', (): void => {
    it('create ecdsa did from mnemonic and get document', (): void => {
      const mnemonic =
        'health correct setup usage father decorate curious copper sorry recycle skin equal';
      const did = createEcdsaFromMnemonic(mnemonic);

      const document = did.getDocument();

      expect(document.id).toEqual(DOCUMENT.id);
      expect(document.controller).toEqual(DOCUMENT.controller);
      expect(document.verificationMethod).toEqual(DOCUMENT.verificationMethod);
      expect(document.authentication).toEqual(DOCUMENT.authentication);
      expect(document.assertionMethod).toEqual(DOCUMENT.assertionMethod);
      expect(document.keyAgreement).toEqual(DOCUMENT.keyAgreement);
      expect(document.capabilityInvocation).toEqual(DOCUMENT.capabilityInvocation);
      expect(document.capabilityDelegation).toEqual(DOCUMENT.capabilityDelegation);
      expect(document.service).toEqual(DOCUMENT.service);
    });
  });

  describe('did chain', (): void => {
    it('create ecdsa did from mnemonic and getPublish and verify', (): void => {
      const mnemonic =
        'health correct setup usage father decorate curious copper sorry recycle skin equal';
      const did = createEcdsaFromMnemonic(mnemonic);

      const document = did.getPublish('did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0');

      expect(verifyDidDocumentProof(document)).toBe(true);
    });
  });
});

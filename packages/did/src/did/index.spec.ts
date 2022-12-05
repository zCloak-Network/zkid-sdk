// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { stringToU8a } from '@polkadot/util';

import { ethereumEncode, initCrypto, mnemonicGenerate } from '@zcloak/crypto';
import { MockDidResolver } from '@zcloak/did-resolver';
import { DidDocument } from '@zcloak/did-resolver/types';
import { Keyring } from '@zcloak/keyring';

import { createEcdsaFromMnemonic } from './helpers';

const DOCUMENT: DidDocument = {
  '@context': ['https://www.w3.org/ns/did/v1'],
  id: 'did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1',
  controller: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1'],
  verificationMethod: [
    {
      id: 'did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0',
      controller: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1'],
      type: 'EcdsaSecp256k1VerificationKey2019',
      publicKeyMultibase: 'zdpxuL2ps42J5jVMJU9DpsMpwnJGsDkTS1N64JC3CbChq'
    },
    {
      id: 'did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-1',
      controller: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1'],
      type: 'X25519KeyAgreementKey2019',
      publicKeyMultibase: 'z9kQXjRwuVoQXKKmotXrkwxMQRhXEQX39A8XfWmZTgb4'
    }
  ],
  authentication: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0'],
  assertionMethod: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0'],
  keyAgreement: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-1'],
  capabilityInvocation: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0'],
  capabilityDelegation: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0'],
  service: []
};

const resolver = new MockDidResolver();

describe('Did', (): void => {
  beforeAll(async () => {
    await initCrypto();
    resolver.addDocument(DOCUMENT);
  });

  describe('create', (): void => {
    let keyring: Keyring;

    const controllerKey = new Uint8Array([
      2, 68, 184, 160, 24, 144, 34, 70, 58, 237, 53, 113, 14, 220, 94, 35, 175, 119, 18, 97, 44,
      234, 243, 237, 184, 253, 96, 196, 125, 196, 127, 56, 220
    ]);
    const key0 = new Uint8Array([
      2, 35, 46, 60, 119, 231, 40, 153, 127, 254, 189, 73, 215, 29, 11, 112, 172, 81, 51, 159, 187,
      229, 95, 166, 84, 171, 103, 65, 20, 251, 242, 238, 76
    ]);
    const key1 = new Uint8Array([
      2, 61, 185, 182, 103, 137, 1, 30, 95, 138, 105, 135, 188, 241, 237, 18, 250, 107, 205, 251,
      192, 33, 128, 145, 213, 119, 16, 125, 214, 227, 70, 3
    ]);

    beforeEach((): void => {
      keyring = new Keyring();
    });

    it('create ecdsa did from mnemonic', (): void => {
      const mnemonic =
        'health correct setup usage father decorate curious copper sorry recycle skin equal';
      const did = createEcdsaFromMnemonic(mnemonic, keyring);

      resolver.addDocument(did.getDocument());

      expect(did.get([...(did.authentication ?? [])][0]).publicKey).toEqual(key0);
      expect(did.get([...(did.keyAgreement ?? [])][0]).publicKey).toEqual(key1);
      expect([...did.controller][0]).toEqual(`did:zk:${ethereumEncode(controllerKey)}`);
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

  describe('encrypt and decrypt', (): void => {
    it('encrypt and decrypt', async (): Promise<void> => {
      const sender = createEcdsaFromMnemonic(mnemonicGenerate(12));
      const receiver = createEcdsaFromMnemonic(mnemonicGenerate(12));

      resolver.addDocument(sender.getDocument());
      resolver.addDocument(receiver.getDocument());

      const message = stringToU8a('abcd');

      const {
        data: encrypted,
        receiverUrl,
        senderUrl
      } = await sender.encrypt(
        message,
        receiver.getKeyUrl('keyAgreement'),
        sender.getKeyUrl('keyAgreement'),
        resolver
      );

      const decrypted = await receiver.decrypt(encrypted, senderUrl, receiverUrl, resolver);

      expect(decrypted).toEqual(message);
    });
  });
});

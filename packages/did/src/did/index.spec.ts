// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { stringToU8a } from '@polkadot/util';
import { alice, bob, DOCUMENTS, testResolver } from 'test-support';

import {
  decodeMultibase,
  eip712,
  ethereumEncode,
  initCrypto,
  keccak256AsU8a,
  secp256k1Verify
} from '@zcloak/crypto';
import { TypedData } from '@zcloak/crypto/eip712/types';
import { Keyring } from '@zcloak/keyring';

import { getPublishDocumentTypedData } from '../utils';
import { createEcdsaFromMnemonic } from './helpers';

describe('Did', (): void => {
  beforeAll(async () => {
    await initCrypto();
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

      expect(document.id).toEqual(DOCUMENTS.alice.id);
      expect(document.controller).toEqual(DOCUMENTS.alice.controller);
      expect(document.verificationMethod).toEqual(DOCUMENTS.alice.verificationMethod);
      expect(document.authentication).toEqual(DOCUMENTS.alice.authentication);
      expect(document.assertionMethod).toEqual(DOCUMENTS.alice.assertionMethod);
      expect(document.keyAgreement).toEqual(DOCUMENTS.alice.keyAgreement);
      expect(document.capabilityInvocation).toEqual(DOCUMENTS.alice.capabilityInvocation);
      expect(document.capabilityDelegation).toEqual(DOCUMENTS.alice.capabilityDelegation);
      expect(document.service).toEqual(DOCUMENTS.alice.service);
    });
  });

  describe('did.sign', (): void => {
    it('sign a uint8array', async (): Promise<void> => {
      const message = stringToU8a('abcd');

      const signature1 = await bob.signWithKey(message, 'authentication');
      const signature2 = await bob.signWithKey(message, 'assertionMethod');
      const signature3 = await bob.signWithKey(message, 'capabilityDelegation');
      const signature4 = await bob.signWithKey(message, 'capabilityInvocation');

      expect(
        secp256k1Verify(
          keccak256AsU8a(message),
          signature1.signature,
          bob.get(bob.getKeyUrl('authentication')).publicKey
        )
      ).toBe(true);
      expect(
        secp256k1Verify(
          keccak256AsU8a(message),
          signature2.signature,
          bob.get(bob.getKeyUrl('assertionMethod')).publicKey
        )
      ).toBe(true);
      expect(
        secp256k1Verify(
          keccak256AsU8a(message),
          signature3.signature,
          bob.get(bob.getKeyUrl('capabilityDelegation')).publicKey
        )
      ).toBe(true);
      expect(
        secp256k1Verify(
          keccak256AsU8a(message),
          signature4.signature,
          bob.get(bob.getKeyUrl('capabilityInvocation')).publicKey
        )
      ).toBe(true);
    });

    it('sign a TypedData', async (): Promise<void> => {
      const typedData: TypedData = {
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' }
          ],
          Test: [{ name: 'test', type: 'bytes' }]
        },
        primaryType: 'Test',
        domain: {
          name: 'Test',
          version: '0'
        },
        message: {
          test: '0x1234'
        }
      };

      const signature1 = await alice.signWithKey(typedData, 'authentication');
      const signature2 = await alice.signWithKey(typedData, 'assertionMethod');
      const signature3 = await alice.signWithKey(typedData, 'capabilityDelegation');
      const signature4 = await alice.signWithKey(typedData, 'capabilityInvocation');

      expect(
        secp256k1Verify(
          eip712.getMessage(typedData, true),
          signature1.signature,
          alice.get(alice.getKeyUrl('authentication')).publicKey
        )
      ).toBe(true);
      expect(
        secp256k1Verify(
          eip712.getMessage(typedData, true),
          signature2.signature,
          alice.get(alice.getKeyUrl('assertionMethod')).publicKey
        )
      ).toBe(true);
      expect(
        secp256k1Verify(
          eip712.getMessage(typedData, true),
          signature3.signature,
          alice.get(alice.getKeyUrl('capabilityDelegation')).publicKey
        )
      ).toBe(true);
      expect(
        secp256k1Verify(
          eip712.getMessage(typedData, true),
          signature4.signature,
          alice.get(alice.getKeyUrl('capabilityInvocation')).publicKey
        )
      ).toBe(true);
    });
  });

  describe('encrypt and decrypt', (): void => {
    it('encrypt and decrypt', async (): Promise<void> => {
      const message = stringToU8a('abcd');

      const {
        data: encrypted,
        receiverUrl,
        senderUrl
      } = await alice.encrypt(
        message,
        bob.getKeyUrl('keyAgreement'),
        alice.getKeyUrl('keyAgreement'),
        testResolver
      );

      const decrypted = await bob.decrypt(encrypted, senderUrl, receiverUrl, testResolver);

      expect(decrypted).toEqual(message);
    });
  });

  describe('did.getPublish', (): void => {
    it('getPublish verify', async (): Promise<void> => {
      const document = await alice.getPublish();

      expect(document.proof[0].signatureType).toBe('EcdsaSecp256k1SignatureEip712');

      console.log(decodeMultibase(document.proof[0].signature));
      expect(
        secp256k1Verify(
          eip712.getMessage(getPublishDocumentTypedData(document), true),
          decodeMultibase(document.proof[0].signature),
          alice.get(alice.getKeyUrl('capabilityInvocation')).publicKey
        )
      ).toBe(true);
    });
  });
});

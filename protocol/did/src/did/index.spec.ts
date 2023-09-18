// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { stringToU8a } from '@polkadot/util';
// import { ethers } from 'ethers';
import { alice, bob, DOCUMENTS, testResolver } from 'test-support';

import { decodeMultibase, eip191HashMessage, ethereumEncode, initCrypto, secp256k1Verify } from '@zcloak/crypto';
import { Keyring } from '@zcloak/keyring';

import { hashDidDocument, signedDidDocumentMessage } from '../hasher';
import { fromMnemonic } from '../keys';
// import { keys } from '..';

describe('Did', (): void => {
  let keyring: Keyring;

  beforeAll(async () => {
    await initCrypto();
    keyring = new Keyring();
  });

  describe('create', (): void => {
    const controllerKey = new Uint8Array([
      2, 68, 184, 160, 24, 144, 34, 70, 58, 237, 53, 113, 14, 220, 94, 35, 175, 119, 18, 97, 44, 234, 243, 237, 184,
      253, 96, 196, 125, 196, 127, 56, 220
    ]);
    const key0 = new Uint8Array([
      2, 35, 46, 60, 119, 231, 40, 153, 127, 254, 189, 73, 215, 29, 11, 112, 172, 81, 51, 159, 187, 229, 95, 166, 84,
      171, 103, 65, 20, 251, 242, 238, 76
    ]);
    const key1 = new Uint8Array([
      2, 61, 185, 182, 103, 137, 1, 30, 95, 138, 105, 135, 188, 241, 237, 18, 250, 107, 205, 251, 192, 33, 128, 145,
      213, 119, 16, 125, 214, 227, 70, 3
    ]);

    it('create ecdsa did from mnemonic', (): void => {
      const mnemonic = 'health correct setup usage father decorate curious copper sorry recycle skin equal';
      const did = fromMnemonic(keyring, mnemonic);

      expect(did.get([...(did.authentication ?? [])][0]).publicKey).toEqual(key0);
      expect(did.get([...(did.keyAgreement ?? [])][0]).publicKey).toEqual(key1);
      expect([...did.controller][0]).toEqual(`did:zk:${ethereumEncode(controllerKey)}`);
    });
  });

  describe('did details', (): void => {
    it('create ecdsa did from mnemonic and get document', (): void => {
      const mnemonic = 'health correct setup usage father decorate curious copper sorry recycle skin equal';
      const did = fromMnemonic(keyring, mnemonic);

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
          eip191HashMessage(message),
          signature1.signature,
          bob.get(bob.getKeyUrl('authentication')).publicKey
        )
      ).toBe(true);
      expect(
        secp256k1Verify(
          eip191HashMessage(message),
          signature2.signature,
          bob.get(bob.getKeyUrl('assertionMethod')).publicKey
        )
      ).toBe(true);
      expect(
        secp256k1Verify(
          eip191HashMessage(message),
          signature3.signature,
          bob.get(bob.getKeyUrl('capabilityDelegation')).publicKey
        )
      ).toBe(true);
      expect(
        secp256k1Verify(
          eip191HashMessage(message),
          signature4.signature,
          bob.get(bob.getKeyUrl('capabilityInvocation')).publicKey
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
      } = await alice.encrypt(message, bob.getKeyUrl('keyAgreement'), alice.getKeyUrl('keyAgreement'), testResolver);

      const decrypted = await bob.decrypt(encrypted, senderUrl, receiverUrl, testResolver);

      expect(decrypted).toEqual(message);
    });
  });

  describe('did.getPublish', (): void => {
    it('getPublish verify', async (): Promise<void> => {
      const document = await alice.getPublish();

      expect(document.proof[0].signatureType).toBe('EcdsaSecp256k1SignatureEip191');

      expect(
        secp256k1Verify(
          eip191HashMessage(signedDidDocumentMessage(hashDidDocument(document), document.version || '0')),
          decodeMultibase(document.proof[0].signature),
          alice.get(alice.getKeyUrl('controller')).publicKey
        )
      ).toBe(true);
    });
  });

  // describe('sendTransaction demo', (): void => {
  //   it('send ETH', async (): Promise<void> => {
  //     // replace this with your acount mnemonic
  //     const mnemonic = '';

  //     const keyring = new Keyring();
  //     // the account to send tx(sign and send)
  //     const attester = keys.fromMnemonic(keyring, mnemonic, 'ecdsa');
  //     const recipient = {
  //       address: '0xf4334f7A39B2b789e1c10f5BD081CB52fa9d45c6'
  //     };
  //     const providerUrl = 'https://endpoints.omniatech.io/v1/eth/goerli/public';
  //     const provider = new ethers.JsonRpcProvider(providerUrl);
  //     const gaslimit = 21000;
  //     const tx = {
  //       to: recipient.address,
  //       value: ethers.parseEther('0.00001'),
  //       nonce: await provider.getTransactionCount(attester.identifier),
  //       gasLimit: '0x' + gaslimit.toString(16),
  //       gasPrice: (await provider.getFeeData()).gasPrice,
  //       data: '0x',
  //       chainId: 5
  //     };
  //     const txHash = await attester.sendTransaction(tx as any, providerUrl);
  //   });

  //   it('call contract', async (): Promise<void> => {
  //     // replace this with your acount mnemonic
  //     const mnemonic = '';

  //     const keyring = new Keyring();
  //     // the account to send tx(sign and send)
  //     const attester = keys.fromMnemonic(keyring, mnemonic, 'ecdsa');

  //     const providerUrl = 'https://endpoints.omniatech.io/v1/eth/goerli/public';
  //     const provider = new ethers.JsonRpcProvider(providerUrl);
  //     const gaslimit = 210000;

  //     const contractABI = ['function add() public'];
  //     const contractAddress = '0x13Ce1AF66D2314BAD518B63D811b950bd6CDb358';
  //     const contractInterface = new ethers.Interface(contractABI);

  //     const data = contractInterface.encodeFunctionData('function add() public', []);

  //     const unsignedTx = {
  //       to: contractAddress,
  //       value: 0,
  //       nonce: await provider.getTransactionCount(attester.identifier),
  //       gasLimit: '0x' + gaslimit.toString(16),
  //       gasPrice: (await provider.getFeeData()).gasPrice,
  //       data,
  //       chainId: 5
  //     };
  //     const txHash = await attester.sendTransaction(unsignedTx as any, providerUrl);
  //   });
  // });
});

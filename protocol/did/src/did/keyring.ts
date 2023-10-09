// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidResolver } from '@zcloak/did-resolver';
import type { DidUrl } from '@zcloak/did-resolver/types';
import type { KeyringInstance, KeyringPair } from '@zcloak/keyring/types';
import type { DidKeys, EncryptedData, IDidKeyring, SignedData } from '../types';

import { serialize, UnsignedTransaction } from '@ethersproject/transactions';
import { assert, hexToU8a, u8aToHex } from '@polkadot/util';
import { ethers } from 'ethers';

import { eip191HashMessage } from '@zcloak/crypto';
import { defaultResolver } from '@zcloak/did-resolver/defaults';

import { isDidUrl } from '../utils';
import { DidDetails } from './details';
import { fromDid } from './helpers';

export abstract class DidKeyring extends DidDetails implements IDidKeyring {
  #keyring: KeyringInstance | null = null;

  private _getPair(publicKey: Uint8Array | HexString): KeyringPair {
    assert(this.#keyring, 'Need to init before call method');

    return this.#keyring.getPair(publicKey);
  }

  public init(keyring: KeyringInstance) {
    this.#keyring = keyring;
  }

  /**
   * DEPRECATED
   * @since `@zcloak/did@1.0.0`
   */
  public sign(): Promise<SignedData> {
    console.warn('sign method deprecated in 1.0.0');

    throw new Error('sign method deprecated in 1.0.0');
  }

  public async encrypt(
    message: Uint8Array | HexString,
    receiverUrlIn: DidUrl,
    senderUrl: DidUrl = this.getKeyUrl('keyAgreement'),
    resolver: DidResolver = defaultResolver
  ): Promise<EncryptedData> {
    const { id, publicKey } = this.get(senderUrl);
    const pair = this._getPair(publicKey);

    const receiver = await fromDid(receiverUrlIn, undefined, resolver);

    const { id: receiverUrl, publicKey: receiverPublicKey } = receiver.get(receiverUrlIn);

    const encrypted = pair.encrypt(message, receiverPublicKey);

    return {
      senderUrl: id,
      receiverUrl,
      type: 'X25519KeyAgreementKey2019',
      data: encrypted
    };
  }

  public async decrypt(
    encryptedMessageWithNonce: Uint8Array | HexString,
    senderUrlIn: DidUrl,
    receiverUrl: DidUrl,
    resolver: DidResolver = defaultResolver
  ): Promise<Uint8Array> {
    const { publicKey } = this.get(receiverUrl);
    const pair = this._getPair(publicKey);

    const sender = await fromDid(senderUrlIn, undefined, resolver);

    const { publicKey: senderPublicKey } = sender.get(senderUrlIn);

    const decrypted = pair.decrypt(encryptedMessageWithNonce, senderPublicKey);

    return decrypted;
  }

  public async sendTransaction(
    tx: UnsignedTransaction,
    providerUrl: string,
    keyOrDidUrl: DidUrl | Exclude<DidKeys, 'keyAgreement'> = 'controller'
  ): Promise<any> {
    // create rpc provider
    const rpcProvider = new ethers.JsonRpcProvider(providerUrl);

    // sign the unsignedTx
    const toSign = ethers.keccak256(serialize(tx));

    const signatureU8a = (await this._signTxWithKey(hexToU8a(toSign), keyOrDidUrl)).signature;
    const signedTxHex = serialize(tx, u8aToHex(signatureU8a));

    // send the signedTx
    const txResponse = await rpcProvider.send('eth_sendRawTransaction', [signedTxHex]);

    // return the TxHash
    return txResponse;
  }

  private async _signTxWithKey(
    message: Uint8Array | HexString,
    keyOrDidUrl: DidUrl | Exclude<DidKeys, 'keyAgreement'> = 'controller'
  ): Promise<SignedData> {
    const didUrl = isDidUrl(keyOrDidUrl) ? keyOrDidUrl : this.getKeyUrl(keyOrDidUrl);
    const { type } = this.get(didUrl);

    assert(
      type !== 'X25519KeyAgreementKey2019',
      "sign method only call with key type: 'EcdsaSecp256k1VerificationKey2019', 'Ed25519VerificationKey2020'"
    );

    const { id, signature } = await this._sign(message, didUrl);

    return {
      id,
      signature,
      type: type === 'EcdsaSecp256k1VerificationKey2019' ? 'EcdsaSecp256k1SignatureEip191' : 'Ed25519Signature2018'
    };
  }

  public async signWithKey(
    message: Uint8Array | HexString,
    keyOrDidUrl: DidUrl | Exclude<DidKeys, 'keyAgreement'> = 'controller'
  ): Promise<SignedData> {
    const didUrl = isDidUrl(keyOrDidUrl) ? keyOrDidUrl : this.getKeyUrl(keyOrDidUrl);
    const { type } = this.get(didUrl);

    assert(
      type !== 'X25519KeyAgreementKey2019',
      "sign method only call with key type: 'EcdsaSecp256k1VerificationKey2019', 'Ed25519VerificationKey2020'"
    );

    if (type === 'EcdsaSecp256k1VerificationKey2019') {
      message = eip191HashMessage(message);
    }

    const { id, signature } = await this._sign(message, didUrl);

    return {
      id,
      signature,
      type: type === 'EcdsaSecp256k1VerificationKey2019' ? 'EcdsaSecp256k1SignatureEip191' : 'Ed25519Signature2018'
    };
  }

  private _sign(message: Uint8Array | HexString, id: DidUrl): Promise<{ signature: Uint8Array; id: DidUrl }> {
    const { id: _id, publicKey } = this.get(id);

    const pair = this._getPair(publicKey);

    const signature = pair.sign(message);

    return Promise.resolve({
      signature,
      id: _id
    });
  }

  public batchSignWithKey(
    messages: (Uint8Array | HexString)[] | Uint8Array[] | HexString[],
    keyOrDidUrl: DidUrl | Exclude<DidKeys, 'keyAgreement'> = 'controller'
  ): Promise<SignedData[]> {
    const pendingMessages = messages.map((message) => this.signWithKey(message, keyOrDidUrl));

    return Promise.all(pendingMessages);
  }

  public batchEncrypt(
    params: {
      receiver: DidUrl;
      message: HexString;
    }[],
    senderUrl: DidUrl = this.getKeyUrl('keyAgreement'),
    resolver: DidResolver = defaultResolver
  ): Promise<EncryptedData[]> {
    const encrypts = params.map(({ message, receiver }) => this.encrypt(message, receiver, senderUrl, resolver));

    return Promise.all(encrypts);
  }
}

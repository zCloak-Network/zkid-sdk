// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidResolver } from '@zcloak/did-resolver';
import type { DidUrl } from '@zcloak/did-resolver/types';
import type { KeyringInstance, KeyringPair } from '@zcloak/keyring/types';
import type { DidKeys, EncryptedData, IDidKeyring, SignedData } from '../types';

import { assert, isHex, isU8a } from '@polkadot/util';

import { eip712, keccak256AsU8a } from '@zcloak/crypto';
import { TypedData } from '@zcloak/crypto/eip712/types';
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

  public async signWithKey(
    message: Uint8Array | HexString | TypedData,
    keyOrDidUrl: DidUrl | Exclude<DidKeys, 'keyAgreement'>
  ): Promise<SignedData> {
    const didUrl = isDidUrl(keyOrDidUrl) ? keyOrDidUrl : this.getKeyUrl(keyOrDidUrl);
    const { type } = this.get(didUrl);

    assert(
      type !== 'X25519KeyAgreementKey2019',
      "sign method only call with key type: 'EcdsaSecp256k1VerificationKey2019', 'Ed25519VerificationKey2020'"
    );

    if (isU8a(message) || isHex(message)) {
      if (type === 'EcdsaSecp256k1VerificationKey2019') {
        console.warn(
          `Using ${type} to sign signature is not a safe way, and it will be deprecat in a future version`
        );
        message = keccak256AsU8a(message);
      }

      const { id, signature } = await this._sign(message, didUrl);

      return {
        id,
        signature,
        type:
          type === 'EcdsaSecp256k1VerificationKey2019'
            ? 'EcdsaSecp256k1Signature2019'
            : 'Ed25519Signature2018'
      };
    }

    // sign data use eip-712 when the key type is `EcdsaSecp256k1VerificationKey2019`
    assert(
      type === 'EcdsaSecp256k1VerificationKey2019',
      `this method call only [EcdsaSecp256k1VerificationKey2019] with message: ${message}`
    );

    return this.signTypedData(message, didUrl);
  }

  public async signTypedData(typedData: TypedData, didUrl: DidUrl): Promise<SignedData> {
    const message = eip712.getMessage(typedData, true);

    const { id, signature } = await this._sign(message, didUrl);

    return {
      id,
      signature,
      type: 'EcdsaSecp256k1SignatureEip712'
    };
  }

  private _sign(
    message: Uint8Array | HexString,
    id: DidUrl
  ): Promise<{ signature: Uint8Array; id: DidUrl }> {
    const { id: _id, publicKey } = this.get(id);

    const pair = this._getPair(publicKey);

    const signature = pair.sign(message);

    return Promise.resolve({
      signature,
      id: _id
    });
  }
}

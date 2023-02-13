// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidResolver } from '@zcloak/did-resolver';
import type { DidUrl } from '@zcloak/did-resolver/types';
import type { KeyringInstance, KeyringPair } from '@zcloak/keyring/types';
import type { DidKeys, EncryptedData, IDidKeyring, SignedData } from '../types';

import { assert } from '@polkadot/util';

import { keccak256AsU8a } from '@zcloak/crypto';
import { defaultResolver } from '@zcloak/did-resolver/defaults';

import { typeTransform } from '../utils';
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

  public sign(message: Uint8Array | HexString, id: DidUrl): Promise<SignedData> {
    const { id: _id, publicKey } = this.get(id);
    const pair = this._getPair(publicKey);

    const signature = pair.sign(keccak256AsU8a(message));

    return Promise.resolve({
      signature,
      type: typeTransform(pair.type),
      id: _id
    });
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

  public signWithKey(
    message: Uint8Array | HexString,
    key: Exclude<DidKeys, 'keyAgreement'>
  ): Promise<SignedData> {
    const didUrl = this.getKeyUrl(key);

    return this.sign(message, didUrl);
  }
}

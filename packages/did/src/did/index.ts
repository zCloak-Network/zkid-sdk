// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidUrl, Service } from '@zcloak/did-resolver/types';
import type { EncryptedData, SignedData } from '../types';

import { u8aEq } from '@polkadot/util';

import { DidResolver } from '@zcloak/did-resolver';
import { defaultResolver } from '@zcloak/did-resolver/defaults';

import { hashDidDocument } from '../hasher';
import { DidChain } from './chain';
import { typeTransform } from './details';
import { fromDid } from './helpers';

/**
 * A class to use did keys and set document.
 *
 * @see helpers
 */
export class Did extends DidChain {
  public override sign(message: Uint8Array | HexString, id: DidUrl): SignedData {
    const { id: _id, publicKey } = this.get(id);
    const pair = this.getPair(publicKey);

    const signature = pair.sign(message);

    return {
      signature,
      type: typeTransform(this.getPair(publicKey).type),
      id: _id
    };
  }

  public override async encrypt(
    message: Uint8Array | HexString,
    receiverUrlIn: DidUrl,
    senderUrl: DidUrl = this.getKeyUrl('keyAgreement'),
    resolver: DidResolver = defaultResolver
  ): Promise<EncryptedData> {
    const { id, publicKey } = this.get(senderUrl);
    const pair = this.getPair(publicKey);

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

  public override async decrypt(
    encryptedMessageWithNonce: Uint8Array | HexString,
    senderUrlIn: DidUrl,
    receiverUrl: DidUrl,
    resolver: DidResolver = defaultResolver
  ): Promise<Uint8Array> {
    const { publicKey } = this.get(receiverUrl);
    const pair = this.getPair(publicKey);

    const sender = await fromDid(senderUrlIn, undefined, resolver);

    const { publicKey: senderPublicKey } = sender.get(senderUrlIn);

    const decrypted = pair.decrypt(encryptedMessageWithNonce, senderPublicKey);

    return decrypted;
  }

  public async isEqualOnChain(resolver: DidResolver = defaultResolver): Promise<boolean> {
    const onChainDocument = await resolver.resolve(this.id);

    const document = this.getDocument();

    return u8aEq(hashDidDocument(onChainDocument, false), hashDidDocument(document, false));
  }

  public addService(service: Service): void {
    if (!this.service) {
      this.service = new Map();
    }

    this.service.set(service.id, service);
  }
}

// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidResolver } from '@zcloak/did-resolver';
import type { DidUrl } from '@zcloak/did-resolver/types';
import type { KeyringInstance } from '@zcloak/keyring/types';
import type { DidKeys, EncryptedData, IDidKeyring, SignedData } from '../types';

import { assert } from '@polkadot/util';

export abstract class DidKeyring implements IDidKeyring {
  #keyring: KeyringInstance | null = null;

  public init(keyring: KeyringInstance) {
    this.#keyring = keyring;
  }

  public getPair(publicKey: Uint8Array) {
    assert(this.#keyring, 'Need to init before call method');

    return this.#keyring.getPair(publicKey);
  }

  public abstract signWithKey(
    message: Uint8Array | HexString,
    key: Exclude<DidKeys, 'keyAgreement'>
  ): SignedData;

  public abstract sign(message: Uint8Array | HexString, id: DidUrl): SignedData;

  public abstract encrypt(
    message: Uint8Array | HexString,
    receiverUrl: DidUrl,
    senderUrl?: DidUrl,
    resolver?: DidResolver
  ): Promise<EncryptedData>;

  public abstract decrypt(
    encryptedMessageWithNonce: Uint8Array | HexString,
    senderUrl: DidUrl,
    receiverUrl: DidUrl,
    resolver?: DidResolver
  ): Promise<Uint8Array>;
}

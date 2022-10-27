// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidUrl, Service } from '@zcloak/did-resolver/types';
import type { KeyringPair } from '@zcloak/keyring/types';

export interface KeyRelationship {
  id: DidUrl;
  controller: DidUrl[];
  publicKey: Uint8Array;
}

export interface IDidDetails {
  id: DidUrl;
  controller: Set<DidUrl>;
  keyRelationship: Map<DidUrl, KeyRelationship>;
  authentication?: Set<DidUrl>;
  assertionMethod?: Set<DidUrl>;
  keyAgreement?: Set<DidUrl>;
  capabilityInvocation?: Set<DidUrl>;
  capabilityDelegation?: Set<DidUrl>;
  service?: Map<string, Service>;
}

export interface IDidKeyring {
  getPair(publicKey: Uint8Array): KeyringPair;
  sign(publicKey: Uint8Array, message: HexString | Uint8Array): Uint8Array;
  encrypt(
    publicKey: Uint8Array,
    message: HexString | Uint8Array,
    recipientPublicKey: HexString | Uint8Array,
    nonce?: HexString | Uint8Array
  ): Uint8Array;
  decrypt(
    publicKey: Uint8Array,
    encryptedMessageWithNonce: HexString | Uint8Array,
    senderPublicKey: HexString | Uint8Array
  ): Uint8Array;
}

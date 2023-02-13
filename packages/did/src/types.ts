// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TypedData } from '@zcloak/crypto/eip712/types';
import type { HexString } from '@zcloak/crypto/types';
import type { DidResolver } from '@zcloak/did-resolver';
import type {
  DidUrl,
  Service,
  SignatureType,
  VerificationMethodType
} from '@zcloak/did-resolver/types';

export type DidKeys =
  | 'authentication'
  | 'keyAgreement'
  | 'assertionMethod'
  | 'capabilityInvocation'
  | 'capabilityDelegation';

export type SignedData = {
  id: DidUrl;
  type: SignatureType;
  signature: Uint8Array;
};

export type EncryptedData = {
  senderUrl: DidUrl;
  receiverUrl: DidUrl;
  type: VerificationMethodType;
  data: Uint8Array;
};

export interface KeyRelationship {
  id: DidUrl;
  controller: DidUrl[];
  publicKey: Uint8Array;
  type: VerificationMethodType;
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
  signWithKey(
    message: Uint8Array | HexString | TypedData,
    keyOrDidUrl: DidUrl | Exclude<DidKeys, 'keyAgreement'>
  ): Promise<SignedData>;
  /**
   * DEPRECATED
   * @since `@zcloak/did@1.0.0`
   */
  sign(message: Uint8Array | HexString, id: DidUrl): Promise<SignedData>;
  encrypt(
    message: HexString | Uint8Array,
    receiverUrl: DidUrl,
    senderUrl?: DidUrl,
    resolver?: DidResolver
  ): Promise<EncryptedData>;
  decrypt(
    encryptedMessageWithNonce: HexString | Uint8Array,
    senderUrl: DidUrl,
    receiverUrl: DidUrl,
    resolver?: DidResolver
  ): Promise<Uint8Array>;
}

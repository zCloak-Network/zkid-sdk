// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';

export type KeypairType = 'ecdsa' | 'ed25519' | 'x25519';
export type EncryptedJsonEncoding = 'none' | 'scrypt';
export type EncryptedJsonVersion = '1';

export interface KeyringPair$Json {
  encoded: string;
  encoding: {
    content: ['pkcs8', KeypairType];
    type: EncryptedJsonEncoding[];
    version: EncryptedJsonVersion;
  };
  publicKey: string;
}

export interface KeyringPair {
  readonly isLocked: boolean;
  readonly publicKey: Uint8Array;
  readonly type: KeypairType;

  lock(): void;
  sign(message: HexString | Uint8Array): Uint8Array;
  toJson(passphrase?: string): KeyringPair$Json;
  unlock(passphrase?: string): void;
  encrypt(
    message: HexString | Uint8Array,
    recipientPublicKey: HexString | Uint8Array,
    nonce?: HexString | Uint8Array
  ): Uint8Array;
  decrypt(encryptedMessageWithNonce: HexString | Uint8Array, senderPublicKey: HexString | Uint8Array): Uint8Array;
}

export interface KeyringPairs {
  add: (pair: KeyringPair) => KeyringPair;
  all: () => KeyringPair[];
  get: (publicKey: HexString | Uint8Array) => KeyringPair;
  remove: (publicKey: HexString | Uint8Array) => void;
}

export interface KeyringInstance {
  readonly pairs: KeyringPair[];
  readonly publicKeys: Uint8Array[];

  addPair(pair: KeyringPair): KeyringPair;
  addFromJson(pair: KeyringPair$Json): KeyringPair;
  addFromMnemonic(mnemonic: string, path?: string, type?: KeypairType): KeyringPair;
  addFromSeed(seed: HexString | Uint8Array, type?: KeypairType): KeyringPair;
  createFromJson(json: KeyringPair$Json): KeyringPair;
  createFromMnemonic(mnemonic: string, path?: string, type?: KeypairType): KeyringPair;
  createFromSeed(seed: HexString | Uint8Array, type?: KeypairType): KeyringPair;
  getPair(publicKey: HexString | Uint8Array): KeyringPair;
  getPairs(): KeyringPair[];
  getPublicKeys(): Uint8Array[];
  removePair(publicKey: HexString | Uint8Array): void;
  toJson(publicKey: HexString | Uint8Array, passphrase?: string): KeyringPair$Json;
}

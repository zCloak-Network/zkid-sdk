// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { KeypairType, KeyringPair, KeyringPair$Json } from '../types';

import { ed25519Sign, naclOpen, naclSeal, secp256k1Sign } from '@zcloak/crypto';
import { assert, u8aConcat, u8aEmpty, u8aToU8a } from '@polkadot/util';

import { decodePair } from './decode';
import { encodePair } from './encode';
import { pairToJson } from './toJson';

interface Options {
  type: KeypairType;
}

export interface PairInfo {
  secretKey?: Uint8Array;
  publicKey: Uint8Array;
}

const TYPE_SIGNATURE = {
  ecdsa: (message: Uint8Array, secretKey: Uint8Array) => secp256k1Sign(message, secretKey),
  ed25519: (message: Uint8Array, secretKey: Uint8Array) => ed25519Sign(message, secretKey)
};

function isLocked(secretKey?: Uint8Array): secretKey is undefined {
  return !secretKey || u8aEmpty(secretKey);
}

export function createPair(
  { publicKey, secretKey }: PairInfo,
  { type }: Options,
  encoded?: Uint8Array
): KeyringPair {
  const decodePkcs8 = (passphrase?: string): void => {
    const decoded = decodePair(encoded, passphrase);

    secretKey = decoded.secretKey;
    publicKey = decoded.publicKey;
  };

  const recode = (passphrase?: string): Uint8Array => {
    isLocked(secretKey) && encoded && decodePkcs8(passphrase);

    encoded = encodePair({ publicKey, secretKey }, passphrase); // re-encode

    return encoded;
  };

  class Pair implements KeyringPair {
    public get isLocked(): boolean {
      return isLocked(secretKey);
    }

    public get publicKey(): Uint8Array {
      return publicKey;
    }

    public get type(): KeypairType {
      return type;
    }

    public sign(message: HexString | Uint8Array): Uint8Array {
      if (isLocked(secretKey)) {
        throw new Error('Cannot sign with a locked key pair');
      }

      assert(['ecdsa', 'ed25519'].includes(type), 'only ecdsa and ed25519 support');

      return TYPE_SIGNATURE[type as 'ecdsa' | 'ed25519'](u8aToU8a(message), secretKey);
    }

    public lock(): void {
      secretKey = new Uint8Array();
    }

    toJson(passphrase?: string): KeyringPair$Json {
      return pairToJson(type, publicKey, recode(passphrase), !!passphrase);
    }

    unlock(passphrase?: string): void {
      return decodePkcs8(passphrase);
    }

    encrypt(
      message: HexString | Uint8Array,
      recipientPublicKey: HexString | Uint8Array,
      nonce?: HexString | Uint8Array
    ): Uint8Array {
      if (isLocked(secretKey)) {
        throw new Error('Cannot sign with a locked key pair');
      }

      assert(type === 'x25519', 'only x25519 support');

      const sealed = naclSeal(u8aToU8a(message), secretKey, u8aToU8a(recipientPublicKey), nonce);

      return u8aConcat(sealed.nonce, sealed.sealed);
    }

    decrypt(
      encryptedMessageWithNonce: HexString | Uint8Array,
      senderPublicKey: HexString | Uint8Array
    ): Uint8Array {
      if (isLocked(secretKey)) {
        throw new Error('Cannot sign with a locked key pair');
      }

      assert(type === 'x25519', 'only x25519 support');

      const messageU8a = u8aToU8a(encryptedMessageWithNonce);

      const decrypted = naclOpen(
        messageU8a.slice(24, messageU8a.length),
        messageU8a.slice(0, 24),
        u8aToU8a(senderPublicKey),
        secretKey
      );

      assert(decrypted, 'decrypt error');

      return decrypted;
    }
  }

  return new Pair();
}

import type { HexString } from '@zcloak/crypto/types';
import type { KeypairType, KeyringPair, KeyringPair$Json } from '../types';

import { assert, u8aConcat, u8aEmpty, u8aToU8a } from '@polkadot/util';

import { ed25519Sign, naclOpen, naclSeal, secp256k1Sign } from '@zcloak/crypto';

interface Options {
  type: KeypairType;
}

const TYPE_SIGNATURE = {
  ecdsa: (message: Uint8Array, secretKey: Uint8Array) => secp256k1Sign(message, secretKey),
  ed25519: (message: Uint8Array, secretKey: Uint8Array) => ed25519Sign(message, secretKey)
};

function isLocked(secretKey?: Uint8Array): secretKey is undefined {
  return !secretKey || u8aEmpty(secretKey);
}

export function createPair(
  keypair: { secretKey: Uint8Array; publicKey: Uint8Array },
  { type }: Options
): KeyringPair {
  let secretKey: Uint8Array = keypair.secretKey;
  const publicKey: Uint8Array = keypair.publicKey;

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

    public lock(): void {
      secretKey = new Uint8Array();
    }

    public sign(message: HexString | Uint8Array): Uint8Array {
      if (isLocked(secretKey)) {
        throw new Error('Cannot sign with a locked key pair');
      }

      assert(['ecdsa', 'ed25519'].includes(type), 'only ecdsa and ed25519 support');

      return TYPE_SIGNATURE[type as 'ecdsa' | 'ed25519'](u8aToU8a(message), secretKey);
    }

    toJson(passphrase?: string): KeyringPair$Json {
      throw new Error('Method not implemented.');
    }

    unlock(passphrase?: string): void {
      throw new Error('Method not implemented.');
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

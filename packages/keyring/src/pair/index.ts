import type { KeypairType, KeyringPair, KeyringPair$Json } from '../types';

import { u8aEmpty } from '@polkadot/util';

interface Options {
  type: KeypairType;
}

function isLocked(secretKey?: Uint8Array): secretKey is undefined {
  return !secretKey || u8aEmpty(secretKey);
}

export function createPair(seed: Uint8Array, { type }: Options): KeyringPair {
  const secretKey: Uint8Array = seed;

  class Pair implements KeyringPair {
    isLocked: boolean;
    publicKey: Uint8Array;
    type: KeypairType;
    lock(): void {
      throw new Error('Method not implemented.');
    }

    sign(message: string | Uint8Array): Uint8Array {
      throw new Error('Method not implemented.');
    }

    toJson(passphrase?: string | undefined): KeyringPair$Json {
      throw new Error('Method not implemented.');
    }

    unlock(passphrase?: string | undefined): void {
      throw new Error('Method not implemented.');
    }

    encrypt(
      message: string | Uint8Array,
      recipientPublicKey: string | Uint8Array,
      nonce?: Uint8Array | undefined
    ): Uint8Array {
      throw new Error('Method not implemented.');
    }

    decrypt(
      encryptedMessageWithNonce: string | Uint8Array,
      senderPublicKey: string | Uint8Array
    ): Uint8Array | null {
      throw new Error('Method not implemented.');
    }
  }
}

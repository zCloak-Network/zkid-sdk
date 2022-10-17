import type { KeypairType, KeyringInstance, KeyringPair, KeyringPair$Json } from './types';

export class Keyring implements KeyringInstance {
  public pairs: KeyringPair[] = [];
  public publicKeys: Uint8Array[] = [];

  addPair(pair: KeyringPair): KeyringPair {
    throw new Error('Method not implemented.');
  }

  addFromJson(pair: KeyringPair$Json): KeyringPair {
    throw new Error('Method not implemented.');
  }

  addFromMnemonic(mnemonic: string, type?: KeypairType | undefined): KeyringPair {
    throw new Error('Method not implemented.');
  }

  addFromSeed(seed: Uint8Array, type?: KeypairType | undefined): KeyringPair {
    throw new Error('Method not implemented.');
  }

  createFromJson(json: KeyringPair$Json, ignoreChecksum?: boolean | undefined): KeyringPair {
    throw new Error('Method not implemented.');
  }

  getPair(publicKey: Uint8Array | `0x${string}`): KeyringPair {
    throw new Error('Method not implemented.');
  }

  getPairs(): KeyringPair[] {
    throw new Error('Method not implemented.');
  }

  getPublicKeys(): Uint8Array[] {
    throw new Error('Method not implemented.');
  }

  removePair(publicKey: Uint8Array | `0x${string}`): void {
    throw new Error('Method not implemented.');
  }

  toJson(publicKey: Uint8Array | `0x${string}`, passphrase?: string | undefined): KeyringPair$Json {
    throw new Error('Method not implemented.');
  }
}

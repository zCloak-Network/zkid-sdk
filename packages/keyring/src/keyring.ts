import type {
  HexString,
  KeypairType,
  KeyringInstance,
  KeyringPair,
  KeyringPair$Json
} from './types';

import { Pairs } from './pairs';

export class Keyring implements KeyringInstance {
  readonly #pairs: Pairs;

  constructor() {
    this.#pairs = new Pairs();
  }

  public get pairs(): KeyringPair[] {
    return this.getPairs();
  }

  public get publicKeys(): Uint8Array[] {
    return this.getPublicKeys();
  }

  public addPair(pair: KeyringPair): KeyringPair {
    return this.#pairs.add(pair);
  }

  public addFromJson(json: KeyringPair$Json): KeyringPair {
    return this.addPair(this.createFromJson(json));
  }

  public addFromMnemonic(mnemonic: string, type?: KeypairType): KeyringPair {
    return this.addPair(this.createFromMnemonic(mnemonic, type));
  }

  public addFromSeed(seed: Uint8Array, type?: KeypairType): KeyringPair {
    return this.addPair(this.createFromSeed(seed, type));
  }

  public createFromJson(json: KeyringPair$Json): KeyringPair {
    throw new Error('Method not implemented.');
  }

  public createFromMnemonic(mnemonic: string, type?: KeypairType): KeyringPair {
    throw new Error('Method not implemented.');
  }

  public createFromSeed(seed: Uint8Array, type?: KeypairType): KeyringPair {
    throw new Error('Method not implemented.');
  }

  public getPair(publicKey: Uint8Array | HexString): KeyringPair {
    return this.#pairs.get(publicKey);
  }

  public getPairs(): KeyringPair[] {
    return this.#pairs.all();
  }

  public getPublicKeys(): Uint8Array[] {
    return this.#pairs.all().map(({ publicKey }) => publicKey);
  }

  public removePair(publicKey: Uint8Array | HexString): void {
    this.#pairs.remove(publicKey);
  }

  public toJson(publicKey: Uint8Array | HexString, passphrase?: string): KeyringPair$Json {
    return this.getPair(publicKey).toJson(passphrase);
  }
}

import type { HexString } from '@zcloak/crypto/types';
import type { KeypairType, KeyringInstance, KeyringPair, KeyringPair$Json } from './types';

import { u8aToU8a } from '@polkadot/util';

import {
  convertEd25519ToX25519,
  ed25519PairFromSeed,
  hdEthereum,
  keyExtractSuri,
  keyFromPath,
  mnemonicToLegacySeed,
  mnemonicToMiniSecret,
  secp256k1PairFromSeed,
  x25519PairFromSeed
} from '@zcloak/crypto';

import { createPair } from './pair';
import { Pairs } from './pairs';

const PairFromSeed = {
  ecdsa: secp256k1PairFromSeed,
  ed25519: ed25519PairFromSeed,
  x25519: x25519PairFromSeed
};

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

  /**
   * store pair, given as keyring pair, as a Key/Value (public key => pair) in Keyring Pair Dictionary
   * @returns instance of [[KeyringPair]]
   */
  public addPair(pair: KeyringPair): KeyringPair {
    return this.#pairs.add(pair);
  }

  /**
   * store pair, given as keyring pair, as a Key/Value (public key => pair) in Keyring Pair Dictionary
   * @returns instance of [[KeyringPair]]
   */
  public addFromJson(json: KeyringPair$Json): KeyringPair {
    return this.addPair(this.createFromJson(json));
  }

  /**
   * store pair, given as keyring pair, as a Key/Value (public key => pair) in Keyring Pair Dictionary
   * Allows user to provide a `mnemonic` argument, and then generates a keyring pair from it that it passes to
   * `addPair` to stores in a keyring pair dictionary the public key of the generated pair as a key and the pair as the associated value.
   * @returns instance of [[KeyringPair]]
   */
  public addFromMnemonic(mnemonic: string, path?: string, type?: KeypairType): KeyringPair {
    return this.addPair(this.createFromMnemonic(mnemonic, path, type));
  }

  /**
   * store pair, given as keyring pair, as a Key/Value (public key => pair) in Keyring Pair Dictionary
   * Allows user to provide the `seed` as an argument, and then generates a keyring pair from it that it passes to
   * `addPair` to store in a keyring pair dictionary the public key of the generated pair as a key and the pair as the associated value.
   * @returns instance of [[KeyringPair]]
   */
  public addFromSeed(seed: HexString | Uint8Array, type?: KeypairType): KeyringPair {
    return this.addPair(this.createFromSeed(seed, type));
  }

  /**
   * create pair from json file
   */
  public createFromJson(json: KeyringPair$Json): KeyringPair {
    throw new Error('Method not implemented.');
  }

  /**
   * create pair from mnemonic
   */
  public createFromMnemonic(
    mnemonic: string,
    pathIn?: string,
    type: KeypairType = 'ecdsa'
  ): KeyringPair {
    const suri =
      type === 'ecdsa'
        ? `${mnemonic}${pathIn ?? "/m/44'/60'/0'/0/0"}`
        : `${mnemonic}${pathIn ?? ''}`;
    const { derivePath, password, path, phrase } = keyExtractSuri(suri);

    const parts = phrase.split(' ');

    let seed: Uint8Array;

    if ([12, 15, 18, 21, 24].includes(parts.length)) {
      seed =
        type === 'ecdsa' ? mnemonicToLegacySeed(phrase) : mnemonicToMiniSecret(phrase, password);
    } else {
      throw new Error('');
    }

    const derived =
      type === 'ecdsa'
        ? hdEthereum(seed, derivePath.substring(1))
        : keyFromPath(PairFromSeed.ed25519(seed), path, 'ed25519');

    return createPair(type === 'x25519' ? convertEd25519ToX25519(derived) : derived, { type });
  }

  /**
   * create pair from seed
   */
  public createFromSeed(seed: HexString | Uint8Array, type: KeypairType = 'ecdsa'): KeyringPair {
    const keypair = PairFromSeed[type](u8aToU8a(seed));

    return createPair(keypair, { type });
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

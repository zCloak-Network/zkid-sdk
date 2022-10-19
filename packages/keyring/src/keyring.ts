import type {
  HexString,
  KeypairType,
  KeyringInstance,
  KeyringPair,
  KeyringPair$Json
} from './types';

import { bufferToU8a, u8aToHex } from '@polkadot/util';
import { derivePath } from 'ed25519-hd-key';
import { HDKey } from 'ethereum-cryptography/hdkey';

import { ed25519PairFromSecret, ed25519PairFromSeed } from './pair/ed25519';
import { x25519PairFromSecret } from './pair/nacl';
import { secp256k1PairFromSecret } from './pair/secp256k1';
import { mnemonicToSeed } from './mnemonic';
import { createPair } from './pair';
import { Pairs } from './pairs';

const PairFromSeed = {
  ecdsa: secp256k1PairFromSecret,
  ed25519: ed25519PairFromSeed,
  x25519: x25519PairFromSecret
};

const PairFromSecret = {
  ecdsa: secp256k1PairFromSecret,
  ed25519: ed25519PairFromSecret,
  x25519: x25519PairFromSecret
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
  public addFromMnemonic(
    mnemonic: string,
    path?: string,
    child?: number,
    type?: KeypairType
  ): KeyringPair {
    return this.addPair(this.createFromMnemonic(mnemonic, path, child, type));
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
   * store pair, given as keyring pair, as a Key/Value (public key => pair) in Keyring Pair Dictionary
   * Allows user to provide the `secretKey` as an argument, and then generates a keyring pair from it that it passes to
   * `addPair` to store in a keyring pair dictionary the public key of the generated pair as a key and the pair as the associated value.
   * @returns instance of [[KeyringPair]]
   */
  public addFromSecret(secretKey: HexString | Uint8Array, type?: KeypairType): KeyringPair {
    return this.addPair(this.createFromSecret(secretKey, type));
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
    path = "m/44'/60'/0'/0",
    child = 0,
    type: KeypairType = 'ecdsa'
  ): KeyringPair {
    const seed = mnemonicToSeed(mnemonic);

    if (type === 'ecdsa') {
      const hdkey = HDKey.fromMasterSeed(seed).derive(path).deriveChild(child);

      if (hdkey.privateKey && hdkey.publicKey) {
        return createPair({ secretKey: hdkey.privateKey, publicKey: hdkey.publicKey }, { type });
      } else {
        throw new Error('HD key derive error');
      }
    } else {
      const { key } = derivePath(path, u8aToHex(seed), child);
      const derivedSeed = bufferToU8a(key);

      return createPair(PairFromSeed[type](derivedSeed), { type });
    }
  }

  /**
   * create pair from seed
   */
  public createFromSeed(seed: HexString | Uint8Array, type: KeypairType = 'ecdsa'): KeyringPair {
    const keypair = PairFromSeed[type](seed);

    return createPair(keypair, { type });
  }

  /**
   * create pair from secretKey
   */
  public createFromSecret(
    secretKey: HexString | Uint8Array,
    type: KeypairType = 'ecdsa'
  ): KeyringPair {
    const keypair = PairFromSecret[type](secretKey);

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

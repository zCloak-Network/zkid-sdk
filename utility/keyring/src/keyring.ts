// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { KeypairType, KeyringInstance, KeyringPair, KeyringPair$Json } from './types';

import { u8aToU8a } from '@polkadot/util';

import {
  base64Decode,
  convertEd25519ToX25519,
  ed25519PairFromSeed,
  hdKeyFromSeed,
  mnemonicToLegacySeed,
  mnemonicToMiniSecret,
  mnemonicValidate,
  secp256k1PairFromSeed,
  x25519PairFromSeed
} from '@zcloak/crypto';
import { ed25519Derive } from '@zcloak/crypto/ed25519/ed25519DeriveHard';

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
  public createFromJson({ encoded, encoding: { content }, publicKey }: KeyringPair$Json): KeyringPair {
    const cryptoType = content[1];

    if (!['ed25519', 'x25519', 'ecdsa'].includes(cryptoType)) {
      throw new Error(`Unknown crypto type ${cryptoType}`);
    }

    return createPair({ publicKey: base64Decode(publicKey) }, { type: cryptoType }, base64Decode(encoded));
  }

  /**
   * create pair from mnemonic
   */
  public createFromMnemonic(mnemonic: string, pathIn?: string, type: KeypairType = 'ecdsa'): KeyringPair {
    if (type === 'ecdsa') {
      pathIn = pathIn ?? "/m/44'/60'/0'/0/0";
    } else {
      pathIn = pathIn ?? '';
    }

    const [, code, password = ''] = pathIn.split('//');

    let seed: Uint8Array;

    if (mnemonicValidate(mnemonic)) {
      seed =
        type === 'ecdsa'
          ? mnemonicToLegacySeed(mnemonic)
          : mnemonicToMiniSecret(mnemonic, password.startsWith('/') ? password.slice(1) : password);
    } else {
      throw new Error('not a valid mnemonic');
    }

    const derived =
      type === 'ecdsa'
        ? PairFromSeed.ecdsa(hdKeyFromSeed(seed, 'secp256k1', pathIn.slice(1)).seed)
        : PairFromSeed.ed25519(ed25519Derive(seed, code));

    return createPair(type === 'x25519' ? convertEd25519ToX25519(derived) : derived, { type });
  }

  /**
   * create pair from seed
   */
  public createFromSeed(seed: HexString | Uint8Array, type: KeypairType = 'ecdsa'): KeyringPair {
    const keypair = PairFromSeed[type](u8aToU8a(seed));

    return createPair(keypair, { type });
  }

  public getPair(publicKeyOrAddress: Uint8Array | HexString): KeyringPair {
    return this.#pairs.get(publicKeyOrAddress);
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

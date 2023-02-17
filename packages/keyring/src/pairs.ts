// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { KeyringPair, KeyringPairs } from './types';

import { isHex, u8aToHex } from '@polkadot/util';

type KeyringPairMap = Record<string, KeyringPair>;

export class Pairs implements KeyringPairs {
  readonly #map: KeyringPairMap = {};

  public add(pair: KeyringPair): KeyringPair {
    this.#map[u8aToHex(pair.publicKey)] = pair;

    return pair;
  }

  public all(): KeyringPair[] {
    return Object.values(this.#map);
  }

  public get(publicKey: HexString | Uint8Array): KeyringPair {
    const pair = this.#map[isHex(publicKey) ? publicKey : u8aToHex(publicKey)];

    if (!pair) {
      throw new Error(
        `Unable to retrieve keypair '${isHex(publicKey) ? publicKey : u8aToHex(publicKey)}'`
      );
    }

    return pair;
  }

  public remove(publicKey: HexString | Uint8Array): void {
    delete this.#map[isHex(publicKey) ? publicKey : u8aToHex(publicKey)];
  }
}

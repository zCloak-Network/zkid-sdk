// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { KeyringPair, KeyringPairs } from './types';

import { isHex, isU8a, u8aToHex } from '@polkadot/util';

import { ethereumEncode, isEthereumAddress } from '@zcloak/crypto';

type KeyringPairMap = Record<HexString, KeyringPair>;

type EthereumMapping = Record<HexString, HexString>;

export class Pairs implements KeyringPairs {
  readonly #map: KeyringPairMap = {};
  readonly #ethereumMapping: EthereumMapping = {};

  public add(pair: KeyringPair): KeyringPair {
    // save the ethereum address when `ecdsa` pair
    if (pair.type === 'ecdsa') {
      this.#ethereumMapping[ethereumEncode(pair.publicKey)] = u8aToHex(pair.publicKey);
    }

    this.#map[u8aToHex(pair.publicKey)] = pair;

    return pair;
  }

  public all(): KeyringPair[] {
    return Object.values(this.#map);
  }

  public get(publicKeyOrAddress: HexString | Uint8Array): KeyringPair {
    const publicKey = isU8a(publicKeyOrAddress)
      ? publicKeyOrAddress
      : isEthereumAddress(publicKeyOrAddress)
      ? this.#ethereumMapping[publicKeyOrAddress]
      : publicKeyOrAddress;

    const pair = this.#map[isHex(publicKey) ? publicKey : u8aToHex(publicKey)];

    if (!pair) {
      throw new Error(
        `Unable to retrieve keypair '${isHex(publicKeyOrAddress) ? publicKeyOrAddress : u8aToHex(publicKeyOrAddress)}'`
      );
    }

    return pair;
  }

  public remove(publicKey: HexString | Uint8Array): void {
    delete this.#map[isHex(publicKey) ? publicKey : u8aToHex(publicKey)];
  }
}

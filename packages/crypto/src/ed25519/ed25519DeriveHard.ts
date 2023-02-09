// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  BN,
  bnToU8a,
  compactAddLength,
  hexToU8a,
  isBigInt,
  isBn,
  isHex,
  isNumber,
  isString,
  stringToU8a,
  u8aConcat
} from '@polkadot/util';

import { blake2AsU8a } from '../blake2';

const BN_LE_256_OPTS = { bitLength: 256, isLe: true };

const HDKD = compactAddLength(stringToU8a('Ed25519HDKD'));

export function ed25519Derive(seed: Uint8Array, value?: string): Uint8Array {
  if (!value) return seed;

  const chainCode: Uint8Array = new Uint8Array(32);

  const code = /^\d+$/.test(value) ? new BN(value) : value;

  let codeU8a: Uint8Array;

  if (isNumber(code) || isBn(code) || isBigInt(code)) {
    codeU8a = bnToU8a(code, BN_LE_256_OPTS);
  } else if (isHex(code)) {
    codeU8a = hexToU8a(code);
  } else if (isString(code)) {
    codeU8a = compactAddLength(stringToU8a(code));
  } else {
    throw new Error(`Not parse ${code}`);
  }

  if (codeU8a.length > 32) {
    codeU8a = blake2AsU8a(codeU8a);
  }

  chainCode.set(codeU8a);

  return blake2AsU8a(u8aConcat(HDKD, seed, chainCode));
}

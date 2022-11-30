// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '../types';
import type { RlpInput } from './types';

import {
  hexStripPrefix,
  hexToU8a,
  isBigInt,
  isBoolean,
  isHex,
  isNumber,
  isString,
  stringToU8a,
  u8aConcat
} from '@polkadot/util';

/** Transform an integer into its hexadecimal value */
function numberToHex(integer: number | bigint): HexString {
  if (integer < 0) {
    throw new Error('Invalid integer as argument, must be unsigned!');
  }

  const hex = integer.toString(16);

  return hex.length % 2 ? `0x0${hex}` : `0x${hex}`;
}

export function rlpEncode(input: RlpInput | Array<RlpInput>): Uint8Array {
  if (Array.isArray(input)) {
    const output: Uint8Array[] = [];

    for (let i = 0; i < input.length; i++) {
      output.push(rlpEncode(input[i]));
    }

    const buf = u8aConcat(...output);

    return u8aConcat(encodeLength(buf.length, 192), buf);
  }

  const inputBuf = toBytes(input);

  if (inputBuf.length === 1 && inputBuf[0] < 128) {
    return inputBuf;
  }

  return u8aConcat(encodeLength(inputBuf.length, 128), inputBuf);
}

function encodeLength(len: number, offset: number): Uint8Array {
  if (len < 56) {
    return Uint8Array.from([len + offset]);
  }

  const hexLength = hexStripPrefix(numberToHex(len));
  const lLength = hexLength.length / 2;

  const firstByte = numberToHex(offset + 55 + lLength);

  return hexToU8a(firstByte + hexLength);
}

/** Transform anything into a Uint8Array */
function toBytes(v: RlpInput): Uint8Array {
  if (v instanceof Uint8Array) {
    return v;
  }

  if (isBoolean(v)) {
    v = Number(v);
  }

  if (isNumber(v)) {
    if (!v) {
      return Uint8Array.from([]);
    }

    return hexToU8a(numberToHex(Number(v)));
  }

  if (isBigInt(v)) {
    if (!v) {
      return Uint8Array.from([]);
    }

    return hexToU8a(numberToHex(v));
  }

  if (isHex(v)) {
    return hexToU8a(v);
  }

  if (isString(v)) {
    return stringToU8a(v);
  }

  if (v === null || v === undefined) {
    return Uint8Array.from([]);
  }

  throw new Error('toBytes: received unsupported type ' + typeof v);
}

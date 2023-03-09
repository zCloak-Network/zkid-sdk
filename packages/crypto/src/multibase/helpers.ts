// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '../types';

import { u8aToU8a } from '@polkadot/util';

interface Coder {
  decode: (value: string) => Uint8Array;
  encode: (value: Uint8Array) => string;
}

interface Config {
  chars: string;
  coder: Coder;
  prefix: string;
  type: string;
}
type DecodeFn = (value: string) => Uint8Array;

type EncodeFn = (value: Uint8Array | HexString) => string;

type ValidateFn = (value?: unknown) => value is string;

/** @internal */
export function createDecode({ coder }: Config, validate: ValidateFn): DecodeFn {
  return (value: string): Uint8Array => {
    validate(value);

    return coder.decode(value.substring(1));
  };
}

/** @internal */
export function createEncode({ coder, prefix }: Config): EncodeFn {
  return (value: Uint8Array | HexString): string => {
    const out = coder.encode(u8aToU8a(value));

    return `${prefix}${out}`;
  };
}

/** @internal */
export function createIs(validate: ValidateFn): ValidateFn {
  return (value?: unknown): value is string => {
    try {
      return validate(value);
    } catch (error) {
      return false;
    }
  };
}

/** @internal */
export function createValidate({ chars, prefix, type }: Config): ValidateFn {
  return (value?: unknown): value is string => {
    if (!value || typeof value !== 'string') {
      throw new Error(`Expected non-null, non-empty ${type} string input`);
    }

    if (value[0] !== prefix) {
      throw new Error(`Expected prefix-compatible ${type} to start with '${prefix}'`);
    }

    for (let i = 1; i < value.length; i++) {
      if (
        !(chars.includes(value[i]) || (value[i] === '=' && (i === value.length - 1 || !chars.includes(value[i + 1]))))
      ) {
        throw new Error(
          `Invalid ${type} character "${value[i]}" (0x${value.charCodeAt(i).toString(16)}) at index ${i}`
        );
      }
    }

    return true;
  };
}

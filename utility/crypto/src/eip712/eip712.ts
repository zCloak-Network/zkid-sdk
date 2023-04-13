// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Reference
// https://eips.ethereum.org/EIPS/eip-712
// https://eips.ethereum.org/assets/eip-712/Example.js

import type { TypedData } from './types';

import { hexToU8a, isU8a, u8aConcat, u8aToBuffer, u8aToU8a } from '@polkadot/util';
import abi from 'ethereumjs-abi';

import { keccak256AsU8a } from '../keccak';

const EIP_191_PREFIX = hexToU8a('0x1901');

export const ARRAY_REGEX = /^(.*)\[([0-9]*?)]$/;

function encode(types: string[], values: any[]) {
  return abi.rawEncode(
    types,
    // ethereumjs-abi not allowd uin8array
    values.map((value) => (isU8a(value) ? u8aToBuffer(value) : value))
  );
}

/**
 * @name getDependencies
 * @description
 * Get the dependencies of a struct type. If a struct has the same dependency multiple times, it's only included once
 * in the resulting array.
 */
export function getDependencies(typedData: TypedData, type: string, dependencies: string[] = []): string[] {
  if (dependencies.includes(type)) {
    return dependencies;
  }

  if (!typedData.types[type]) {
    return dependencies;
  }

  return [
    type,
    ...typedData.types[type].reduce<string[]>(
      (previous, type) => [
        ...previous,
        ...getDependencies(typedData, type.type, previous).filter((dependency) => !previous.includes(dependency))
      ],
      []
    )
  ];
}

/**
 * @name encodeType
 * @description
 * Encode a type to a string. All dependant types are alphabetically sorted.
 */
export function encodeType(typedData: TypedData, type: string): string {
  const [primary, ...dependencies] = getDependencies(typedData, type);
  const types = [primary, ...dependencies.sort()];

  return types
    .map((dependency) => {
      return `${dependency}(${typedData.types[dependency].map((type) => `${type.type} ${type.name}`)})`;
    })
    .join('');
}

/**
 * @name typeHash
 * @description
 * Get a type string as hash.
 */
export function typeHash(typedData: TypedData, type: string): Uint8Array {
  return keccak256AsU8a(encodeType(typedData, type));
}

/**
 * @name encodeValue
 * @description
 * Encodes a single value to an ABI serialisable string, number or Buffer. Returns the data as tuple, which consists of
 * an array of ABI compatible types, and an array of corresponding values.
 */
function encodeValue(typedData: TypedData, type: string, data: unknown): [string, string | Uint8Array | number] {
  const match = type.match(ARRAY_REGEX);

  // Checks for array types
  if (match) {
    const arrayType = match[1];
    const length = Number(match[2]) || undefined;

    if (!Array.isArray(data)) {
      throw new Error('Cannot encode data: value is not of array type');
    }

    if (length && data.length !== length) {
      throw new Error(`Cannot encode data: expected length of ${length}, but got ${data.length}`);
    }

    const encodedData = data.map((item) => encodeValue(typedData, arrayType, item));
    const types = encodedData.map((item) => item[0]);
    const values = encodedData.map((item) => item[1]);

    return ['bytes32', keccak256AsU8a(encode(types, values))];
  }

  if (typedData.types[type]) {
    return ['bytes32', structHash(typedData, type, data as Record<string, unknown>)];
  }

  // Strings and arbitrary byte arrays are hashed to bytes32
  if (type === 'string') {
    return ['bytes32', keccak256AsU8a(data as string)];
  }

  if (type === 'bytes') {
    return ['bytes32', keccak256AsU8a(u8aToU8a(data as string))];
  }

  return [type, data as string];
}

/**
 * @name encodeData
 * @description
 * Encode the data to an ABI encoded Buffer. The data should be a key -> value object with all the required values. All
 * dependant types are automatically encoded.
 */
export function encodeData(typedData: TypedData, type: string, data: Record<string, unknown>): Uint8Array {
  const [types, values] = typedData.types[type].reduce<[string[], unknown[]]>(
    ([types, values], field) => {
      if (data[field.name] === undefined || data[field.name] === null) {
        throw new Error(`Cannot encode data: missing data for '${field.name}'`);
      }

      const value = data[field.name];
      const [type, encodedValue] = encodeValue(typedData, field.type, value);

      return [
        [...types, type],
        [...values, encodedValue]
      ];
    },
    [['bytes32'], [typeHash(typedData, type)]]
  );

  return encode(types, values);
}

/**
 * @name structHash
 * @description
 * Get encoded data as a hash. The data should be a key -> value object with all the required values. All dependant
 * types are automatically encoded.
 */
export function structHash(typedData: TypedData, type: string, data: Record<string, unknown>): Uint8Array {
  return keccak256AsU8a(encodeData(typedData, type, data));
}

/**
 * @name getMessage
 * @description
 * Get the EIP-191 encoded message to sign, from the typedData object. If `hash` is enabled, the message will be hashed
 * with Keccak256.
 */
export function getMessage(typedData: TypedData, hash?: boolean): Uint8Array {
  const message = u8aConcat(
    EIP_191_PREFIX,
    structHash(typedData, 'EIP712Domain', typedData.domain),
    structHash(typedData, typedData.primaryType, typedData.message)
  );

  if (hash) {
    return keccak256AsU8a(message);
  }

  return message;
}

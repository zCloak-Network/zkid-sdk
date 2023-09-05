// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type {
  HashType,
  NativeType,
  NativeTypeWithOutNull,
  VerifiableCredentialVersion,
  VerifiablePresentationVersion
} from './types';

import { assert, numberToU8a, stringToU8a, u8aConcat } from '@polkadot/util';
import Web3 from 'web3';

import { rlpEncode as rlpEncodeFn } from '@zcloak/crypto';

import { HASHER } from './hasher';

// Local mode
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545')) as any;

export function rlpEncode(input: NativeType | NativeTypeWithOutNull[], hashType: HashType): Uint8Array {
  const result = rlpEncodeFn(input);

  if (hashType === 'RescuePrime' || hashType === 'RescuePrimeOptimized') {
    return HASHER[hashType](result, true);
  } else {
    return HASHER[hashType](result);
  }
}

export function encodeAsSol(input: NativeType | NativeTypeWithOutNull[]): HexString {
  switch (typeof input) {
    case 'string':
      // Make sure the input is not empty
      assert(input.length !== 0, 'The string input is empty!');

      return web3.utils.soliditySha3({ type: 'string', value: input });
    case 'number':
      if (_isDecimalNumber(input)) {
        throw new Error('Can not encode number with dot');
      }

      return web3.utils.soliditySha3({ type: 'int256', value: input });
    case 'boolean':
      return web3.utils.soliditySha3({ type: 'bool', value: input });
    case 'object':
      if (Array.isArray(input) && typeof input[0] === 'string') {
        assert(input.length !== 0, 'The string array input is empty!');

        const encodedParams = web3.eth.abi.encodeParameters(['string[]'], [input]);

        return web3.utils.keccak256(encodedParams);
      } else if (Array.isArray(input) && typeof input[0] === 'number') {
        assert(input.length !== 0, 'The number array input is empty!');

        return web3.utils.soliditySha3({ type: 'int256[]', value: input });
      } else throw new Error(`This object can not be encoded ${input}`);
    case 'undefined':
      throw new Error(`Can not encode this undefined type: ${input}`);
    default:
      // eslint-disable-next-line no-case-declarations
      const check: never = input;

      throw new Error(`The input type to be encodeAsSol is wrong, the type is ${check}`);
  }
}

export function signedVCMessage(digest: HexString, version: VerifiableCredentialVersion): Uint8Array {
  return u8aConcat(stringToU8a('CredentialVersionedDigest'), numberToU8a(Number(version), 16), digest);
}

export function signedVPMessage(
  hash: HexString,
  version: VerifiablePresentationVersion,
  challenge?: string
): Uint8Array {
  return u8aConcat(
    stringToU8a('VersionedCredPresentation'),
    numberToU8a(Number(version), 16),
    hash,
    challenge || new Uint8Array()
  );
}

// helper function, check whether the number is an integer or not
function _isDecimalNumber(num: number): boolean {
  const numStr = num.toString();

  if (numStr.includes('.')) {
    return true;
  } else {
    return false;
  }
}

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

import { numberToU8a, stringToU8a, u8aConcat } from '@polkadot/util';

import { rlpEncode as rlpEncodeFn } from '@zcloak/crypto';

import { HASHER } from './hasher';

export function rlpEncode(input: NativeType | NativeTypeWithOutNull[], hashType: HashType): Uint8Array {
  const result = rlpEncodeFn(input);

  if (hashType === 'RescuePrime' || hashType === 'RescuePrimeOptimized') {
    return HASHER[hashType](result, true);
  } else {
    return HASHER[hashType](result);
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

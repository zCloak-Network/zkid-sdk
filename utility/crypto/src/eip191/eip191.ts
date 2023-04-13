// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '../types';

import { stringToU8a, u8aConcat, u8aToU8a } from '@polkadot/util';

import { keccak256AsU8a } from '../keccak';

/**
 * @name eip191HashMessage
 * @description
 * keccak256 hash `message` with eip191 method, returns `Uint8Array`. See https://eips.ethereum.org/EIPS/eip-191
 */
export function eip191HashMessage(message: Uint8Array | HexString): Uint8Array {
  const messageU8a = u8aToU8a(message);

  return keccak256AsU8a(
    u8aConcat(stringToU8a('\x19Ethereum Signed Message:\n'), stringToU8a(String(messageU8a.length)), messageU8a)
  );
}

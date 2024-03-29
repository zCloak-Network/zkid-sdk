// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { u8aToHex } from '@polkadot/util';

import { keccak256AsU8a } from '../keccak';

function isInvalidChar(char: string, byte: number): boolean {
  return char !== (byte > 7 ? char.toUpperCase() : char.toLowerCase());
}

export function isEthereumChecksum(_address: string): boolean {
  const address = _address.replace('0x', '');
  const hash = u8aToHex(keccak256AsU8a(address.toLowerCase()), -1, false);

  for (let i = 0; i < 40; i++) {
    if (isInvalidChar(address[i], parseInt(hash[i], 16))) {
      return false;
    }
  }

  return true;
}

// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HashType, NativeType, NativeTypeWithOutNull } from './types';

import { rlpEncode as rlpEncodeFn } from '@zcloak/crypto';

import { HASHER } from './hasher';

export function rlpEncode(
  input: NativeType | NativeTypeWithOutNull[],
  hashType: HashType
): Uint8Array {
  const result = rlpEncodeFn(input);

  if (hashType === 'RescuePrime') {
    return HASHER.RescuePrime(result, true);
  } else {
    return HASHER[hashType](result);
  }
}

// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';
import type { Params } from './types';

import { scrypt } from '@noble/hashes/scrypt';
import { u8aToU8a } from '@polkadot/util';

import { randomAsU8a } from '../random/asU8a';
import { DEFAULT_PARAMS } from './defaults';

interface Result {
  params: Params;
  password: Uint8Array;
  salt: Uint8Array;
}

export function scryptEncode(
  passphrase?: HexString | Uint8Array | string,
  salt = randomAsU8a(),
  params = DEFAULT_PARAMS
): Result {
  const u8a = u8aToU8a(passphrase);

  return {
    params,
    password: scrypt(u8a, salt, { dkLen: 64, ...params }),
    salt
  };
}

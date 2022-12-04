// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';

import { u8aToU8a } from '@polkadot/util';

import { pbkdf2 } from '@zcloak/wasm';

import { randomAsU8a } from '../random/asU8a';

interface Result {
  password: Uint8Array;
  rounds: number;
  salt: Uint8Array;
}

export function pbkdf2Encode(
  passphrase?: HexString | Buffer | Uint8Array | string,
  salt: Buffer | Uint8Array = randomAsU8a(),
  rounds = 2048
): Result {
  const u8aPass = u8aToU8a(passphrase);
  const u8aSalt = u8aToU8a(salt);

  return {
    password: pbkdf2(u8aPass, u8aSalt, rounds),
    rounds,
    salt
  };
}

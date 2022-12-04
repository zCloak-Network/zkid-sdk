// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Params } from './types';

import { bnToU8a, u8aConcat } from '@polkadot/util';

const BN_LE_32_OPTS = { bitLength: 32, isLe: true };

export function scryptToU8a(salt: Uint8Array, { N, p, r }: Params): Uint8Array {
  return u8aConcat(
    salt,
    bnToU8a(N, BN_LE_32_OPTS),
    bnToU8a(p, BN_LE_32_OPTS),
    bnToU8a(r, BN_LE_32_OPTS)
  );
}

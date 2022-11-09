// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { AnyJson, HashType } from '@zcloak/vc/types';

import { calcRoothash } from '@zcloak/vc';

/**
 * provide `rootHash`, `subject` and `nonceMap`, verify the `rootHash` is valid
 * @param rootHashIn expected value of `rootHash`
 * @param input the subject object
 * @param nonceMap Generate nonceMap of rootHash
 * @returns `true` of `false`
 */
export function rootHashVerify(
  rootHashIn: HexString,
  input: AnyJson,
  nonceMap: Record<HexString, HexString>,
  type?: HashType
): boolean {
  const { rootHash } = calcRoothash(input, type, nonceMap);

  return rootHash === rootHashIn;
}

// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DigestPayload } from '@zcloak/vc';

import { calcDigest } from '@zcloak/vc';
import { HashType } from '@zcloak/vc/types';

/**
 * provide `digest`, `paylod`, verify the `digest` is valid
 * @param digestIn expected value of `digest`
 * @param payload object of [[DigestPayload]]
 * @param hashType [[HashType]]
 * @returns `true` or `false`
 */
export function digestVerify(
  digestIn: HexString,
  payload: DigestPayload,
  hashType?: HashType
): boolean {
  const { digest } = calcDigest(payload, hashType);

  return digestIn === digest;
}

// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DigestPayload } from '@zcloak/vc';

import { calcDigest } from '@zcloak/vc';
import { HashType } from '@zcloak/vc/types';

/**
 * @name verifyDigest
 * @summay verify digest hash by [[DigestPayload]].
 * @description
 * verify `digestIn` hash with `payload`. Returns `true` on success, `false` otherwise.
 * @example
 * <BR>
 * ```typescript
 * import type { DigestPayload } from '@zcloak/vc';
 * import { digestVerify } from '@zcloak/verify'
 *
 * const expectedDigest = '0x358c172298da91c7736df58b30ddc87fcec1ff13f85bcfd60f0ef4d54a12c419';
 * const payload: DigestPayload = {
 *    rootHash: '0x0a86d6642395770ac481f8a215b08a881e9e0229de2686d498893dec0572649a',
 *    holder: 'did:zk:0x082d674c00e27fBaAAE123a85f5024A1DD702e51',
 *    ctype: '0xd50f5298fda74ff0b46be740e602fa5ce0bc2a48fc5ddfbbae3c0678f59b5b97'
 * }
 * digestVerify(expectedDigest, payload, 'Keccak256'); // true
 * ```
 */
export function digestVerify(
  digestIn: HexString,
  payload: DigestPayload,
  hashType?: HashType
): boolean {
  const { digest } = calcDigest(payload, hashType);

  return digestIn === digest;
}

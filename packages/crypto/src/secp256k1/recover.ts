// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';

import { recoverPublicKey, Signature } from '@noble/secp256k1';
import { u8aToU8a } from '@polkadot/util';

import { secp256k1Expand } from './expand';

/**
 * @name secp256k1Recover
 * @description Recovers a publicKey from the supplied signature
 */
export function secp256k1Recover(
  msgHash: HexString | Uint8Array | string,
  signature: HexString | Uint8Array | string,
  recovery: number
): Uint8Array {
  const sig = u8aToU8a(signature).subarray(0, 64);
  const msg = u8aToU8a(msgHash);
  const publicKey = recoverPublicKey(msg, Signature.fromCompact(sig).toRawBytes(), recovery);

  if (!publicKey) {
    throw new Error('Unable to recover publicKey from signature');
  }

  return secp256k1Expand(publicKey);
}

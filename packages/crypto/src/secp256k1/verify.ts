// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';

import { u8aEq, u8aToU8a } from '@polkadot/util';

import { ethereumEncode } from '../ethereum';
import { keccak256AsU8a } from '../keccak';
import { secp256k1Recover } from './recover';

/**
 * @name secp256k1Verify
 * @description Verifies the signature of `message`, using the supplied pair
 */
export function secp256k1Verify(
  msgHash: HexString | Uint8Array | string,
  signature: HexString | Uint8Array | string,
  publicKeyOrAddress: HexString | Uint8Array | string
): boolean {
  const sig = u8aToU8a(signature);

  if (sig.length !== 65) {
    throw new Error(`Expected signature with 65 bytes, ${sig.length} found instead`);
  }

  const publicKey = secp256k1Recover(keccak256AsU8a(msgHash), sig, sig[64]);
  const signerAddr = keccak256AsU8a(publicKey);
  const inputAddr = u8aToU8a(ethereumEncode(publicKeyOrAddress));

  // for Ethereum (keccak) the last 20 bytes is the address
  return u8aEq(publicKey, inputAddr) || u8aEq(signerAddr.slice(-20), inputAddr.slice(-20));
}

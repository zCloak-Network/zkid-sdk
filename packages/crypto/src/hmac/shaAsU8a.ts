// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { hmac } from '@noble/hashes/hmac';
import { sha256 } from '@noble/hashes/sha256';
import { sha512 } from '@noble/hashes/sha512';
import { u8aToU8a } from '@polkadot/util';

const JS_HASH = {
  256: sha256,
  512: sha512
};

function createSha(
  bitLength: 256 | 512
): (key: Uint8Array | string, data: Uint8Array) => Uint8Array {
  return (key: Uint8Array | string, data: Uint8Array): Uint8Array =>
    hmacShaAsU8a(key, data, bitLength);
}

/**
 * @name hmacShaAsU8a
 * @description creates a Hmac Sha (256/512) Uint8Array from the key & data
 */
export function hmacShaAsU8a(
  key: Uint8Array | string,
  data: Uint8Array,
  bitLength: 256 | 512 = 256
): Uint8Array {
  const u8aKey = u8aToU8a(key);

  return hmac(JS_HASH[bitLength], u8aKey, data);
}

/**
 * @name hmacSha256AsU8a
 * @description creates a Hmac Sha256 Uint8Array from the key & data
 */
export const hmacSha256AsU8a = createSha(256);

/**
 * @name hmacSha512AsU8a
 * @description creates a Hmac Sha512 Uint8Array from the key & data
 */
export const hmacSha512AsU8a = createSha(512);

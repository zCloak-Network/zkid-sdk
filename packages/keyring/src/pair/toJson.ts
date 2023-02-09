// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeypairType, KeyringPair$Json } from '../types';

import { base64Encode } from '@zcloak/crypto';

export function pairToJson(
  type: KeypairType,
  publicKey: Uint8Array,
  encoded: Uint8Array,
  isEncrypted: boolean
): KeyringPair$Json {
  return {
    encoded: base64Encode(encoded),
    encoding: {
      content: ['pkcs8', type],
      type: isEncrypted ? ['scrypt'] : ['none'],
      version: '1'
    },
    publicKey: base64Encode(publicKey)
  };
}

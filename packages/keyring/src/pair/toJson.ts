// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeypairType, KeyringPair$Json } from '../types';

import { base64Encode } from '@polkadot/util-crypto';

export function pairToJson(
  type: KeypairType,
  encoded: Uint8Array,
  isEncrypted: boolean
): KeyringPair$Json {
  return {
    encoded: base64Encode(encoded),
    encoding: {
      content: ['pkcs8', type],
      type: isEncrypted ? ['scrypt'] : ['none'],
      version: '1'
    }
  };
}

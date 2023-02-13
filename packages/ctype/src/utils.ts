// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TypedData } from '@zcloak/crypto/eip712/types';

export function getPublishCTypeTypedData(hash: string): TypedData {
  return {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' }
      ],
      PublishCType: [{ name: 'hash', type: 'bytes' }]
    },
    primaryType: 'PublishCType',
    domain: {
      name: 'PublishCType',
      version: '0'
    },
    message: {
      hash
    }
  };
}

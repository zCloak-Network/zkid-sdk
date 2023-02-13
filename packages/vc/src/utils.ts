// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';
import type { TypedData } from '@zcloak/crypto/eip712/types';
import type { HashType, NativeType, NativeTypeWithOutNull } from './types';

import { rlpEncode as rlpEncodeFn } from '@zcloak/crypto';

import { HASHER } from './hasher';

export function rlpEncode(
  input: NativeType | NativeTypeWithOutNull[],
  hashType: HashType
): Uint8Array {
  const result = rlpEncodeFn(input);

  if (hashType === 'RescuePrime') {
    return HASHER.RescuePrime(result, true);
  } else {
    return HASHER[hashType](result);
  }
}

export function getAttestationTypedData(digest: HexString): TypedData {
  return {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' }
      ],
      Attestation: [{ name: 'digest', type: 'bytes' }]
    },
    primaryType: 'Attestation',
    domain: {
      name: 'Attestation',
      version: '0'
    },
    message: {
      digest
    }
  };
}

export function getPresentationTypedData(hash: HexString, challenge: string): TypedData {
  return {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' }
      ],
      Presentation: [
        { name: 'hash', type: 'bytes' },
        { name: 'challenge', type: 'string' }
      ]
    },
    primaryType: 'Presentation',
    domain: {
      name: 'Presentation',
      version: '0'
    },
    message: {
      hash,
      challenge
    }
  };
}

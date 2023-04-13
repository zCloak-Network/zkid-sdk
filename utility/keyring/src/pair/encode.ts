// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PairInfo } from '.';

import { u8aConcat } from '@polkadot/util';

import { naclEncrypt, scryptEncode, scryptToU8a } from '@zcloak/crypto';

import { PKCS8_DIVIDER, PKCS8_HEADER } from './defaults';

export function encodePair({ publicKey, secretKey }: PairInfo, passphrase?: string): Uint8Array {
  if (!secretKey) {
    throw new Error('Expected a valid secretKey to be passed to encode');
  }

  const encoded = u8aConcat(PKCS8_HEADER, secretKey, PKCS8_DIVIDER, publicKey);

  if (!passphrase) {
    return encoded;
  }

  const { params, password, salt } = scryptEncode(passphrase);
  const { encrypted, nonce } = naclEncrypt(encoded, password.subarray(0, 32));

  return u8aConcat(scryptToU8a(salt, params), nonce, encrypted);
}

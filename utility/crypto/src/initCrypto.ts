// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { utils as utilsNobleSecp256k1 } from '@noble/secp256k1';
import { u8aConcat } from '@polkadot/util';

import { initWasm } from '@zcloak/wasm-bridge';

import { hmacSha256AsU8a } from './hmac';

export function initCrypto(onlyAsm?: boolean) {
  // Set overrides on the secp256k1 utils
  //   - hmacShaSync - This needs to be set, unset by default
  utilsNobleSecp256k1.hmacSha256Sync = (key: Uint8Array, ...messages: Uint8Array[]) =>
    hmacSha256AsU8a(key, u8aConcat(...messages));

  return initWasm(onlyAsm);
}

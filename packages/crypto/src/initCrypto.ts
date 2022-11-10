// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {} from '@polkadot/wasm-crypto/initOnlyWasm';
import { initWasm as initPolkadotWasm } from '@polkadot/wasm-crypto/initWasmAsm';

import { initWasm } from '@zcloak/wasm';

export function initCrypto() {
  return Promise.all([initWasm(), initPolkadotWasm()]);
}

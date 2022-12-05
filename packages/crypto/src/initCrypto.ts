// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initWasm } from '@zcloak/wasm';

export function initCrypto() {
  return initWasm(false);
}

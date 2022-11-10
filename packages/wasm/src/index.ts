// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { hexToU8a } from '@polkadot/util';

import { bytes } from './bytes';
import init from './wasm';

export function initWasm() {
  return init(hexToU8a(bytes));
}

export * from './bundle';

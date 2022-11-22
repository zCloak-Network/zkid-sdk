// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { allocU64a, resultU64a, wasm } from './helper';

export function rescueHash(values: BigUint64Array): BigUint64Array {
  const args = allocU64a(values);

  wasm.rescue_hash(...args);

  return resultU64a(args[0]);
}

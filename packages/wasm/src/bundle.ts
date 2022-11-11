// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable camelcase */

import { rescue_hash } from './wasm';

export function rescueHash(values: BigUint64Array): BigUint64Array {
  return rescue_hash(values);
}

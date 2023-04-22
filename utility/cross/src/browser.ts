// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { xglobal } from './xglobal';

export function getRandomValues<T extends Uint8Array>(arr: T): T {
  // We use x-global here - this prevents packagers such as rollup
  // confusing this with the "normal" Node.js import and stubbing it
  return xglobal.crypto.getRandomValues(arr);
}

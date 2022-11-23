// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { rescueHash } from './bundle';
import { initWasm } from './helper';

describe('wasm', (): void => {
  it('initWasm', async (): Promise<void> => {
    await initWasm();
    console.log(rescueHash(new BigUint64Array([1n, 1n, 1n, 1n, 1n, 1n, 1n, 1n])));
  });
});

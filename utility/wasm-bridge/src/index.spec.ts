// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { rescuePrimeHash } from './bundle';
import { initWasm } from './helper';

describe('wasm', (): void => {
  it('initWasm with wasm', async (): Promise<void> => {
    await initWasm();
    console.log(rescuePrimeHash(new BigUint64Array([1n, 1n, 1n, 1n, 1n, 1n, 1n, 1n])));
  });

  it('initWasm with wasm', async (): Promise<void> => {
    await initWasm(true);
    console.log(rescuePrimeHash(new BigUint64Array([1n, 1n, 1n, 1n, 1n, 1n, 1n, 1n])));
  });
});

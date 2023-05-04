// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initWasm, rescuePrimeHash, rescuePrimeOptimizedHash } from '.';

describe('wasm', (): void => {
  beforeAll(async () => {
    await initWasm();
  });

  it('rescuePrimeHash', (): void => {
    expect(rescuePrimeHash(new BigUint64Array([1n, 1n, 1n, 1n, 1n, 1n, 1n, 1n]))).toEqual(
      new BigUint64Array([15629187566796044164n, 14492985933268926539n, 10247637497263796444n, 5502356898483464194n])
    );
  });

  it('rescuePrimeOptimizedHash', (): void => {
    expect(rescuePrimeOptimizedHash(new BigUint64Array([1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n]))).toEqual(
      new BigUint64Array([15975159621759139720n, 15720844923951376941n, 16013969809933496273n, 13608701685256682132n])
    );
  });
});

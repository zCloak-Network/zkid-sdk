// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { generateProgramHash, initMidenWasm } from '.';

const PROGRAM = `
begin push.3 push.5 add end
`;

describe('wasm', (): void => {
  beforeAll(async () => {
    await initMidenWasm();
  });

  it('generateProgramHash func', () => {
    const programHash = generateProgramHash(PROGRAM);

    expect(programHash).toBe('01d680e6c4f82c8274c43626c67a0f494e65f147245330a3bd6a9c69271223c1');
  });
});

// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initCrypto } from '../initCrypto';
import { rescueAsU8a } from '.';

describe('blake2AsU8a', (): void => {
  beforeEach(async (): Promise<void> => {
    await initCrypto();
  });

  it('returns a 256 bit value', (): void => {
    const bytes = new Uint8Array([
      221, 232, 185, 77, 2, 251, 241, 95, 39, 243, 142, 48, 34, 12, 249, 159, 38, 154, 161, 127,
      125, 135, 20, 204, 255, 187, 194, 127, 19, 246, 141, 171
    ]);

    const hash = rescueAsU8a(bytes);

    expect(hash).toHaveLength(32);
    expect(hash).toEqual(
      new Uint8Array([
        132, 242, 4, 179, 208, 199, 40, 150, 43, 80, 99, 154, 232, 181, 187, 213, 93, 124, 201, 7,
        75, 6, 104, 111, 252, 58, 108, 163, 213, 130, 31, 158
      ])
    );
  });

  it('throw error when data length not right', (): void => {
    const bytes = new Uint8Array([135, 194, 185, 125, 127]);

    expect(() => rescueAsU8a(bytes)).toThrow(
      'data specifies the rescue input, it should contain 8 elements or more(over 8 but should be some multiple of 4)'
    );
  });
});

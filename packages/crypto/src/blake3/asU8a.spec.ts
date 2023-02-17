// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initCrypto } from '../initCrypto';
import { blake3AsU8a } from './asU8a';

describe('blake3AsU8a', (): void => {
  beforeAll(async (): Promise<void> => {
    await initCrypto();
  });

  it('returns a 64-bit value by default', (): void => {
    expect(blake3AsU8a('abc', 64, undefined)).toEqual(
      new Uint8Array([100, 55, 179, 172, 56, 70, 81, 51])
    );
  });

  it('returns a 128-bit value (as specified,)', (): void => {
    expect(blake3AsU8a('abc', 128, undefined)).toEqual(
      new Uint8Array([100, 55, 179, 172, 56, 70, 81, 51, 255, 182, 59, 117, 39, 58, 141, 181])
    );
  });

  it('returns a 256-bit value (as specified)', (): void => {
    expect(blake3AsU8a('abc', 256, undefined)).toEqual(
      new Uint8Array([
        100, 55, 179, 172, 56, 70, 81, 51, 255, 182, 59, 117, 39, 58, 141, 181, 72, 197, 88, 70, 93,
        121, 219, 3, 253, 53, 156, 108, 213, 189, 157, 133
      ])
    );
  });

  it('returns a 512-bit value (as specified)', (): void => {
    expect(blake3AsU8a('abc', 512, undefined)).toEqual(
      new Uint8Array([
        100, 55, 179, 172, 56, 70, 81, 51, 255, 182, 59, 117, 39, 58, 141, 181, 72, 197, 88, 70, 93,
        121, 219, 3, 253, 53, 156, 108, 213, 189, 157, 133, 31, 178, 80, 174, 115, 147, 245, 208,
        40, 19, 182, 93, 82, 26, 13, 73, 45, 155, 160, 156, 247, 206, 127, 76, 255, 217, 0, 242, 51,
        116, 191, 11
      ])
    );
  });
});

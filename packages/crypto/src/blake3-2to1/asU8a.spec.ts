// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { blake3 } from '@noble/hashes/blake3';

import { initCrypto } from '../initCrypto';
import { blake32to1AsU8a } from './asU8a';

describe('blake32to1AsU8a', (): void => {
  beforeEach(async (): Promise<void> => {
    await initCrypto();
  });

  it('returns a 64-bit value by default', (): void => {
    expect(blake32to1AsU8a('abc', 64, undefined)).toEqual(
      new Uint8Array([100, 55, 179, 172, 56, 70, 81, 51])
    );
  });

  it('returns a 128-bit value (as specified,)', (): void => {
    expect(blake32to1AsU8a('abc', 128, undefined)).toEqual(
      new Uint8Array([100, 55, 179, 172, 56, 70, 81, 51, 255, 182, 59, 117, 39, 58, 141, 181])
    );
  });

  it('returns a 256-bit value (as specified, u8a.length is less than 32 bytes)', (): void => {
    expect(blake32to1AsU8a(new Uint8Array([97, 98, 99]), 256, undefined)).toEqual(
      new Uint8Array([
        97, 98, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0
      ])
    );
  });

  it('returns a 256-bit value (as specified， u8a.length is 32bytes )', (): void => {
    expect(
      blake32to1AsU8a(
        new Uint8Array([
          54, 55, 56, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0
        ]),
        256,
        undefined
      )
    ).toEqual(
      new Uint8Array([
        54, 55, 56, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0
      ])
    );
  });

  it('returns a 256-bit value (as specified， u8a.length between 33-64bytes )', (): void => {
    // first 32 bytes: [54, 55, 56, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    // second 32 bytes : [100];
    const blake3Result = blake3(
      new Uint8Array([
        54, 55, 56, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0
      ])
    );

    expect(
      blake32to1AsU8a(
        new Uint8Array([
          54, 55, 56, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 100
        ]),
        256,
        undefined
      )
    ).toEqual(blake3Result);
  });

  it('returns a 256-bit value (as specified， u8a.length is 64 bytes )', (): void => {
    const firstlice = new Uint8Array([
      54, 55, 56, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0
    ]);
    const secSlice = new Uint8Array([
      87, 155, 56, 57, 0, 48, 0, 148, 0, 133, 99, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 8, 0, 0, 0, 0, 0, 0,
      10, 0, 0, 0
    ]);
    const paddingResult = new Uint8Array(64);

    paddingResult.set(firstlice);
    paddingResult.set(secSlice, 32);
    const blake3Result = blake3(paddingResult);

    expect(
      blake32to1AsU8a(
        new Uint8Array([
          54, 55, 56, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 87, 155, 56, 57, 0, 48, 0, 148, 0, 133, 99, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 8, 0,
          0, 0, 0, 0, 0, 10, 0, 0, 0
        ]),
        256,
        undefined
      )
    ).toEqual(blake3Result);
  });

  it('returns a 256-bit value (as specified， u8a.length is 64-96 bytes )', (): void => {
    // first 32 bytes:[54, 55, 56, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    // second 32 bytes: [87, 155, 56, 57, 0, 48, 0, 148, 0, 133, 99, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 8, 0, 0, 0, 0, 0, 0,10, 0, 0, 0]
    const thirdSlice = new Uint8Array([107, 106]);
    let blake3Result = blake3(
      new Uint8Array([
        54, 55, 56, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 87, 155, 56, 57, 0, 48, 0, 148, 0, 133, 99, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 8, 0, 0,
        0, 0, 0, 0, 10, 0, 0, 0
      ])
    );

    const secondConcat = new Uint8Array(64);

    secondConcat.set(blake3Result);
    secondConcat.set(thirdSlice, 32);
    blake3Result = blake3(secondConcat);

    expect(
      blake32to1AsU8a(
        new Uint8Array([
          54, 55, 56, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 87, 155, 56, 57, 0, 48, 0, 148, 0, 133, 99, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 8, 0,
          0, 0, 0, 0, 0, 10, 0, 0, 0, 107, 106
        ]),
        256,
        undefined
      )
    ).toEqual(blake3Result);
  });

  it('returns a 512-bit value (as specified)', (): void => {
    expect(blake32to1AsU8a('abc', 512, undefined)).toEqual(
      new Uint8Array([
        100, 55, 179, 172, 56, 70, 81, 51, 255, 182, 59, 117, 39, 58, 141, 181, 72, 197, 88, 70, 93,
        121, 219, 3, 253, 53, 156, 108, 213, 189, 157, 133, 31, 178, 80, 174, 115, 147, 245, 208,
        40, 19, 182, 93, 82, 26, 13, 73, 45, 155, 160, 156, 247, 206, 127, 76, 255, 217, 0, 242, 51,
        116, 191, 11
      ])
    );
  });
});

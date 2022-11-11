// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initCrypto } from '../initCrypto';
import { rescueAsU8a } from '.';

describe('rescueAsU8a', (): void => {
  beforeEach(async (): Promise<void> => {
    await initCrypto();
  });

  describe('pass U8a', (): void => {
    it('input 8 bytes length', (): void => {
      const bytes = new Uint8Array([
        221, 232, 185, 77, 2, 251, 43, 55
      ]);

      const hash = rescueAsU8a(bytes);

      expect(hash).toHaveLength(32);
      expect(hash).toEqual(new Uint8Array([
        13, 58, 150, 120, 89, 188, 67, 87,
       187, 62, 231, 39, 60, 84, 79, 187,
       222, 79, 86, 137, 87, 95, 214, 26,
         6, 33, 140, 117, 119, 141, 119, 2
     ]));
    });

    it('input string', (): void => {
      const hash = rescueAsU8a('abcd1234');

      console.log(hash);

      expect(hash).toHaveLength(32);
      expect(hash).toEqual(
        new Uint8Array([
          212, 187, 16, 176, 223, 111, 125, 152,
          232, 223, 53, 52, 239, 99, 173, 71,
          181, 59, 174, 51, 80, 175, 78, 174,
           66, 122, 204, 8, 39, 100, 158, 253
        ])
      );
    });

    it('input no multiple of 8', (): void => {
      const bytes = new Uint8Array([
        221, 232, 73, 111, 67, 21, 2
      ]);

      expect(() => rescueAsU8a(bytes)).toThrow('byte length of BigUint64Array should be a multiple of 8');
    });
  });
});

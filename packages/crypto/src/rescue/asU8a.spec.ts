// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initCrypto } from '../initCrypto';
import { rescueAsU8a } from '.';

describe('rescueAsU8a', (): void => {
  beforeEach(async (): Promise<void> => {
    await initCrypto();
  });

  describe('not as u64', (): void => {
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

  describe('as u64', (): void => {
    it('input 8 bytes length', (): void => {
      const bytes = new Uint8Array([
        221, 232, 185, 77, 2, 251, 43, 55
      ]);

      const hash = rescueAsU8a(bytes, true);

      expect(hash).toHaveLength(32);
      expect(hash).toEqual(new Uint8Array([
        137, 85, 220, 139, 255, 19, 43, 192,
        130, 88, 44, 228, 238, 183, 42, 144,
         45, 12, 130, 174, 152, 200, 132, 167,
         90, 183, 113, 188, 199, 52, 236, 70
      ]));
    });

    it('input string', (): void => {
      const hash = rescueAsU8a('abcd1234', true);

      expect(hash).toHaveLength(32);
      expect(hash).toEqual(
        new Uint8Array([
          135, 118, 41, 144, 40, 252, 65,
          100, 204, 245, 252, 44, 138, 223,
          209, 13, 119, 200, 131, 115, 120,
           31, 210, 44, 253, 198, 228, 212,
          122, 61, 87, 245
        ])
      );
    });

    it('input no multiple of 8', (): void => {
      const bytes = new Uint8Array([
        221, 232, 73, 111, 67, 21, 2
      ]);
      const hash = rescueAsU8a(bytes, true);

      expect(hash).toEqual(new Uint8Array([
        216, 218, 218, 150, 201, 105, 29, 238,
         61, 188, 87, 77, 217, 169, 20, 240,
        164, 50, 168, 9, 193, 174, 210, 163,
        117, 26, 72, 214, 36, 169, 161, 77
      ]));
    });
  });
});

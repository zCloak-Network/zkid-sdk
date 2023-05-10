// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initCrypto } from '../initCrypto';
import { rescuePrimeOptimizedAsU8a } from '.';

describe('rescuePrimeOptimiszedAsU8a', (): void => {
  beforeAll(async (): Promise<void> => {
    await initCrypto();
  });

  describe('not as u64', (): void => {
    it('input 8 bytes length', (): void => {
      const bytes = new Uint8Array([221, 232, 185, 77, 2, 251, 43, 55]);

      const hash = rescuePrimeOptimizedAsU8a(bytes);

      expect(hash).toHaveLength(32);
      expect(hash).toEqual(
        new Uint8Array([
          9, 63, 188, 77, 54, 116, 126, 119, 71, 95, 217, 93, 99, 71, 54, 151, 37, 151, 146, 202, 164, 221, 113, 80,
          152, 77, 171, 167, 123, 60, 6, 123
        ])
      );
    });

    it('input string', (): void => {
      const hash = rescuePrimeOptimizedAsU8a('abcd1234');

      expect(hash).toHaveLength(32);
      expect(hash).toEqual(
        new Uint8Array([
          56, 141, 207, 111, 171, 128, 220, 39, 56, 62, 94, 58, 221, 138, 186, 95, 90, 149, 167, 30, 232, 129, 73, 68,
          63, 91, 120, 210, 203, 21, 109, 142
        ])
      );
    });

    it('input no multiple of 8', (): void => {
      const bytes = new Uint8Array([221, 232, 73, 111, 67, 21, 2]);

      expect(() => rescuePrimeOptimizedAsU8a(bytes)).toThrow('byte length of BigUint64Array should be a multiple of 8');
    });
  });

  describe('as u64', (): void => {
    it('input 8 bytes length', (): void => {
      const bytes = new Uint8Array([221, 232, 185, 77, 2, 251, 43, 55]);

      const hash = rescuePrimeOptimizedAsU8a(bytes, true);

      expect(hash).toHaveLength(32);
      expect(hash).toEqual(
        new Uint8Array([
          174, 39, 195, 212, 45, 68, 206, 18, 248, 192, 85, 143, 175, 36, 31, 174, 42, 241, 102, 151, 172, 4, 170, 164,
          175, 18, 213, 4, 155, 73, 187, 250
        ])
      );
    });

    it('input string', (): void => {
      const hash = rescuePrimeOptimizedAsU8a('abcd1234', true);

      expect(hash).toHaveLength(32);
      expect(hash).toEqual(
        new Uint8Array([
          16, 75, 170, 23, 222, 70, 142, 40, 16, 103, 147, 222, 221, 21, 60, 164, 69, 106, 95, 221, 24, 137, 217, 4,
          226, 10, 28, 45, 210, 33, 73, 44
        ])
      );
    });

    it('input no multiple of 8', (): void => {
      const bytes = new Uint8Array([221, 232, 73, 111, 67, 21, 2]);
      const hash = rescuePrimeOptimizedAsU8a(bytes, true);

      expect(hash).toEqual(
        new Uint8Array([
          39, 154, 54, 236, 24, 165, 142, 54, 65, 50, 241, 53, 65, 22, 163, 154, 4, 45, 210, 180, 93, 125, 141, 100,
          102, 22, 137, 127, 255, 82, 244, 61
        ])
      );
    });
  });
});

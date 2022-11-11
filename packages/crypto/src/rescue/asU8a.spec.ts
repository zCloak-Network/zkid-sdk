// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initCrypto } from '../initCrypto';
import { rescueAsU8a } from '.';

describe('rescueAsU8a', (): void => {
  beforeEach(async (): Promise<void> => {
    await initCrypto();
  });

  describe('pass U8a', (): void => {
    it('input less than 8 bytes length', (): void => {
      const bytes = new Uint8Array([
        221, 232, 185, 77, 2, 251
      ]);

      const hash = rescueAsU8a(bytes);

      expect(hash).toHaveLength(32);
      expect(hash).toEqual(rescueAsU8a(new Uint8Array([221, 232, 185, 77, 2, 251, 0, 0])));
    });

    it('input 8 bytes length', (): void => {
      const bytes = new Uint8Array([
        221, 232, 185, 77, 2, 251, 73, 111
      ]);

      const hash = rescueAsU8a(bytes);

      expect(hash).toHaveLength(32);
      expect(hash).toEqual(
        new Uint8Array([
          124, 24, 110, 139, 94, 213, 78, 172,
           94, 215, 159, 116, 240, 173, 49, 0,
          209, 185, 218, 10, 113, 26, 231, 81,
           96, 74, 79, 234, 181, 31, 18, 251
        ])
      );
    });

    it('input great than 8 bytes length but not be multiple of 4', (): void => {
      const bytes = new Uint8Array([
        221, 232, 185, 77, 2, 251, 73, 111, 67, 21, 2
      ]);

      const hash = rescueAsU8a(bytes);

      expect(hash).toHaveLength(32);
      expect(hash).toEqual(rescueAsU8a(new Uint8Array([
        221, 232, 185, 77, 2, 251, 73, 111, 67, 21, 2, 0
      ])));
    });

    it('input great than 8 bytes length and be multiple of 4', (): void => {
      const bytes = new Uint8Array([
        221, 232, 185, 77, 2, 251, 73, 111, 67, 21, 2, 4
      ]);

      const hash = rescueAsU8a(bytes);

      expect(hash).toHaveLength(32);
      expect(hash).toEqual(
        new Uint8Array([
          121, 41, 84, 226, 48, 119, 139, 102,
          103, 62, 106, 17, 179, 63, 29, 245,
           32, 200, 42, 171, 102, 204, 190, 69,
           72, 67, 101, 204, 142, 147, 84, 189
        ])
      );
    });
  });

  describe('pass U64Array', (): void => {
    it('input less than 8 bytes length', (): void => {
      const bytes = new BigUint64Array([
        2265473476451n, 2325635654634n, 15436363485n, 56236452645432654747n, 28768778468766544n, 26536564565451n
      ]);

      const hash = rescueAsU8a(bytes);

      expect(hash).toHaveLength(32);
      expect(hash).toEqual(rescueAsU8a(new BigUint64Array([
        2265473476451n, 2325635654634n, 15436363485n, 56236452645432654747n, 28768778468766544n, 26536564565451n, 0n, 0n
      ])));
    });

    it('input 8 bytes length', (): void => {
      const bytes = new BigUint64Array([
        2265473476451n, 2325635654634n, 15436363485n, 56236452645432654747n, 28768778468766544n, 26536564565451n, 65476463737643623n, 765763754632543532n
      ]);

      const hash = rescueAsU8a(bytes);

      expect(hash).toHaveLength(32);
      expect(hash).toEqual(
        new Uint8Array([
          82, 157, 194, 137, 224, 248, 241,
         171, 28, 158, 92, 226, 7, 25,
         249, 27, 249, 248, 153, 157, 213,
          20, 237, 200, 69, 103, 210, 194,
         205, 158, 168, 116
       ])
      );
    });

    it('input great than 8 bytes length but not be multiple of 4', (): void => {
      const bytes = new BigUint64Array([
        22646345754356526236321n, 265463587469769832n, 6746315832543535435n, 77635378452561537n, 273765743654654634n, 7634745654634264537451n, 75624736587564856753n, 16234654646365253411n, 54352473568458765767n, 654364563464364521n, 65765478457566542n
      ]);

      const hash = rescueAsU8a(bytes);

      expect(hash).toHaveLength(32);
      expect(hash).toEqual(rescueAsU8a(new BigUint64Array([
        22646345754356526236321n, 265463587469769832n, 6746315832543535435n, 77635378452561537n, 273765743654654634n, 7634745654634264537451n, 75624736587564856753n, 16234654646365253411n, 54352473568458765767n, 654364563464364521n, 65765478457566542n, 0n
      ])));
    });

    it('input great than 8 bytes length and be multiple of 4', (): void => {
      const bytes = new BigUint64Array([
        22646345754356526236321n, 265463587469769832n, 6746315832543535435n, 77635378452561537n, 273765743654654634n, 7634745654634264537451n, 75624736587564856753n, 16234654646365253411n, 54352473568458765767n, 654364563464364521n, 65765478457566542n, 6576546243254335543654354325353n
      ]);

      const hash = rescueAsU8a(bytes);

      expect(hash).toHaveLength(32);
      expect(hash).toEqual(
        new Uint8Array([
          136, 82, 113, 165, 100, 97, 141, 246,
           70, 112, 249, 80, 98, 195, 164, 129,
          218, 192, 99, 40, 35, 235, 209, 48,
           42, 73, 53, 96, 116, 69, 41, 75
        ])
      );
    });
  });
});

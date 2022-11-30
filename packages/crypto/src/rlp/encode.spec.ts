// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { hexToU8a } from '@polkadot/util';

import { initCrypto } from '../initCrypto';
import { rlpEncode } from './encode';
import * as official from './rlptest.json';

describe('encode rlp', (): void => {
  beforeEach(async (): Promise<void> => {
    await initCrypto();
  });

  it('encode a string', (): void => {
    for (const [testName, test] of Object.entries(official.tests) as [any, any]) {
      let incoming: any = test.in;

      // if we are testing a big number
      if (incoming[0] === '#') {
          incoming = BigInt(incoming.slice(1)) // eslint-disable-line
      }

      const encoded = rlpEncode(incoming);
      const out = test.out;

      expect(encoded).toEqual(hexToU8a(out));
      console.log(`RLP ${testName} --- PASS`);
    }
  });
});

// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { secp256k1PairFromSeed } from '@zcloak/crypto';

import { createPair } from '.';

describe('toJson', (): void => {
  it('creates an unencoded output with no passphrase', (): void => {
    const pair = createPair(
      secp256k1PairFromSeed('0x2497d66feca952454e02bfea63a020b8652ec333b3be45401c2ec319937b953d'),
      { type: 'ecdsa' }
    );

    expect(pair.toJson()).toMatchObject({
      encoded:
        'MFMCAQEwBQYDK2VwBCIEICSX1m/sqVJFTgK/6mOgILhlLsMzs75FQBwuwxmTe5U9oSMDIQACgRIc+89ofjH/k604Rs+8wYClvgdeULW+uhF0nRviE3Y=',
      encoding: { content: ['pkcs8', 'ecdsa'], type: ['none'], version: '1' }
    });
  });

  it('creates an encoded output with passphrase', (): void => {
    const pair = createPair(
      secp256k1PairFromSeed('0x2497d66feca952454e02bfea63a020b8652ec333b3be45401c2ec319937b953d'),
      { type: 'ecdsa' }
    );

    const json = pair.toJson('1');

    expect(json.encoded).toHaveLength(228);
    expect(json).toMatchObject({
      encoding: {
        content: ['pkcs8', 'ecdsa'],
        type: ['scrypt'],
        version: '1'
      }
    });
  });
});

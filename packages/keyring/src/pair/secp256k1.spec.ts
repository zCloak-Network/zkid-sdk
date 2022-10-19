import type { Keypair } from './types';

import { stringToU8a, u8aEq } from '@polkadot/util';

import { secp256k1PairFromSecret, secp256k1Sign, secp256k1Verify } from './secp256k1';

const SEED = '0xdc0fe6e259162b2a995b0c42ad0da49bfca4bf009a8062c19eff83a6ccd076fc';

const KEYPAIR: Keypair = {
  secretKey: new Uint8Array([
    220, 15, 230, 226, 89, 22, 43, 42, 153, 91, 12, 66, 173, 13, 164, 155, 252, 164, 191, 0, 154,
    128, 98, 193, 158, 255, 131, 166, 204, 208, 118, 252
  ]),
  publicKey: new Uint8Array([
    2, 73, 127, 28, 162, 129, 114, 146, 80, 141, 203, 39, 86, 139, 211, 3, 70, 101, 96, 27, 138, 82,
    53, 70, 140, 193, 77, 203, 22, 198, 108, 197, 55
  ])
};

const message = stringToU8a('abcd');

describe('secp256k1', (): void => {
  it('create keypair', (): void => {
    const keypair = secp256k1PairFromSecret(SEED);

    expect(u8aEq(keypair.secretKey, KEYPAIR.secretKey)).toEqual(true);
    expect(u8aEq(keypair.publicKey, KEYPAIR.publicKey)).toEqual(true);
  });

  it('sign and verify', (): void => {
    const signature = secp256k1Sign(message, KEYPAIR.secretKey);

    expect(secp256k1Verify(message, signature, KEYPAIR.publicKey)).toEqual(true);
  });
});

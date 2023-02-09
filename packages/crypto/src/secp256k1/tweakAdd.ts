// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN, bnToU8a, isU8a } from '@polkadot/util';

const BN_BE_256_OPTS = { bitLength: 256, isLe: false };

// pre-defined curve param as lifted form elliptic
// https://github.com/indutny/elliptic/blob/e71b2d9359c5fe9437fbf46f1f05096de447de57/lib/elliptic/curves.js#L182
const N = 'ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141'.replace(
  / /g,
  ''
);
const N_BN = new BN(N, 'hex');

function addBn(seckey: Uint8Array, tweak: Uint8Array): Uint8Array {
  const res = new BN(tweak);

  if (res.cmp(N_BN) >= 0) {
    throw new Error('Tweak parameter is out of range');
  }

  res.iadd(new BN(seckey));

  if (res.cmp(N_BN) >= 0) {
    res.isub(N_BN);
  }

  if (res.isZero()) {
    throw new Error('Invalid resulting private key');
  }

  return bnToU8a(res, BN_BE_256_OPTS);
}

export function secp256k1PrivateKeyTweakAdd(seckey: Uint8Array, tweak: Uint8Array): Uint8Array {
  if (!isU8a(seckey) || seckey.length !== 32) {
    throw new Error('Expected seckey to be an Uint8Array with length 32');
  } else if (!isU8a(tweak) || tweak.length !== 32) {
    throw new Error('Expected tweak to be an Uint8Array with length 32');
  }

  return addBn(seckey, tweak);
}

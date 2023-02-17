// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Keypair } from '../types';

import { bnToU8a, stringToU8a, u8aConcat } from '@polkadot/util';

import { hmacShaAsU8a } from '../hmac';
import { secp256k1PairFromSeed, secp256k1PrivateKeyTweakAdd } from '../secp256k1';

interface CodedKeypair extends Keypair {
  chainCode: Uint8Array;
}

const MASTER_SECRET = stringToU8a('Bitcoin seed');

const HARDENED = 0x80000000;

const BN_BE_32_OPTS = { bitLength: 32, isLe: false };

function hdValidatePath(path: string): boolean {
  if (!path.startsWith('m/')) {
    return false;
  }

  const parts = path.split('/').slice(1);

  for (const p of parts) {
    const n = /^\d+'?$/.test(p) ? parseInt(p.replace(/'$/, ''), 10) : Number.NaN;

    if (isNaN(n) || n >= HARDENED || n < 0) {
      return false;
    }
  }

  return true;
}

function createCoded(secretKey: Uint8Array, chainCode: Uint8Array): CodedKeypair {
  return {
    chainCode,
    publicKey: secp256k1PairFromSeed(secretKey).publicKey,
    secretKey
  };
}

function deriveChild(hd: CodedKeypair, index: number): CodedKeypair {
  const indexBuffer = bnToU8a(index, BN_BE_32_OPTS);
  const data =
    index >= HARDENED
      ? u8aConcat(new Uint8Array(1), hd.secretKey, indexBuffer)
      : u8aConcat(hd.publicKey, indexBuffer);

  try {
    const I = hmacShaAsU8a(hd.chainCode, data, 512);

    return createCoded(secp256k1PrivateKeyTweakAdd(hd.secretKey, I.slice(0, 32)), I.slice(32));
  } catch (err) {
    // In case parse256(IL) >= n or ki == 0, proceed with the next value for i
    return deriveChild(hd, index + 1);
  }
}

export function hdEthereum(seed: Uint8Array, path = ''): Keypair {
  const I = hmacShaAsU8a(MASTER_SECRET, seed, 512);
  let hd = createCoded(I.slice(0, 32), I.slice(32));

  if (!path || path === 'm' || path === 'M' || path === "m'" || path === "M'") {
    return hd;
  }

  if (!hdValidatePath(path)) {
    throw new Error('Invalid derivation path');
  }

  const parts = path.split('/').slice(1);

  for (const p of parts) {
    hd = deriveChild(hd, parseInt(p, 10) + (p.length > 1 && p.endsWith("'") ? HARDENED : 0));
  }

  return hd;
}

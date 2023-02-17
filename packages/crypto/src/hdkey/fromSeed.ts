// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

// References:
// https://github.com/satoshilabs/slips/blob/master/slip-0010.md
// https://github.com/satoshilabs/slips/blob/master/slip-0032.md
// https://github.com/satoshilabs/slips/blob/master/slip-0044.md

import { bnToU8a, stringToU8a, u8aConcat } from '@polkadot/util';

import { ed25519PairFromSeed } from '../ed25519';
import { hmacShaAsU8a } from '../hmac';
import { secp256k1PairFromSeed, secp256k1PrivateKeyTweakAdd } from '../secp256k1';

interface HdKey {
  chainCode: Uint8Array;
  seed: Uint8Array;
  publicKey: Uint8Array;
}

type CurveType = 'secp256k1' | 'ed25519';

const MASTER_SECRET = {
  secp256k1: stringToU8a('Bitcoin seed'),
  ed25519: stringToU8a('ed25519 seed')
};

const PublicFromType = {
  secp256k1: (seed: Uint8Array) => secp256k1PairFromSeed(seed).publicKey,
  ed25519: (seed: Uint8Array) => ed25519PairFromSeed(seed).publicKey
};

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

function createCoded(seed: Uint8Array, chainCode: Uint8Array, curve: CurveType): HdKey {
  return {
    chainCode,
    seed,
    publicKey: PublicFromType[curve](seed)
  };
}

function deriveChild(hd: HdKey, index: number, curve: CurveType): HdKey {
  const indexBuffer = bnToU8a(index, BN_BE_32_OPTS);
  const data =
    index >= HARDENED
      ? u8aConcat(new Uint8Array(1), hd.seed, indexBuffer)
      : u8aConcat(hd.publicKey, indexBuffer);

  try {
    const I = hmacShaAsU8a(hd.chainCode, data, 512);

    return createCoded(
      curve === 'secp256k1' ? secp256k1PrivateKeyTweakAdd(hd.seed, I.slice(0, 32)) : I.slice(0, 32),
      I.slice(32),
      curve
    );
  } catch (err) {
    // In case parse256(IL) >= n or ki == 0, proceed with the next value for i
    return deriveChild(hd, index + 1, curve);
  }
}

/**
 * @name hdKeyFromSeed
 * @summary create hd key by seed and path
 * @description
 * create hd key by seed and path, support `curve` with 'secp256k1' and 'ed25519', Return `HdKey` Object.
 */
export function hdKeyFromSeed(seed: Uint8Array, curve: CurveType = 'secp256k1', path = ''): HdKey {
  const I = hmacShaAsU8a(MASTER_SECRET[curve], seed, 512);
  let hd = createCoded(I.slice(0, 32), I.slice(32), curve);

  if (!path || path === 'm' || path === 'M' || path === "m'" || path === "M'") {
    return hd;
  }

  if (!hdValidatePath(path)) {
    throw new Error('Invalid derivation path');
  }

  const parts = path.split('/').slice(1);

  for (const p of parts) {
    hd = deriveChild(hd, parseInt(p, 10) + (p.length > 1 && p.endsWith("'") ? HARDENED : 0), curve);
  }

  return hd;
}

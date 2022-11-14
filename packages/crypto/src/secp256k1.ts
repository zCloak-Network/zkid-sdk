// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString, Keypair } from './types';

import { stringToU8a, u8aConcat, u8aToU8a } from '@polkadot/util';
import * as crypto from '@polkadot/util-crypto';

/**
 * @name secp256k1Sign
 * @summary Signs a message using the supplied secretKey
 * @description Returns message signature of `message`, using the supplied pair
 * @example
 * <BR>
 *
 * ```javascript
 * import { secp256k1Sign } from '@zcloak/crypto';
 *
 * secp256k1Sign([...], [...]); // => [...]
 * ```
 */
export function secp256k1Sign(
  message: HexString | Uint8Array,
  secretKey: HexString | Uint8Array
): Uint8Array {
  const messageU8a = u8aToU8a(message);
  const secretKeyU8a = u8aToU8a(secretKey);

  if (secretKeyU8a?.length !== 32) {
    throw new Error('Expected valid secp256k1 secretKey, 32-bytes');
  }

  return crypto.secp256k1Sign(messageU8a, { secretKey: secretKeyU8a }, 'keccak');
}

/**
 * @name secp256k1Verify
 * @summary Verifies the signature on the supplied message.
 * @description Verifies the `signature` of `msgHash`, using the supplied `addressOrPublicKey`
 * @example
 * <BR>
 *
 * ```javascript
 * import { secp256k1Verify } from '@zcloak/crypto';
 *
 * secp256k1Verify([...], [...], [...]); // => true/false
 * ```
 */
export function secp256k1Verify(
  msgHash: HexString | Uint8Array | string,
  signature: HexString | Uint8Array,
  addressOrPublicKey: HexString | Uint8Array
): boolean {
  const address = crypto.ethereumEncode(addressOrPublicKey);

  return crypto.secp256k1Verify(msgHash, signature, address, 'keccak');
}

/**
 * @name secp256k1PairFromSeed
 * @summary Creates a new public/secret keypair from a seed.
 * @description Returns a object containing a `publicKey` & `secretKey` generated from the supplied seed.
 * @example
 * <BR>
 *
 * ```javascript
 * import { secp256k1PairFromSeed } from '@zcloak/crypto';
 *
 * secp256k1PairFromSeed(...); // => { secretKey: [...], publicKey: [...] }
 * ```
 */
export function secp256k1PairFromSeed(seed: HexString | Uint8Array): Keypair {
  const seedU8a = u8aToU8a(seed);

  return crypto.secp256k1PairFromSeed(seedU8a);
}

export function hashMessage(message: HexString | Uint8Array): Uint8Array {
  const messageU8a = u8aToU8a(message);

  return u8aConcat(
    stringToU8a('\x19Ethereum Signed Message:\n'),
    stringToU8a(String(messageU8a.length)),
    message
  );
}

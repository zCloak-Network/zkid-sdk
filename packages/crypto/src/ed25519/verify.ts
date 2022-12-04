// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';

import { u8aToU8a } from '@polkadot/util';

import { ed25519Verify as wasmVerify } from '@zcloak/wasm';

/**
 * @name ed25519Sign
 * @summary Verifies the signature on the supplied message.
 * @description
 * Verifies the `signature` on `message` with the supplied `publicKey`. Returns `true` on sucess, `false` otherwise.
 * @example
 * <BR>
 *
 * ```javascript
 * import { ed25519Verify } from '@zcloak/crypto';
 *
 * ed25519Verify([...], [...], [...]); // => true/false
 * ```
 */
export function ed25519Verify(
  message: HexString | Uint8Array | string,
  signature: HexString | Uint8Array | string,
  publicKey: HexString | Uint8Array | string
): boolean {
  const messageU8a = u8aToU8a(message);
  const publicKeyU8a = u8aToU8a(publicKey);
  const signatureU8a = u8aToU8a(signature);

  if (publicKeyU8a.length !== 32) {
    throw new Error(`Invalid publicKey, received ${publicKeyU8a.length}, expected 32`);
  } else if (signatureU8a.length !== 64) {
    throw new Error(`Invalid signature, received ${signatureU8a.length} bytes, expected 64`);
  }

  return wasmVerify(signatureU8a, messageU8a, publicKeyU8a);
}

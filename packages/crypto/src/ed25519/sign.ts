// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';
import type { Keypair } from '../types';

import { u8aToU8a } from '@polkadot/util';

import { ed25519Sign as wasmSign } from '@zcloak/wasm';

/**
 * @name ed25519Sign
 * @summary Signs a message using the supplied secretKey
 * @description
 * Returns message signature of `message`, using the `secretKey`.
 * @example
 * <BR>
 *
 * ```javascript
 * import { ed25519Sign } from '@zcloak/crypto';
 *
 * ed25519Sign([...], [...]); // => [...]
 * ```
 */
export function ed25519Sign(
  message: HexString | Uint8Array | string,
  { publicKey, secretKey }: Keypair
): Uint8Array {
  const messageU8a = u8aToU8a(message);

  return wasmSign(publicKey, secretKey.subarray(0, 32), messageU8a);
}

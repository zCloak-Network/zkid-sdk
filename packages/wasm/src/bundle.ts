// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { allocU64a, resultU64a, wasm } from './helper';
import { WasmInstance } from './types';

type PopFirst<T extends unknown[]> = T extends [WasmInstance, ...infer N] ? N : [];

/**
 * @internal
 * @description
 * This create an extenal interface function from the signature, all the while checking
 * the actual bridge wasm interface to ensure it has been initialized.
 *
 * This means that we can call it
 *
 *   withWasm(wasm: WasmCryptoInstance, a: number, b: string) => Uint8Array
 *
 * and in this case it will create an interface function with the signarure
 *
 *   (a: number, b: string) => Uint8Array
 */
function withWasm<T, F extends (wasm: WasmInstance, ...params: never[]) => T>(
  fn: F
): (...params: PopFirst<Parameters<F>>) => ReturnType<F> {
  return (...params: PopFirst<Parameters<F>>): ReturnType<F> => {
    if (!wasm) {
      throw new Error(
        'The WASM instance has not been initialized. Ensure that you wait for the initialization Promise with initCrypto() from @zcloak/crypto.'
      );
    }

    return fn(wasm, ...params) as ReturnType<F>;
  };
}

export const rescueHash = withWasm((wasm, values: BigUint64Array): BigUint64Array => {
  const args = allocU64a(values);

  wasm.rescue_hash(...args);

  return resultU64a(args[0]);
});

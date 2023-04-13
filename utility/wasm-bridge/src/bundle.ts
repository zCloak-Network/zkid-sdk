// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { allocU64a, resultU64a, wasm } from './helper';
import { WasmInstance } from './types';

type PopFirst<T extends unknown[]> = T extends [[WasmInstance, number], ...infer N] ? N : [];

/**
 * @internal
 * @description
 * This create an extenal interface function from the signature, all the while checking
 * the actual bridge wasm interface to ensure it has been initialized.
 *
 * This means that we can call it
 *
 *   withWasm([wasm: WasmCryptoInstance, retptr: number], a: number, b: string) => Uint8Array
 *
 * and in this case it will create an interface function with the signarure
 *
 *   (a: number, b: string) => Uint8Array
 */
function withWasm<T, F extends (wasm: [WasmInstance, number], ...params: never[]) => T>(
  fn: F,
  withRetptr = true
): (...params: PopFirst<Parameters<F>>) => ReturnType<F> {
  return (...params: PopFirst<Parameters<F>>): ReturnType<F> => {
    if (!wasm) {
      throw new Error(
        'The WASM instance has not been initialized. Ensure that you wait for the initialization Promise with initCrypto() from @zcloak/crypto.'
      );
    }

    let retptr = 0;

    if (withRetptr) {
      retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    }

    try {
      const result = fn([wasm, retptr], ...params) as ReturnType<F>;

      return result;
    } finally {
      if (withRetptr) {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  };
}

export const rescuePrimeHash = withWasm(([wasm, retptr], values: BigUint64Array): BigUint64Array => {
  wasm.ext_rescue_prime_hash(retptr, ...allocU64a(values));

  return resultU64a(retptr);
});

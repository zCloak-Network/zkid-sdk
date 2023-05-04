// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { WasmInstance } from './types';
import type { WasmBridge } from './WasmBridge';

type PopFirst<T extends unknown[]> = T extends [[WasmInstance, number], ...infer N] ? N : [];

export function withWasm<T, F extends (wasm: [WasmInstance, number], ...params: never[]) => T>(
  wasmBridge: WasmBridge,
  fn: F,
  withRetptr = true
): (...params: PopFirst<Parameters<F>>) => ReturnType<F> {
  return (...params: PopFirst<Parameters<F>>): ReturnType<F> => {
    const wasm = wasmBridge.wasm;

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

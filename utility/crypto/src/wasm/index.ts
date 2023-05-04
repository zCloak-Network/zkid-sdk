// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { bytes } from '@zcloak/wasm';
import * as asmBundle from '@zcloak/wasm-asm';
import { WasmBridge, withWasm } from '@zcloak/wasm-bridge';

declare module '@zcloak/wasm-bridge/types' {
  interface WasmInstance {
    ext_rescue_prime_hash(a: number, b: number, c: number): void;
    ext_rescue_prime_optimized_hash(a: number, b: number, c: number): void;
  }
}

const wasmBridge: WasmBridge = new WasmBridge();

export const rescuePrimeHash = withWasm(wasmBridge, ([wasm, retptr], values: BigUint64Array): BigUint64Array => {
  wasm.ext_rescue_prime_hash(retptr, ...wasmBridge.allocU64a(values));

  return wasmBridge.resultU64a(retptr);
});

export const rescuePrimeOptimizedHash = withWasm(
  wasmBridge,
  ([wasm, retptr], values: BigUint64Array): BigUint64Array => {
    wasm.ext_rescue_prime_optimized_hash(retptr, ...wasmBridge.allocU64a(values));

    return wasmBridge.resultU64a(retptr);
  }
);

export async function initWasm(onlyAsm?: boolean) {
  if (onlyAsm) {
    wasmBridge.initAsm(asmBundle);
  } else {
    try {
      await wasmBridge.initWasm(bytes);
    } catch (error) {
      console.error('Can not to init wasm, try to use asm');

      wasmBridge.initAsm(asmBundle);
    }
  }
}

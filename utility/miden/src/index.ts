// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { WasmBridge, withWasm } from '@zcloak/wasm-bridge';

import { bytes } from './bytes';

declare module '@zcloak/wasm-bridge/types' {
  interface WasmInstance {
    ext_execute_zk_program(a: number, b: number, c: number, d: number, e: number, f: number, g: number): void;
    ext_generate_program_hash(a: number, b: number, c: number): void;
    ext_verify_zk_program(a: number, b: number, c: number, d: number, e: number, f: number): number;
  }
}

const wasmBridge: WasmBridge = new WasmBridge();

export async function initMidenWasm() {
  try {
    await wasmBridge.initWasm(bytes);
  } catch (error) {
    console.error('Can not to init wasm, try to use asm');
  }
}

export const executeZkProgram = withWasm(
  wasmBridge,
  ([wasm, retptr], programCode: string, stackInit: string, adviceTape: string): string => {
    wasm.ext_execute_zk_program(
      retptr,
      ...wasmBridge.allocString(programCode),
      ...wasmBridge.allocString(stackInit),
      ...wasmBridge.allocString(adviceTape)
    );

    return wasmBridge.resultString(retptr);
  }
);

export const generateProgramHash = withWasm(wasmBridge, ([wasm, retptr], programInAssembly: string): string => {
  wasm.ext_generate_program_hash(retptr, ...wasmBridge.allocString(programInAssembly));

  return wasmBridge.resultString(retptr);
});

export const verifyZkProgram = withWasm(
  wasmBridge,
  ([wasm], programHash: string, stackInputs: string, finalResult: string): number => {
    const result = wasm.ext_verify_zk_program(
      ...wasmBridge.allocString(programHash),
      ...wasmBridge.allocString(stackInputs),
      ...wasmBridge.allocString(finalResult)
    );

    return result >>> 0;
  },
  false
);

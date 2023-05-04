// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface WasmInstance {
  memory: WebAssembly.Memory;

  ext_rescue_prime_hash(a: number, b: number, c: number): void;
  ext_rescue_prime_optimized_hash(a: number, b: number, c: number): void;
  __wbindgen_add_to_stack_pointer(a: number): number;
  __wbindgen_malloc(a: number): number;
  __wbindgen_exn_store: (a: number) => void;
  __wbindgen_free(a: number, b: number): void;
  readonly wasm_bindgen__convert__closures__invoke2_mut__h119ef801543f2ea1: (
    a: number,
    b: number,
    c: number,
    d: number
  ) => void;
}

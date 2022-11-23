// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface WasmInstance {
  memory: WebAssembly.Memory;

  rescue_hash(a: number, b: number, c: number): void;

  __wbindgen_add_to_stack_pointer(a: number): number;
  __wbindgen_malloc(a: number): number;
  __wbindgen_free(a: number, b: number): void;
}

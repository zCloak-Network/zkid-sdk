// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* tslint:disable */
/* eslint-disable */
/**
* @param {BigUint64Array} values
* @returns {BigUint64Array}
*/
export function rescue_hash(values: BigUint64Array): BigUint64Array;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly rescue_hash: (a: number, b: number, c: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;


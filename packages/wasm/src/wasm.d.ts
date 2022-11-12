// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* tslint:disable */
/* eslint-disable */
/**
* @param {BigUint64Array} values
* @returns {BigUint64Array}
*/
export function rescue_hash(values: BigUint64Array): BigUint64Array;
/**
* Executes the `rescue` fucntion and returns the rescue hash result.
* IF the input is [A,B,C,D] -- [a_0,a_1,a_2,a_3, b_0,b_1,b_2,b_3, c_0,c_1,c_2,c_3, d_0,d_1,d_2,d_3]
* The input in the VM should be : [d_3,d_2,d_1,d_0, c_3,c_2,c_1,c_0, b_3,b_2,b_1,b_0, a_3,a_2,a_1,a_0,], in the VM the rescue sequense should be :
* Hash(A,B,(C,D))
*
* * `inputs` specifies the rescue input, the inputs should be a u64 array string, like: "12331231203,123949053121,39018241409...."
* *  Return the hash result Vec<u64>
* @param {string} values
* @returns {BigUint64Array}
*/
export function u64_string_rescue(values: string): BigUint64Array;
/**
* Executes the `rescue` fucntion and returns the rescue hash result.
* The inputs should be a u64vec(BigUint64Array)
* @param {BigUint64Array} values
* @returns {BigUint64Array}
*/
export function u64a_rescue(values: BigUint64Array): BigUint64Array;
/**
* convert a [u64;4] hash result(BigUint64Array) to [u8;32](Uint8Array)
* @param {BigUint64Array} values
* @returns {Uint8Array}
*/
export function u64a_to_u8a(values: BigUint64Array): Uint8Array;
/**
* convert a [u8;32](Uint8Array) hash result to [u64;4](BigUint64Array)
* @param {Uint8Array} values
* @returns {BigUint64Array}
*/
export function u8a_to_u64a(values: Uint8Array): BigUint64Array;
/**
* convert a [u64;4] string hash result to [u8;32](Uint8Array)
* @param {string} values
* @returns {Uint8Array}
*/
export function string_to_u8array(values: string): Uint8Array;
/**
* convert a [u8;32](Uint8Array) string hash result to [u64;4](BigUint64Array)
* @param {string} values
* @returns {BigUint64Array}
*/
export function string_to_u64array(values: string): BigUint64Array;
/**
*/
export function init_panic_hook(): void;
/**
* Handler for `console.log` invocations.
*
* If a test is currently running it takes the `args` array and stringifies
* it and appends it to the current output of the test. Otherwise it passes
* the arguments to the original `console.log` function, psased as
* `original`.
* @param {Array<any>} args
*/
export function __wbgtest_console_log(args: Array<any>): void;
/**
* Handler for `console.debug` invocations. See above.
* @param {Array<any>} args
*/
export function __wbgtest_console_debug(args: Array<any>): void;
/**
* Handler for `console.info` invocations. See above.
* @param {Array<any>} args
*/
export function __wbgtest_console_info(args: Array<any>): void;
/**
* Handler for `console.warn` invocations. See above.
* @param {Array<any>} args
*/
export function __wbgtest_console_warn(args: Array<any>): void;
/**
* Handler for `console.error` invocations. See above.
* @param {Array<any>} args
*/
export function __wbgtest_console_error(args: Array<any>): void;
/**
* Runtime test harness support instantiated in JS.
*
* The node.js entry script instantiates a `Context` here which is used to
* drive test execution.
*/
export class WasmBindgenTestContext {
  free(): void;
/**
* Creates a new context ready to run tests.
*
* A `Context` is the main structure through which test execution is
* coordinated, and this will collect output and results for all executed
* tests.
*/
  constructor();
/**
* Inform this context about runtime arguments passed to the test
* harness.
*
* Eventually this will be used to support flags, but for now it's just
* used to support test filters.
* @param {any[]} args
*/
  args(args: any[]): void;
/**
* Executes a list of tests, returning a promise representing their
* eventual completion.
*
* This is the main entry point for executing tests. All the tests passed
* in are the JS `Function` object that was plucked off the
* `WebAssembly.Instance` exports list.
*
* The promise returned resolves to either `true` if all tests passed or
* `false` if at least one test failed.
* @param {any[]} tests
* @returns {Promise<any>}
*/
  run(tests: any[]): Promise<any>;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly rescue_hash: (a: number, b: number, c: number) => void;
  readonly u64_string_rescue: (a: number, b: number, c: number) => void;
  readonly u64a_rescue: (a: number, b: number, c: number) => void;
  readonly u64a_to_u8a: (a: number, b: number, c: number) => void;
  readonly u8a_to_u64a: (a: number, b: number, c: number) => void;
  readonly string_to_u8array: (a: number, b: number, c: number) => void;
  readonly string_to_u64array: (a: number, b: number, c: number) => void;
  readonly init_panic_hook: () => void;
  readonly __wbg_wasmbindgentestcontext_free: (a: number) => void;
  readonly wasmbindgentestcontext_new: () => number;
  readonly wasmbindgentestcontext_args: (a: number, b: number, c: number) => void;
  readonly wasmbindgentestcontext_run: (a: number, b: number, c: number) => number;
  readonly __wbgtest_console_log: (a: number) => void;
  readonly __wbgtest_console_debug: (a: number) => void;
  readonly __wbgtest_console_info: (a: number) => void;
  readonly __wbgtest_console_warn: (a: number) => void;
  readonly __wbgtest_console_error: (a: number) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hde1490cf0cbfa00e: (a: number, b: number, c: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly wasm_bindgen__convert__closures__invoke2_mut__hf339f71b2bb7130a: (a: number, b: number, c: number, d: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;


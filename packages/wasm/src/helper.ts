// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { WasmInstance } from './types';

import { hexToU8a } from '@polkadot/util';

import * as asm from './asm';
import { bytes } from './bytes';

export let wasm: WasmInstance;
let cachedBigUint64 = new BigUint64Array();
let cachedInt32 = new Int32Array();

export async function initWasm(onlyAsm = false) {
  if (wasm) return;

  if (onlyAsm) {
    wasm = asm as unknown as WasmInstance;
  } else {
    try {
      const source = await WebAssembly.instantiate(hexToU8a(bytes));

      wasm = source.instance.exports as unknown as WasmInstance;
    } catch {
      wasm = asm as unknown as WasmInstance;
    }
  }
}

function getUint64(): BigUint64Array {
  if (cachedBigUint64.byteLength === 0) {
    cachedBigUint64 = new BigUint64Array(wasm.memory.buffer);
  }

  return cachedBigUint64;
}

function getInt32(): Int32Array {
  if (cachedInt32.byteLength === 0) {
    cachedInt32 = new Int32Array(wasm.memory.buffer);
  }

  return cachedInt32;
}

function getU64a(ptr: number, len: number): BigUint64Array {
  return getUint64().subarray(ptr / 8, ptr / 8 + len);
}

export function allocU64a(value: BigUint64Array): [number, number, number] {
  const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
  const ptr = wasm.__wbindgen_malloc(value.length * 8);

  getUint64().set(value, ptr / 8);

  return [retptr, ptr, value.length];
}

export function resultU64a(retptr: number): BigUint64Array {
  const r0 = getInt32()[retptr / 4 + 0];
  const r1 = getInt32()[retptr / 4 + 1];
  const v1 = getU64a(r0, r1).slice();

  wasm.__wbindgen_free(r0, r1 * 8);

  return v1;
}

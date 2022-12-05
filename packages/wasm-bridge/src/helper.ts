// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { WasmInstance } from './types';

import { hexToU8a, stringToU8a, u8aToString } from '@polkadot/util';

export let wasm: WasmInstance;

let cacheU8a = new Uint8Array();
let cachedBigUint64 = new BigUint64Array();
let cachedInt32 = new Int32Array();

export async function initWasm(onlyAsm?: any) {
  if (wasm) return;

  if (onlyAsm) {
    const asmBundle = await import('@zcloak/wasm-asm');

    wasm = asmBundle as unknown as WasmInstance;
  } else {
    try {
      const wasmBundle = await import('@zcloak/wasm');
      const source = await WebAssembly.instantiate(hexToU8a(wasmBundle.bytes));

      wasm = source.instance.exports as unknown as WasmInstance;
    } catch (e) {
      console.error('Can not to init wasm, try to use asm');

      const asmBundle = await import('@zcloak/wasm-asm');

      wasm = asmBundle as unknown as WasmInstance;
    }
  }
}

function getUint8() {
  if (cacheU8a.byteLength === 0) {
    cacheU8a = new Uint8Array(wasm.memory.buffer);
  }

  return cacheU8a;
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

function getU8a(ptr: number, len: number): Uint8Array {
  return getUint8().subarray(ptr, ptr + len);
}

function getU64a(ptr: number, len: number): BigUint64Array {
  return getUint64().subarray(ptr / 8, ptr / 8 + len);
}

export function allocU8a(value: Uint8Array): [number, number] {
  const ptr = wasm.__wbindgen_malloc(value.length);

  getUint8().set(value, ptr);

  return [ptr, value.length];
}

export function allocString(value: string): [number, number] {
  return allocU8a(stringToU8a(value));
}

export function allocU64a(value: BigUint64Array): [number, number] {
  const ptr = wasm.__wbindgen_malloc(value.length * 8);

  getUint64().set(value, ptr / 8);

  return [ptr, value.length];
}

export function resultU8a(retptr: number): Uint8Array {
  const r0 = getInt32()[retptr / 4 + 0];
  const r1 = getInt32()[retptr / 4 + 1];
  const v1 = getU8a(r0, r1).slice();

  wasm.__wbindgen_free(r0, r1);

  return v1;
}

export function resultString(retptr: number): string {
  return u8aToString(resultU8a(retptr));
}

export function resultU64a(retptr: number): BigUint64Array {
  const r0 = getInt32()[retptr / 4 + 0];
  const r1 = getInt32()[retptr / 4 + 1];
  const v1 = getU64a(r0, r1).slice();

  wasm.__wbindgen_free(r0, r1 * 8);

  return v1;
}

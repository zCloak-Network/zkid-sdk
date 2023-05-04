// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { WasmInstance } from './types';

import { hexToU8a, stringToU8a, u8aToString } from '@polkadot/util';

export class WasmBridge {
  public wasm: WasmInstance | undefined;

  #cacheU8a = new Uint8Array();
  #cachedBigUint64 = new BigUint64Array();
  #cachedInt32 = new Int32Array();
  #heap = new Array(32).fill(undefined);
  #heapNext = this.#heap.length;

  private getUint8() {
    if (this.#cacheU8a.byteLength === 0) {
      this.#cacheU8a = new Uint8Array(this.wasm!.memory.buffer);
    }

    return this.#cacheU8a;
  }

  private getUint64(): BigUint64Array {
    if (this.#cachedBigUint64.byteLength === 0) {
      this.#cachedBigUint64 = new BigUint64Array(this.wasm!.memory.buffer);
    }

    return this.#cachedBigUint64;
  }

  private getInt32(): Int32Array {
    if (this.#cachedInt32.byteLength === 0) {
      this.#cachedInt32 = new Int32Array(this.wasm!.memory.buffer);
    }

    return this.#cachedInt32;
  }

  private getU8a(ptr: number, len: number): Uint8Array {
    return this.getUint8().subarray(ptr, ptr + len);
  }

  private getU64a(ptr: number, len: number): BigUint64Array {
    return this.getUint64().subarray(ptr / 8, ptr / 8 + len);
  }

  public allocU8a(value: Uint8Array): [number, number] {
    const ptr = this.wasm!.__wbindgen_malloc(value.length);

    this.getUint8().set(value, ptr);

    return [ptr, value.length];
  }

  public allocString(value: string): [number, number] {
    return this.allocU8a(stringToU8a(value));
  }

  public allocU64a(value: BigUint64Array): [number, number] {
    const ptr = this.wasm!.__wbindgen_malloc(value.length * 8);

    this.getUint64().set(value, ptr / 8);

    return [ptr, value.length];
  }

  public resultU8a(retptr: number): Uint8Array {
    const r0 = this.getInt32()[retptr / 4 + 0];
    const r1 = this.getInt32()[retptr / 4 + 1];
    const v1 = this.getU8a(r0, r1).slice();

    this.wasm!.__wbindgen_free(r0, r1);

    return v1;
  }

  public resultString(retptr: number): string {
    return u8aToString(this.resultU8a(retptr));
  }

  public resultU64a(retptr: number): BigUint64Array {
    const r0 = this.getInt32()[retptr / 4 + 0];
    const r1 = this.getInt32()[retptr / 4 + 1];
    const v1 = this.getU64a(r0, r1).slice();

    this.wasm!.__wbindgen_free(r0, r1 * 8);

    return v1;
  }

  public addHeapObject(obj: any) {
    if (this.#heapNext === this.#heap.length) this.#heap.push(this.#heap.length + 1);
    const idx = this.#heapNext;

    this.#heapNext = this.#heap[idx];

    this.#heap[idx] = obj;

    return idx;
  }

  public getObject(idx: number) {
    return this.#heap[idx];
  }

  public dropObject(idx: number) {
    if (idx < 36) return;
    this.#heap[idx] = this.#heapNext;
    this.#heapNext = idx;
  }

  public takeObject(idx: number) {
    const ret = this.getObject(idx);

    this.dropObject(idx);

    return ret;
  }

  public async initWasm(wasmBytes: string): Promise<void> {
    if (this.wasm) return;

    try {
      const source = await WebAssembly.instantiate(hexToU8a(wasmBytes));

      this.wasm = source.instance.exports as unknown as WasmInstance;
    } catch (e) {
      console.error('Can not to init wasm, try to use asm');
    }
  }

  public initAsm(asmBundle: unknown): void {
    if (this.wasm) return;

    if (asmBundle) {
      this.wasm = asmBundle as WasmInstance;
    }
  }
}

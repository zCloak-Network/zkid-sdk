// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

// The Record<string, unknown> unknown part here is for not-everywhere globals
// such as `Buffer` (that won't exist is deno/window global environments)
type GlobalThis = typeof globalThis & Record<string, unknown>;

/** @internal Last-resort "this", if it gets here it probably would fail anyway */
function evaluateThis(fn: (code: string) => unknown): unknown {
  return fn('return this');
}

export const xglobal = /* #__PURE__ */ (
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof global !== 'undefined'
    ? global
    : typeof self !== 'undefined'
    ? self
    : typeof window !== 'undefined'
    ? window
    : evaluateThis(Function)
) as GlobalThis;

// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface WasmInstance {
  memory: WebAssembly.Memory;

  ext_ed_from_seed(a: number, b: number, c: number): void;
  ext_ed_sign(a: number, b: number, c: number, d: number, e: number, f: number, g: number): void;
  ext_ed_verify(a: number, b: number, c: number, d: number, e: number, f: number): number;
  ext_rescue_prime_hash(a: number, b: number, c: number): void;
  ext_blake2b(a: number, b: number, c: number, d: number, e: number, f: number): void;
  ext_hmac_sha256(a: number, b: number, c: number, d: number, e: number): void;
  ext_hmac_sha512(a: number, b: number, c: number, d: number, e: number): void;
  ext_keccak256(a: number, b: number, c: number): void;
  ext_keccak512(a: number, b: number, c: number): void;
  ext_pbkdf2(a: number, b: number, c: number, d: number, e: number, f: number): void;
  ext_scrypt(
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
    g: number,
    h: number
  ): void;
  ext_sha256(a: number, b: number, c: number): void;
  ext_sha512(a: number, b: number, c: number): void;
  ext_secp_pub_compress(a: number, b: number, c: number): void;
  ext_secp_pub_expand(a: number, b: number, c: number): void;
  ext_secp_from_seed(a: number, b: number, c: number): void;
  ext_secp_recover(a: number, b: number, c: number, d: number, e: number, f: number): void;
  ext_secp_sign(a: number, b: number, c: number, d: number, e: number): void;

  rustsecp256k1_v0_4_1_context_create(a: number): number;
  rustsecp256k1_v0_4_1_context_destroy(a: number): void;
  rustsecp256k1_v0_4_1_default_illegal_callback_fn(a: number, b: number): void;
  rustsecp256k1_v0_4_1_default_error_callback_fn(a: number, b: number): void;
  __wbindgen_add_to_stack_pointer(a: number): number;
  __wbindgen_malloc(a: number): number;
  __wbindgen_free(a: number, b: number): void;
}

// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { allocU8a, allocU64a, resultU8a, resultU64a, wasm } from './helper';
import { WasmInstance } from './types';

type PopFirst<T extends unknown[]> = T extends [[WasmInstance, number], ...infer N] ? N : [];

/**
 * @internal
 * @description
 * This create an extenal interface function from the signature, all the while checking
 * the actual bridge wasm interface to ensure it has been initialized.
 *
 * This means that we can call it
 *
 *   withWasm([wasm: WasmCryptoInstance, retptr: number], a: number, b: string) => Uint8Array
 *
 * and in this case it will create an interface function with the signarure
 *
 *   (a: number, b: string) => Uint8Array
 */
function withWasm<T, F extends (wasm: [WasmInstance, number], ...params: never[]) => T>(
  fn: F,
  withRetptr = true
): (...params: PopFirst<Parameters<F>>) => ReturnType<F> {
  return (...params: PopFirst<Parameters<F>>): ReturnType<F> => {
    if (!wasm) {
      throw new Error(
        'The WASM instance has not been initialized. Ensure that you wait for the initialization Promise with initCrypto() from @zcloak/crypto.'
      );
    }

    let retptr = 0;

    if (withRetptr) {
      retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    }

    try {
      const result = fn([wasm, retptr], ...params) as ReturnType<F>;

      return result;
    } finally {
      if (withRetptr) {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  };
}

export const ed25519KeypairFromSeed = withWasm(([wasm, retptr], seed: Uint8Array): Uint8Array => {
  wasm.ext_ed_from_seed(retptr, ...allocU8a(seed));

  return resultU8a(retptr);
});

export const ed25519Sign = withWasm(
  ([wasm, retptr], pubkey: Uint8Array, seckey: Uint8Array, message: Uint8Array): Uint8Array => {
    wasm.ext_ed_sign(retptr, ...allocU8a(pubkey), ...allocU8a(seckey), ...allocU8a(message));

    return resultU8a(retptr);
  }
);

export const ed25519Verify = withWasm(
  ([wasm], signature: Uint8Array, message: Uint8Array, pubkey: Uint8Array): boolean => {
    const ret = wasm.ext_ed_verify(
      ...allocU8a(signature),
      ...allocU8a(message),
      ...allocU8a(pubkey)
    );

    return ret !== 0;
  },
  false
);

export const secp256k1FromSeed = withWasm(([wasm, retptr], seckey: Uint8Array): Uint8Array => {
  wasm.ext_secp_from_seed(retptr, ...allocU8a(seckey));

  return resultU8a(retptr);
});

export const secp256k1Compress = withWasm(([wasm, retptr], pubkey: Uint8Array): Uint8Array => {
  wasm.ext_secp_pub_compress(retptr, ...allocU8a(pubkey));

  return resultU8a(retptr);
});

export const secp256k1Expand = withWasm(([wasm, retptr], pubkey: Uint8Array): Uint8Array => {
  wasm.ext_secp_pub_expand(retptr, ...allocU8a(pubkey));

  return resultU8a(retptr);
});

export const secp256k1Recover = withWasm(
  ([wasm, retptr], msgHash: Uint8Array, sig: Uint8Array, recovery: number): Uint8Array => {
    wasm.ext_secp_recover(retptr, ...allocU8a(msgHash), ...allocU8a(sig), recovery);

    return resultU8a(retptr);
  }
);

export const secp256k1Sign = withWasm(
  ([wasm, retptr], msgHash: Uint8Array, seckey: Uint8Array): Uint8Array => {
    wasm.ext_secp_sign(retptr, ...allocU8a(msgHash), ...allocU8a(seckey));

    return resultU8a(retptr);
  }
);

export const rescuePrimeHash = withWasm(
  ([wasm, retptr], values: BigUint64Array): BigUint64Array => {
    wasm.ext_rescue_prime_hash(retptr, ...allocU64a(values));

    return resultU64a(retptr);
  }
);

export const blake2b = withWasm(
  ([wasm, retptr], data: Uint8Array, key: Uint8Array, size: number): Uint8Array => {
    wasm.ext_blake2b(retptr, ...allocU8a(data), ...allocU8a(key), size);

    return resultU8a(retptr);
  }
);

export const hmacSha256 = withWasm(
  ([wasm, retptr], key: Uint8Array, data: Uint8Array): Uint8Array => {
    wasm.ext_hmac_sha256(retptr, ...allocU8a(key), ...allocU8a(data));

    return resultU8a(retptr);
  }
);

export const hmacSha512 = withWasm(
  ([wasm, retptr], key: Uint8Array, data: Uint8Array): Uint8Array => {
    wasm.ext_hmac_sha512(retptr, ...allocU8a(key), ...allocU8a(data));

    return resultU8a(retptr);
  }
);

export const keccak256 = withWasm(([wasm, retptr], data: Uint8Array): Uint8Array => {
  wasm.ext_keccak256(retptr, ...allocU8a(data));

  return resultU8a(retptr);
});

export const keccak512 = withWasm(([wasm, retptr], data: Uint8Array): Uint8Array => {
  wasm.ext_keccak512(retptr, ...allocU8a(data));

  return resultU8a(retptr);
});

export const pbkdf2 = withWasm(
  ([wasm, retptr], data: Uint8Array, salt: Uint8Array, rounds: number): Uint8Array => {
    wasm.ext_pbkdf2(retptr, ...allocU8a(data), ...allocU8a(salt), rounds);

    return resultU8a(retptr);
  }
);

export const scrypt = withWasm(
  (
    [wasm, retptr],
    password: Uint8Array,
    salt: Uint8Array,
    log2n: number,
    r: number,
    p: number
  ): Uint8Array => {
    wasm.ext_scrypt(retptr, ...allocU8a(password), ...allocU8a(salt), log2n, r, p);

    return resultU8a(retptr);
  }
);

export const sha256 = withWasm(([wasm, retptr], data: Uint8Array): Uint8Array => {
  wasm.ext_sha256(retptr, ...allocU8a(data));

  return resultU8a(retptr);
});

export const sha512 = withWasm(([wasm, retptr], data: Uint8Array): Uint8Array => {
  wasm.ext_sha512(retptr, ...allocU8a(data));

  return resultU8a(retptr);
});

// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';

import {
  blake2AsU8a,
  blake3AsU8a,
  keccak256AsU8a,
  keccak512AsU8a,
  rescueAsU8a,
  sha256AsU8a,
  sha512AsU8a
} from '@zcloak/crypto';

// hashes function map
export const HASHER = {
  Rescue: (data: Uint8Array | HexString | string, asU64a = false) => rescueAsU8a(data, asU64a),
  Blake2: (
    data: Uint8Array | HexString | string,
    bitLength?: 64 | 128 | 256 | 384 | 512,
    key?: Uint8Array | null
  ) => blake2AsU8a(data, bitLength, key),
  Blake3: (
    data: Uint8Array | HexString | string,
    bitLength?: 64 | 128 | 256 | 384 | 512,
    key?: Uint8Array | null
  ) => blake3AsU8a(data, bitLength, key),
  Keccak256: (data: Uint8Array | HexString | string) => keccak256AsU8a(data),
  Keccak512: (data: Uint8Array | HexString | string) => keccak512AsU8a(data),
  Sha256: (data: Uint8Array | HexString | string) => sha256AsU8a(data),
  Sha512: (data: Uint8Array | HexString | string) => sha512AsU8a(data)
};

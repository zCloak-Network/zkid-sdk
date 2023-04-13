// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

export const PKCS8_DIVIDER = new Uint8Array([161, 35, 3, 33, 0]);
export const PKCS8_HEADER = new Uint8Array([48, 83, 2, 1, 1, 48, 5, 6, 3, 43, 101, 112, 4, 34, 4, 32]);

export const SCRYPT_LENGTH = 32 + 3 * 4;

export const NONCE_LENGTH = 24;

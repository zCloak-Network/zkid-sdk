// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

export type HexString = `0x${string}`;

export interface Keypair {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
}

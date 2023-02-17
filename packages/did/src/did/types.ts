// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

export type KeyGen = {
  // the identifier publicKey
  identifier: Uint8Array;
  /**
   * `keys[0]`, ed25519 or ecdsa
   * `keys[1]`, x25519
   */
  keys: [Uint8Array, Uint8Array];
};

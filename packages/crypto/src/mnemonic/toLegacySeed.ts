// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { mnemonicToSeedSync } from 'bip39';

import { mnemonicValidate } from './validate';

/**
 * @name mnemonicToLegacySeed
 * @summary Creates a valid Ethereum/Bitcoin-compatible seed from a mnemonic input
 * @example
 * <BR>
 *
 * ```javascript
 * import { mnemonicGenerate, mnemonicToLegacySeed, mnemonicValidate } from '@zcloak/crypto';
 *
 * const mnemonic = mnemonicGenerate(); // => string
 * const isValidMnemonic = mnemonicValidate(mnemonic); // => boolean
 *
 * if (isValidMnemonic) {
 *   console.log(`Seed generated from mnemonic: ${mnemonicToLegacySeed(mnemonic)}`); => u8a
 * }
 * ```
 */
export function mnemonicToLegacySeed(mnemonic: string, password?: string): Uint8Array {
  if (!mnemonicValidate(mnemonic)) {
    throw new Error('Invalid bip39 mnemonic specified');
  }

  return mnemonicToSeedSync(mnemonic, password);
}

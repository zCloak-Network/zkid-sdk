// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { entropyToMnemonic } from 'bip39';

import { randomAsU8a } from '../random';

/**
 * @name mnemonicGenerate
 * @summary Creates a valid mnemonic string using using [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki).
 * @example
 * <BR>
 *
 * ```javascript
 * import { mnemonicGenerate } from '@zcloak/crypto';
 *
 * const mnemonic = mnemonicGenerate(); // => string
 * ```
 */
export function mnemonicGenerate(numWords: 12 | 15 | 18 | 21 | 24 = 12): string {
  return entropyToMnemonic(Buffer.from(randomAsU8a((numWords / 3) * 4)));
}

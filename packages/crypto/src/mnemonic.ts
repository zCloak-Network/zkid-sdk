import * as crypto from '@polkadot/util-crypto';

export function validateMnemonic(mnemonic: string) {
  return crypto.mnemonicValidate(mnemonic);
}

export function mnemonicToLegacySeed(mnemonic: string, passphrase?: string) {
  return crypto.mnemonicToLegacySeed(mnemonic, passphrase, false, 64);
}

export function mnemonicToMiniSecret(mnemonic: string, passphrase?: string) {
  return crypto.mnemonicToMiniSecret(mnemonic, passphrase);
}

export function generateMnemonic(words: 12 | 15 | 18 | 21 | 24 = 12): string {
  return crypto.mnemonicGenerate(words);
}

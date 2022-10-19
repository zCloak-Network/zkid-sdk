import * as bip39 from 'ethereum-cryptography/bip39';
import { wordlist } from 'ethereum-cryptography/bip39/wordlists/english';
import { randomBytes } from 'tweetnacl';

export function entropyToMnemonic(entropy: Uint8Array) {
  return bip39.entropyToMnemonic(entropy, wordlist);
}

export function validateMnemonic(mnemonic: string) {
  return bip39.validateMnemonic(mnemonic, wordlist);
}

export function mnemonicToSeed(mnemonic: string, passphrase?: string) {
  return bip39.mnemonicToSeedSync(mnemonic, passphrase);
}

export function generateMnemonic(words: 12 | 15 | 18 | 21 | 24 = 12): string {
  return entropyToMnemonic(randomBytes((words / 3) * 4));
}

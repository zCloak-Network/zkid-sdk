export type HexString = `0x${string}`;

export type KeypairType = 'ecdsa' | 'ed25519' | 'x25519';

export interface KeyringPair$Json {
  encoded: HexString | string;
}

export interface KeyringPair {
  readonly isLocked: boolean;
  readonly publicKey: Uint8Array;
  readonly type: KeypairType;

  lock(): void;
  sign(message: HexString | string | Uint8Array): Uint8Array;
  toJson(passphrase?: string): KeyringPair$Json;
  unlock(passphrase?: string): void;
  encrypt(
    message: HexString | string | Uint8Array,
    recipientPublicKey: HexString | string | Uint8Array,
    nonce?: Uint8Array
  ): Uint8Array;
  decrypt(
    encryptedMessageWithNonce: HexString | string | Uint8Array,
    senderPublicKey: HexString | string | Uint8Array
  ): Uint8Array | null;
}

export interface KeyringPairs {
  add: (pair: KeyringPair) => KeyringPair;
  all: () => KeyringPair[];
  get: (publicKey: HexString | Uint8Array) => KeyringPair;
  remove: (publicKey: HexString | Uint8Array) => void;
}

export interface KeyringInstance {
  readonly pairs: KeyringPair[];
  readonly publicKeys: Uint8Array[];

  addPair(pair: KeyringPair): KeyringPair;
  addFromJson(pair: KeyringPair$Json): KeyringPair;
  addFromMnemonic(mnemonic: string, type?: KeypairType): KeyringPair;
  addFromSeed(seed: Uint8Array, type?: KeypairType): KeyringPair;
  createFromJson(json: KeyringPair$Json): KeyringPair;
  createFromMnemonic(mnemonic: string, type?: KeypairType): KeyringPair;
  createFromSeed(seed: Uint8Array, type?: KeypairType): KeyringPair;
  getPair(publicKey: HexString | Uint8Array): KeyringPair;
  getPairs(): KeyringPair[];
  getPublicKeys(): Uint8Array[];
  removePair(publicKey: HexString | Uint8Array): void;
  toJson(publicKey: HexString | Uint8Array, passphrase?: string): KeyringPair$Json;
}

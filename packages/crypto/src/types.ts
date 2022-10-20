export type HexString = `0x${string}`;

export interface Keypair {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
}

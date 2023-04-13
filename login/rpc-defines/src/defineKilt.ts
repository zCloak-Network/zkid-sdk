// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '@zcloak/login-rpc/rpcs';

import type { DidUri, ICredential } from '@kiltprotocol/types';

type HexString = `0x${string}`;

export type DidSignature = {
  keyUri: DidUri;
  signature: string;
};

export type DidInfo = {
  didUri: DidUri;
  authenticationKey: HexString;
  encryptionKey: HexString[];
  attestationKey?: HexString;
  delegationKey?: HexString;
};

export type CredentialDigest = {
  rootHash: HexString;
  ctypeHash: HexString;
  attested: boolean;
  revoked: boolean;
  owner: DidUri;
  attester: DidUri;
  claimerSignature: DidSignature;
  challenge: string;
};

export type ZkpGenResponse = {
  outputs: number[];
  starkproof: unknown;
  programHash: HexString;
  ctype: HexString;
  attester: DidUri;
};

export type RequestCredentialDigestParams = {
  challenge: string;
  ctypehash?: HexString;
  attester?: DidUri;
};

export type RequestCredentialContentParams = {
  challenge: string;
  contentKeys?: string[];
  ctypehash?: HexString;
  attester?: DidUri;
};

export type DidLoginParams = {
  payload: HexString;
};

export type DidSignParams = {
  keyId?: string;
  payload: HexString;
};

export type DidEncryptParams = {
  receiver: DidUri;
  message: HexString;
};

export type DidDecryptParams = {
  sender: DidUri;
  message: HexString;
};

export type ZkpGenRequest = {
  ctype?: HexString;
  attester?: DidUri;
  program: string;
};

declare module '@zcloak/login-rpc/rpcs' {
  interface Rpcs {
    wallet_requestAuth$Kilt: [undefined, boolean];
    wallet_requestAuthAndLogin$Kilt: [undefined, DidSignature];
    wallet_isAuth$Kilt: [undefined, boolean];
    wallet_isLocked$Kilt: [boolean, boolean];
    did_getCurrent$Kilt: [undefined, DidInfo];
    did_requestCredentialDigest$Kilt: [RequestCredentialDigestParams, CredentialDigest];
    did_requestCredentialContent$Kilt: [RequestCredentialContentParams, ICredential];
    did_login$Kilt: [DidLoginParams, DidSignature];
    did_sign$Kilt: [DidSignParams, DidSignature];
    did_encrypt$Kilt: [DidEncryptParams, Uint8Array];
    did_decrypt$Kilt: [DidDecryptParams, Uint8Array];
    proof_generate$Kilt: [ZkpGenResponse, ZkpGenResponse];
  }
}

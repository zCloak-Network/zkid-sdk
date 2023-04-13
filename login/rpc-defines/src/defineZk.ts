// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '@zcloak/login-rpc/rpcs';

import type { DidKeys } from '@zcloak/did/types';
import type { DidDocument, DidUrl, SignatureType, VerificationMethodType } from '@zcloak/did-resolver/types';
import type { VerifiablePresentation } from '@zcloak/vc/types';

export type HexString = `0x${string}`;

export type DidSignature = {
  id: DidUrl;
  type: SignatureType;
  signature: string;
};

export type DidInfo = {
  didUri: DidUrl;
  document: DidDocument;
  authenticationKey: HexString;
  encryptionKey: HexString[];
  attestationKey?: HexString;
  delegationKey?: HexString;
};

export type DidEncrypted = {
  senderUrl: DidUrl;
  receiverUrl: DidUrl;
  type: VerificationMethodType;
  data: HexString;
};

export type ZkpGenResponse = {
  outputs: number[];
  starkproof: unknown;
  programHash: HexString;
  ctype: HexString;
  attester: DidUrl;
};

export type RequestCredentialDigestParams = {
  challenge: string;
  ctypehash?: HexString;
  attester?: DidUrl;
};

export type RequestCredentialContentParams = {
  challenge: string;
  contentKeys?: string[];
  ctypehash?: HexString;
  attester?: DidUrl;
};

export type DidLoginParams = {
  payload: HexString;
};

export type DidSignParams = {
  keyId?: DidUrl | Exclude<DidKeys, 'keyAgreement'>;
  payload: HexString;
};

export type DidEncryptParams = {
  receiver: DidUrl;
  message: HexString;
};

export type DidDecryptParams = {
  sender: DidUrl;
  message: HexString;
};

export type ZkpGenRequest = {
  ctype?: HexString;
  attester?: DidUrl;
  program: string;
};

declare module '@zcloak/login-rpc/rpcs' {
  interface Rpcs {
    wallet_requestAuth: [undefined, boolean];
    wallet_requestAuthAndLogin: [DidLoginParams, DidSignature];
    wallet_isAuth: [undefined, boolean];
    wallet_isLocked: [undefined, boolean];
    did_getCurrent: [undefined, DidInfo];
    did_requestCredentialDigest: [RequestCredentialDigestParams, VerifiablePresentation];
    did_requestCredentialContent: [RequestCredentialContentParams, VerifiablePresentation];
    did_login: [DidLoginParams, DidSignature];
    did_sign: [DidSignParams, DidSignature];
    did_encrypt: [DidEncryptParams, DidEncrypted];
    did_decrypt: [DidDecryptParams, HexString];
    proof_generate: [ZkpGenRequest, ZkpGenResponse];
  }

  interface RpcEvents {
    zkID_Wallet_lock: any;
    zkID_Wallet_unlock: any;
    zkID_Wallet_didLoggedChanged: DidInfo;
  }
}

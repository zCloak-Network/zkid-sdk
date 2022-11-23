// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidUrl } from '@zcloak/did-resolver/types';

import { RawCredential, VerifiableCredential, VerifiablePresentation } from '@zcloak/vc/types';

export type MessageVersion = '1' | '2';

export type Reject<T extends object> = {
  reason: string;
} & T;

export type RequestVP = {
  issuers?: DidUrl[];
  ctypes?: HexString[];
};

export type RejectAttestation = Reject<{
  ctype: HexString;
  holder: DidUrl;
}>;

export type RejectVP = Reject<{
  issuers?: DidUrl[];
  ctypes?: HexString[];
}>;

export type MessageData = {
  Request_Attestation: RawCredential;
  Response_Approve_Attestation: VerifiableCredential;
  Response_Reject_Attestation: RejectAttestation;
  Reqeust_VP: RequestVP;
  Response_Accept_VP: VerifiablePresentation;
  Response_Reject_VP: RejectVP;
  Send_VP: VerifiablePresentation;
  Send_issuedVC: VerifiableCredential;
};

export type MessageType = keyof MessageData;

export interface BaseMessage<T extends MessageType> {
  id: string;
  reply?: string;
  createTime: number;
  version: MessageVersion;
  msgType: T;
  sender: DidUrl;
  receiver: DidUrl;
  ctype?: HexString;
  // since version 2
  signer?: DidUrl;
  signature?: string;
}

export interface Message<T extends MessageType> extends BaseMessage<T> {
  encryptedMsg: string;
}

export interface DecryptedMessage<T extends MessageType> extends BaseMessage<T> {
  data: MessageData[T];
}

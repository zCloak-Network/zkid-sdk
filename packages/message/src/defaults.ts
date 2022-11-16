// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { MessageType, MessageVersion } from './types';

export const DEFAULT_MESSAGE_VERSION: MessageVersion = '1';

export const SUPPORT_MESSAGE_TYPES: MessageType[] = [
  'Request_Attestation',
  'Response_Approve_Attestation',
  'Response_Reject_Attestation',
  'Reqeust_VP',
  'Response_Accept_VP',
  'Response_Reject_VP',
  'Send_VP',
  'Send_issuedVC'
];

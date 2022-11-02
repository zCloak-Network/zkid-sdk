// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidUrl } from '@zcloak/did-resolver/types';
import type { AnyJson, Proof } from '../types';

export interface ICredential {
  context: string[];
  ctype: HexString;
  issuanceDate: number;
  expirationDate?: number;
  credentialSubject: AnyJson;
  issuer: DidUrl;
  holder: DidUrl;
  proof: Proof;
}

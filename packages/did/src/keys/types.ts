// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DidUrl } from '@zcloak/did-resolver/types';
import type { KeyringPair$Json } from '@zcloak/keyring/types';

export type DidKeys$JsonVersion = '1';

export interface DidKeys$Json {
  didUrl: DidUrl;
  version: DidKeys$JsonVersion;
  identifierKey: KeyringPair$Json;
  keys: KeyringPair$Json[];
  authentication: DidUrl[];
  assertionMethod: DidUrl[];
  keyAgreement: DidUrl[];
  capabilityInvocation: DidUrl[];
  capabilityDelegation: DidUrl[];
}

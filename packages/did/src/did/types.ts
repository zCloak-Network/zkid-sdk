// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DidUrl, VerificationMethodType } from '@zcloak/did-resolver/types';

// @internal generate keys
export type KeyGen = {
  // the identifier publicKey
  identifier: Uint8Array;
  /**
   * `keys[0]`, ed25519 or ecdsa
   * `keys[1]`, x25519
   */
  keys: [Uint8Array, Uint8Array];
};

export type SignedData = {
  id: DidUrl;
  type: VerificationMethodType;
  signature: Uint8Array;
};

export type DidKeys =
  | 'authentication'
  | 'assertionMethod'
  | 'keyAgreement'
  | 'capabilityInvocation'
  | 'capabilityDelegation';

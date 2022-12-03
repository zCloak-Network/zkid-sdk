// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringPair } from '@zcloak/keyring/types';
import type { Did } from '../did';
import type { DidKeys$Json } from './types';

import { assert } from '@polkadot/util';

import { ethereumEncode } from '@zcloak/crypto';
import { Keyring } from '@zcloak/keyring';

import { DEFAULT_DID_KEYS_JSON_VERSION } from './defaults';

export function getEcdsaIdentifierPair(keyring: Keyring, did: Did): KeyringPair | undefined {
  const identifierPair = keyring
    .getPairs()
    .find((pair) => ethereumEncode(pair.publicKey) === did.identifier);

  return identifierPair;
}

export function backup(keyring: Keyring, did: Did, password: string): DidKeys$Json {
  const identifierPair = getEcdsaIdentifierPair(keyring, did);

  assert(identifierPair, 'no identifier pair found');

  return {
    didUrl: did.id,
    version: DEFAULT_DID_KEYS_JSON_VERSION,
    identifierKey: identifierPair.toJson(password),
    keys: Array.from(did.keyRelationship.values()).map(({ publicKey }) => {
      const pair = did.getPair(publicKey);

      return pair.toJson(password);
    }),
    authentication: Array.from(did.authentication ?? []),
    assertionMethod: Array.from(did.assertionMethod ?? []),
    keyAgreement: Array.from(did.keyAgreement ?? []),
    capabilityInvocation: Array.from(did.capabilityInvocation ?? []),
    capabilityDelegation: Array.from(did.capabilityDelegation ?? [])
  };
}

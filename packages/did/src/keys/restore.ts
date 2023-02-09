// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DidUrl } from '@zcloak/did-resolver/types';
import type { Keyring } from '@zcloak/keyring';
import type { DidKeys$Json } from './types';

import { Did } from '../did';
import { create } from '../did/helpers';
import { IDidDetails, KeyRelationship } from '../types';
import { typeTransform } from '../utils';

export function restore(keyring: Keyring, json: DidKeys$Json, password: string): Did {
  const keyRelationship = new Map<DidUrl, KeyRelationship>();

  json.keys.forEach((key, index) => {
    const pair = keyring.addFromJson(key);

    pair.unlock(password);

    const id: DidUrl = `${json.didUrl}#key-${index}`;
    const controller: DidUrl[] = [`${json.didUrl}`];
    const publicKey = pair.publicKey;

    keyRelationship.set(id, {
      id,
      controller,
      publicKey,
      type: typeTransform(pair.type)
    });
  });
  const pair = keyring.addFromJson(json.identifierKey);

  pair.unlock(password);

  const details: IDidDetails = {
    id: json.didUrl,
    controller: new Set([json.didUrl]),
    keyRelationship,
    authentication: new Set(json.authentication),
    assertionMethod: new Set(json.assertionMethod),
    keyAgreement: new Set(json.keyAgreement),
    capabilityInvocation: new Set(json.capabilityInvocation),
    capabilityDelegation: new Set(json.capabilityDelegation),
    service: new Map()
  };

  return create(details, keyring);
}

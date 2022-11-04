// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type {
  DidDocument,
  DidUrl,
  Service,
  VerificationMethod,
  VerificationMethodType
} from '@zcloak/did-resolver/types';
import type { KeypairType, KeyringPair } from '@zcloak/keyring/types';
import type { IDidDetails, KeyRelationship } from '../types';
import type { DidKeys } from './types';

import { assert } from '@polkadot/util';

import { base58Encode } from '@zcloak/crypto';

import { DidKeyring } from './keyring';

export function typeTransform(type: KeypairType): VerificationMethodType {
  switch (type) {
    case 'ecdsa':
      return 'EcdsaSecp256k1VerificationKey2019';
    case 'ed25519':
      return 'Ed25519VerificationKey2020';
    case 'x25519':
      return 'X25519KeyAgreementKey2019';

    default:
      throw new Error(`Can not transform type: ${type}`);
  }
}

export abstract class DidDetails extends DidKeyring implements IDidDetails {
  public id: DidUrl;
  public controller: Set<DidUrl>;
  public keyRelationship: Map<DidUrl, KeyRelationship>;
  public authentication?: Set<DidUrl>;
  public assertionMethod?: Set<DidUrl>;
  public keyAgreement?: Set<DidUrl>;
  public capabilityInvocation?: Set<DidUrl>;
  public capabilityDelegation?: Set<DidUrl>;
  public service?: Map<string, Service>;

  constructor({
    assertionMethod,
    authentication,
    capabilityDelegation,
    capabilityInvocation,
    controller,
    id,
    keyAgreement,
    keyRelationship,
    service
  }: IDidDetails) {
    super();
    this.id = id;
    this.controller = controller;
    this.keyRelationship = keyRelationship;
    this.authentication = authentication;
    this.assertionMethod = assertionMethod;
    this.keyAgreement = keyAgreement;
    this.capabilityInvocation = capabilityInvocation;
    this.capabilityDelegation = capabilityDelegation;
    this.service = service;
  }

  public getKeyUrl(key: DidKeys): DidUrl | undefined {
    return Array.from(this[key] ?? [])[0];
  }

  public get(id: DidUrl): KeyRelationship {
    const method = this.keyRelationship.get(id);

    assert(method, `Not find verficationMethod with id ${id}`);

    return method;
  }

  public getDocument(): DidDocument {
    assert(this.controller.size > 0, 'Must has one controller');

    const document: DidDocument = {
      '@context': ['https://www.w3.org/ns/did/v1'],
      id: this.id,
      controller: [...this.controller]
    };

    const verificationMethod: VerificationMethod[] = [];

    const keys: Record<string, DidUrl[]> = {
      authentication: [],
      assertionMethod: [],
      keyAgreement: [],
      capabilityInvocation: [],
      capabilityDelegation: []
    };

    for (const key of [
      'authentication',
      'assertionMethod',
      'keyAgreement',
      'capabilityInvocation',
      'capabilityDelegation'
    ] as const) {
      for (const id of [...(this[key] ?? [])]) {
        const pair: KeyringPair = this.getPair(this.get(id).publicKey);

        const method = verificationMethod.find(
          (method) => method.publicKeyMultibase === base58Encode(pair.publicKey)
        );

        if (!method) {
          const id: DidUrl = `${this.id}#key-${verificationMethod.length}`;

          verificationMethod.push({
            id,
            controller: Array.from(this.controller),
            type: typeTransform(pair.type),
            publicKeyMultibase: base58Encode(pair.publicKey)
          });
          keys[key].push(id);
        } else {
          keys[key].push(method.id);
        }
      }
    }

    return {
      ...document,
      verificationMethod,
      ...keys,
      service: Array.from(this.service?.values() ?? [])
    };
  }
}

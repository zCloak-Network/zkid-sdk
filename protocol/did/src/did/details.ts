// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidUrl, Service } from '@zcloak/did-resolver/types';
import type { DidKeys, IDidDetails, KeyRelationship } from '../types';

import { assert } from '@polkadot/util';

import { parseDid } from '@zcloak/did-resolver/parseDid';

import { encodeDidUrl } from '../utils';

export abstract class DidDetails implements IDidDetails {
  public id: DidUrl;
  public identifier: string;
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
    this.id = id;
    this.identifier = parseDid(id).identifier;
    this.controller = controller;
    this.keyRelationship = keyRelationship;
    this.authentication = authentication;
    this.assertionMethod = assertionMethod;
    this.keyAgreement = keyAgreement;
    this.capabilityInvocation = capabilityInvocation;
    this.capabilityDelegation = capabilityDelegation;
    this.service = service;
  }

  /**
   * Get the first key by `key`
   */
  public getKeyUrl(key: DidKeys): DidUrl {
    const didUrl = Array.from(this[key] ?? [])[0];

    assert(didUrl, `Not find verification method with the key: ${key}`);

    return didUrl;
  }

  /**
   * Get [[KeyRelationship]] by `id`
   * When the `id` equal to `detail.id`, it means use controller key
   */
  public get(id: DidUrl): KeyRelationship {
    if (id === this.id) {
      return {
        id: this.id,
        controller: [this.id],
        publicKey: this.identifier as HexString,
        type: 'EcdsaSecp256k1VerificationKey2019'
      };
    }

    const method = this.keyRelationship.get(id);

    assert(method, `Not find verificationMethod with id: ${id}`);

    return method;
  }

  public encodeDidUrl(): Uint8Array {
    return encodeDidUrl(this.id);
  }
}

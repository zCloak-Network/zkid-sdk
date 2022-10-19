import type { DidDocument, DidUrl, Service } from '@zcloak/did-resolver/types';

import { assert } from '@polkadot/util';

import { IDidDetails } from '../types';
import { DidKeyring } from './keyring';

export abstract class DidDetails extends DidKeyring implements IDidDetails {
  public id: DidUrl;
  public controller: Set<DidUrl>;
  public authentication?: Set<Uint8Array>;
  public assertionMethod?: Set<Uint8Array>;
  public keyAgreement?: Set<Uint8Array>;
  public capabilityInvocation?: Set<Uint8Array>;
  public capabilityDelegation?: Set<Uint8Array>;
  public service?: Service[];

  constructor({
    assertionMethod,
    authentication,
    capabilityDelegation,
    capabilityInvocation,
    controller,
    id,
    keyAgreement,
    service
  }: IDidDetails) {
    super();
    this.id = id;
    this.controller = controller;
    this.authentication = authentication;
    this.assertionMethod = assertionMethod;
    this.keyAgreement = keyAgreement;
    this.capabilityInvocation = capabilityInvocation;
    this.capabilityDelegation = capabilityDelegation;
    this.service = service;
  }

  public getDocument(): DidDocument {
    assert(this.keyring, 'Need to init before call method');

    const document: DidDocument = {
      id: this.id,
      controller: [...this.controller]
    };

    return document;
  }
}

import type {
  DidDocument,
  DidUrl,
  Service,
  VerificationMethod,
  VerificationMethodType
} from '@zcloak/did-resolver/types';
import type { KeypairType } from '@zcloak/keyring/types';

import { assert } from '@polkadot/util';

import { base58Encode } from '@zcloak/crypto';

import { IDidDetails } from '../types';
import { DidKeyring } from './keyring';

function typeTransform(type: KeypairType): VerificationMethodType {
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
      for (const publicKey of [...(this[key] ?? [])]) {
        const pair = this.keyring.getPair(publicKey);

        const method = verificationMethod.find(
          (method) => method.publicKeyMultibase === base58Encode(pair.publicKey)
        );

        if (!method) {
          const id: DidUrl = `${this.id}#${verificationMethod.length}`;

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
      service: Array.from(this.service ?? [])
    };
  }
}

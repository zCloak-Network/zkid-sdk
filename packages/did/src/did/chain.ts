// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type {
  DidDocument,
  DidDocumentProof,
  DidDocumentWithProof,
  DidUrl,
  VerificationMethod
} from '@zcloak/did-resolver/types';

import { assert } from '@polkadot/util';

import { base58Encode } from '@zcloak/crypto';

import { hashDidDocument } from '../hasher';
import { DidKeyring } from './keyring';

export abstract class DidChain extends DidKeyring {
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
        const { publicKey, type } = this.get(id);
        const method = verificationMethod.find(
          (method) => method.publicKeyMultibase === base58Encode(publicKey)
        );

        if (!method) {
          const id: DidUrl = `${this.id}#key-${verificationMethod.length}`;

          verificationMethod.push({
            id,
            controller: Array.from(this.controller),
            type,
            publicKeyMultibase: base58Encode(publicKey)
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

  /**
   * get a [[DidDocumentWithProof]] objecg, pass capability invocation key id
   * @returns an object of [[DidDocumentWithProof]]
   */
  public async getPublish(): Promise<DidDocumentWithProof> {
    const document = this.getDocument();

    document.creationTime = Date.now();

    const proof: DidDocumentProof[] = document.proof ?? [];

    const {
      id,
      signature,
      type: signatureType
    } = await this.signWithKey(hashDidDocument(document), 'capabilityInvocation');

    proof.push({ id, signature: base58Encode(signature), type: 'creation', signatureType });

    return {
      ...document,
      proof
    };
  }
}

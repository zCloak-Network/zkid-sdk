// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DidDocumentProof, DidDocumentWithProof, DidUrl } from '@zcloak/did-resolver/types';

import { base58Encode } from '@zcloak/crypto';

import { encodeDidDocument } from '../encode';
import { DidDetails } from './details';

export abstract class DidChain extends DidDetails {
  /**
   * get a [[DidDocumentWithProof]] objecg, pass capability invocation key id
   * @param keyId `this.capabilityInvocation` item
   * @returns an object of [[DidDocumentWithProof]]
   */
  public getPublish(keyId: DidUrl): DidDocumentWithProof {
    const document = this.getDocument();

    document.createdTime = Date.now();

    const proof: DidDocumentProof[] = document.proof ?? [];

    const key = this.get(keyId);

    const signature = this.sign(key.publicKey, encodeDidDocument(document));

    proof.push({ id: key.id, signature: base58Encode(signature), type: 'publish' });

    return {
      ...document,
      proof
    };
  }
}

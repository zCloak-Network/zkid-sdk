import type { DidResolver } from '@zcloak/did-resolver';
import type { DidDocumentProof, DidDocumentWithProof, DidUrl } from '@zcloak/did-resolver/types';
import type { IDidDetails } from '../types';

import { base58Encode } from '@zcloak/crypto';

import { defaultResolver } from '../defaults';
import { encodeDidDocument } from '../encode';
import { DidDetails } from './details';
import { parseDidDocument } from './helpers';

export class Did extends DidDetails {
  public async getOnChainDetails(resolver: DidResolver = defaultResolver): Promise<IDidDetails> {
    const document = await resolver.resolve(this.id);

    return parseDidDocument(document);
  }

  /**
   * get a [[DidDocumentWithProof]] objecg, pass capability invocation key id
   * @param keyIndex `this.capabilityInvocation` item
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

import type { DidResolver } from '@zcloak/did-resolver';
import type { DidDocument } from '@zcloak/did-resolver/types';
import type { IDidDetails } from '../types';

import { defaultResolver } from '../defaults';
import { parseDidDocument } from '../utils';
import { DidDetails } from './details';

export abstract class DidChain extends DidDetails {
  public async getOnChainDetails(resolver: DidResolver = defaultResolver): Promise<IDidDetails> {
    const document = await resolver.resolve(this.id);

    return parseDidDocument(document);
  }

  /**
   * publish did document on chain
   */
  public publish(): Promise<DidDocument> {
    throw new Error('Method not implemented.');
  }

  /**
   * revoke did document from chain
   */
  public revoke(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

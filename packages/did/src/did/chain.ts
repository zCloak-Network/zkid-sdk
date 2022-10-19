import type { DidDocument } from '@zcloak/did-resolver/types';

import { DidDetails } from './details';

export abstract class DidChain extends DidDetails {
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

import type { IDidDetails } from '../types';

import { u8aEq } from '@polkadot/util';

import { DidResolver } from '@zcloak/did-resolver';

import { defaultResolver } from '../defaults';
import { encodeDidDocument } from '../encode';
import { DidChain } from './chain';

export class Did extends DidChain {
  public resolver: DidResolver;

  constructor(details: IDidDetails, resolver: DidResolver = defaultResolver) {
    super(details);
    this.resolver = resolver;
  }

  public async isEqualOnChain(): Promise<boolean> {
    const onChainDocument = await this.resolver.resolve(this.id);

    const document = this.getDocument();

    return u8aEq(encodeDidDocument(onChainDocument), encodeDidDocument(document));
  }
}

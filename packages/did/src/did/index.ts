// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Service } from '@zcloak/did-resolver/types';

import { u8aEq } from '@polkadot/util';

import { DidResolver } from '@zcloak/did-resolver';
import { defaultResolver } from '@zcloak/did-resolver/defaults';

import { hashDidDocument } from '../hasher';
import { DidChain } from './chain';

/**
 * A class to use did keys and set document.
 *
 * @see helpers
 */
export class Did extends DidChain {
  public async isEqualOnChain(resolver: DidResolver = defaultResolver): Promise<boolean> {
    const onChainDocument = await resolver.resolve(this.id);

    const document = this.getDocument();

    return u8aEq(hashDidDocument(onChainDocument, false), hashDidDocument(document, false));
  }

  public addService(service: Service): void {
    if (!this.service) {
      this.service = new Map();
    }

    this.service.set(service.id, service);
  }
}

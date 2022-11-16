// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DidDocument, DidUrl } from './types';

import { DidResolver } from './DidResolver';
import { DidNotFoundError } from './errors';

export class MockDidResolver extends DidResolver {
  #map: Map<DidUrl, DidDocument> = new Map();

  public override resolve(didUrl: string): Promise<DidDocument> {
    const { did } = this.parseDid(didUrl);

    const document = this.#map.get(did);

    if (!document) {
      throw new DidNotFoundError();
    }

    return Promise.resolve(document);
  }

  public addDocument(document: DidDocument): void {
    this.#map.set(document.id, document);
  }
}

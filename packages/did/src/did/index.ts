// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { Service } from '@zcloak/did-resolver/types';
import type { IDidDetails } from '../types';
import type { DidKeys, SignedData } from './types';

import { assert, u8aEq } from '@polkadot/util';

import { DidResolver } from '@zcloak/did-resolver';

import { defaultResolver } from '../defaults';
import { hashDidDocument } from '../hasher';
import { DidChain } from './chain';
import { typeTransform } from './details';

export class Did extends DidChain {
  public resolver: DidResolver;

  constructor(details: IDidDetails, resolver: DidResolver = defaultResolver) {
    super(details);
    this.resolver = resolver;
  }

  public async isEqualOnChain(): Promise<boolean> {
    const onChainDocument = await this.resolver.resolve(this.id);

    const document = this.getDocument();

    return u8aEq(hashDidDocument(onChainDocument, false), hashDidDocument(document, false));
  }

  public addService(service: Service): void {
    if (!this.service) {
      this.service = new Map();
    }

    this.service.set(service.id, service);
  }

  public signWithKey(key: DidKeys, message: Uint8Array | HexString): SignedData {
    const didUrl = this.getKeyUrl(key);

    assert(didUrl, `can not find verification method with the key: ${key}`);
    const { publicKey } = this.get(didUrl);
    const signature = this.sign(publicKey, message);

    return {
      signature,
      type: typeTransform(this.getPair(publicKey).type),
      didUrl
    };
  }
}

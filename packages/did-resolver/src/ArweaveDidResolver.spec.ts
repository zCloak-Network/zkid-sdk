// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ArweaveDidResolver } from './ArweaveDidResolver';

// const DID_URI = 'did:zk:0xab62B6Cc152ca32b51fD80CF5eE6c606DEd850c6';
const DID_URI = 'did:zk:0x8A63688576294474862cE18486CD489144721D77';

describe('ArweaveDidResolver', (): void => {
  let resolver: ArweaveDidResolver;

  beforeEach(() => {
    resolver = new ArweaveDidResolver();
  });

  it.skip('resolve didUrl', async (): Promise<void> => {
    console.log(await resolver.resolve(DID_URI));
  });
});

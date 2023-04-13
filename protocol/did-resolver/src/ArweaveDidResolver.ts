// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fetch from 'cross-fetch';

import { DidResolver } from './DidResolver';
import { DidNotFoundError, ServerResponseError } from './errors';
import { DidDocument } from './types';

interface Options {
  server?: string;
}

export class ArweaveDidResolver extends DidResolver {
  public server: string;

  constructor(opts: Options = {}) {
    super();

    const { server = 'https://did-service.zkid.app' } = opts;

    this.server = server;
  }

  public override async resolve(didUrl: string): Promise<DidDocument> {
    const { did } = this.parseDid(didUrl);

    const res = await fetch(`${this.server}/did/${did}`).then((_res) => _res.json());

    if (res.code !== 200) {
      throw new ServerResponseError(res.message);
    }

    if (res.code === 200 && !res.data) {
      throw new DidNotFoundError();
    }

    return res.data.rawData;
  }
}

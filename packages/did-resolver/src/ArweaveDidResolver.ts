// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';

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

    const { server = 'https://did-service.starks.network' } = opts;

    this.server = server;
  }

  public override async resolve(didUrl: string): Promise<DidDocument> {
    const { did } = this.parseDid(didUrl);

    const res = await axios.get(`${this.server}/did/${did}`);

    if (res.data.code !== 200) {
      throw new ServerResponseError(res.data.message);
    }

    if (res.data.code === 200 && !res.data.data) {
      throw new DidNotFoundError();
    }

    return res.data.data.rawData;
  }
}

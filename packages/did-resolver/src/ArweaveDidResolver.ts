// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { isArray } from '@polkadot/util';
import Arweave from 'arweave';

import { DidResolver } from './DidResolver';
import { DidNotFoundError, RepresentationNotSupportedError } from './errors';
import { DidDocument } from './types';

interface Options {
  host?: string;
  protocol?: string;
  owners?: string[];
}

export class ArweaveDidResolver extends DidResolver {
  public arweave: Arweave;
  public owners: string[];

  constructor(opts: Options = {}) {
    super();

    const {
      host = 'arweave.net',
      owners = ['rfHpFtImP9jqcXvrl3aZSLPoqa_5mgN5yQO-bWusA7A'],
      protocol = 'https'
    } = opts;

    this.owners = owners;
    // eslint-disable-next-line no-unsafe-optional-chaining
    this.arweave = (Arweave.init ?? (Arweave as any)?.default?.init)({
      host,
      protocol
    });
  }

  public override async resolve(didUrl: string): Promise<DidDocument> {
    const { did } = this.parseDid(didUrl);

    const res = await this.arweave.api.post('/graphql', {
      query: `query {
  transactions(
    owners: ${JSON.stringify(this.owners)},
    tags: { name: "didUrl", values: ["${did}"] }
  ) {
    edges {
      node {
        id
      }
    }
  }
}`
    });

    if (
      !res?.data?.data?.transactions?.edges ||
      !isArray(res?.data?.data?.transactions?.edges) ||
      res?.data?.data?.transactions?.edges.length === 0
    ) {
      throw new DidNotFoundError();
    }

    try {
      const documents: string[] = await Promise.all(
        res.data.data.transactions.edges.map(({ node: { id } }: any) =>
          this.arweave.transactions.getData(id, {
            decode: true,
            string: true
          })
        )
      );

      const document = JSON.parse(documents[documents.length - 1]);

      return document;
    } catch {
      throw new RepresentationNotSupportedError();
    }
  }
}

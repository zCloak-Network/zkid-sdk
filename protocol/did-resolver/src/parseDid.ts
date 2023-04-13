// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DidMethod, DidUrl, ParsedDid } from './types';

import { InvalidDidError } from './errors';

const ID_CHAR = '[a-zA-Z0-9_.-]';
const METHOD: DidMethod = 'zk';
const METHOD_ID = `(${ID_CHAR}+(:${ID_CHAR}+)*)`;

const PATH = '(/[^#?]*)?';
const QUERY = '([?][^#]*)?';
const FRAGMENT = '(#.*)?';

const DID_MATCHER = new RegExp(`^did:(${METHOD}):${METHOD_ID}${PATH}${QUERY}${FRAGMENT}$`);

export function parseDid(didUrl: string) {
  if (didUrl === '' || !didUrl) throw new InvalidDidError();
  const sections = didUrl.match(DID_MATCHER);

  if (sections) {
    const didMethod: DidMethod = sections[1] as DidMethod;
    const identifier: string = sections[2];

    const parsed: ParsedDid = {
      did: `did:${didMethod}:${sections[2]}`,
      didUrl: didUrl as DidUrl,
      method: didMethod,
      identifier
    };

    if (sections[4]) parsed.path = sections[4];
    if (sections[5]) parsed.query = sections[5].slice(1);
    if (sections[6]) parsed.fragment = sections[6].slice(1);

    return parsed;
  }

  throw new InvalidDidError();
}

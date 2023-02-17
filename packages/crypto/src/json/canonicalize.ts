// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import canonicalize from 'canonicalize';

export function jsonCanonicalize(json: unknown): string {
  const result = canonicalize(json);

  if (!result) {
    throw new Error('Can not wo canonicalize json');
  }

  return result;
}

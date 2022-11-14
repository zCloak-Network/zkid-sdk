// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CType } from '@zcloak/ctype/types';
import type { DidDocument } from '@zcloak/did-resolver/types';

import { decodeMultibase } from '@zcloak/crypto';
import { getCTypeHash } from '@zcloak/ctype/publish';

import { didVerify } from './didVerify';

/**
 * @name ctypeVerify
 * @summary verify ctype signature is valid
 */
export function ctypeVerify(ctype: CType, document?: DidDocument): Promise<boolean> {
  const hash = getCTypeHash(ctype, ctype.publisher, ctype.$schema);

  return document
    ? didVerify(hash, decodeMultibase(ctype.signature), ctype.publisher, document)
    : didVerify(hash, decodeMultibase(ctype.signature), ctype.publisher);
}

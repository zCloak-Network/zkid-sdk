// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CType } from '@zcloak/ctype/types';
import type { DidResolver } from '@zcloak/did-resolver';
import type { DidDocument } from '@zcloak/did-resolver/types';

import { decodeMultibase } from '@zcloak/crypto';
import { getCTypeHash, signedCTypeMessage } from '@zcloak/ctype/publish';

import { didVerify } from './didVerify';

/**
 * @name ctypeVerify
 * @summary Verifies ctype signature is valid.
 * @description
 * Verify the `ctype` is valid, it will verify `ctype.signature` on the `ctype.publisher`. Returs `true` on success, `false` otherwise.
 * @example
 * <BR>
 * ```typescript
 * import { CType } from '@zcloak/ctype/types'
 *
 * const ctype: CType = {...}
 *
 * ctypeVerify(ctype); // true or false
 * ```
 */
export function ctypeVerify(ctype: CType, document?: DidDocument | DidResolver): Promise<boolean> {
  const hash = getCTypeHash(ctype, ctype.publisher, ctype.$schema);

  const message = ctype.version === '0' ? signedCTypeMessage(hash, ctype.version) : hash;

  const signatureType = ctype.signatureType || 'EcdsaSecp256k1Signature2019';

  return document
    ? didVerify(message, decodeMultibase(ctype.signature), signatureType, ctype.publisher, document)
    : didVerify(message, decodeMultibase(ctype.signature), signatureType, ctype.publisher);
}

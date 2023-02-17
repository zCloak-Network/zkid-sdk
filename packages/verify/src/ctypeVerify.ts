// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CType } from '@zcloak/ctype/types';
import type { DidResolver } from '@zcloak/did-resolver';
import type { DidDocument } from '@zcloak/did-resolver/types';

import { decodeMultibase, eip712 } from '@zcloak/crypto';
import { getCTypeHash } from '@zcloak/ctype/publish';
import { getPublishCTypeTypedData } from '@zcloak/ctype/utils';

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

  const message =
    ctype.signatureType === 'EcdsaSecp256k1SignatureEip712'
      ? eip712.getMessage(getPublishCTypeTypedData(hash), true)
      : hash;

  const signatureType = ctype.signatureType || 'EcdsaSecp256k1Signature2019';

  return document
    ? didVerify(message, decodeMultibase(ctype.signature), signatureType, ctype.publisher, document)
    : didVerify(message, decodeMultibase(ctype.signature), signatureType, ctype.publisher);
}

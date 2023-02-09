// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { decodeMultibase } from '@zcloak/crypto';
import { hashDidDocument } from '@zcloak/did';
import { DidDocument } from '@zcloak/did-resolver/types';

import { didVerify } from './didVerify';

export async function verifyDidDocumentProof(document: DidDocument): Promise<boolean> {
  if (!document.proof || document.proof.length === 0) {
    return false;
  }

  const hashes = hashDidDocument(document);

  const proof = document.proof[0];

  if (proof.type === 'creation') {
    return await didVerify(hashes, decodeMultibase(proof.signature), proof.id, document);
  }

  return false;
}

// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { decodeMultibase } from '@zcloak/crypto';
import { hashDidDocument, signedDidDocumentMessage } from '@zcloak/did';
import { DidDocument } from '@zcloak/did-resolver/types';

import { didVerify } from './didVerify';

export async function verifyDidDocumentProof(document: DidDocument): Promise<boolean> {
  if (!document.proof || document.proof.length === 0) {
    return false;
  }

  const proof = document.proof[0];

  if (proof.type === 'creation') {
    const hash = hashDidDocument(document);
    const message = document.version === '0' ? signedDidDocumentMessage(hash, document.version) : hash;

    return await didVerify(
      message,
      decodeMultibase(proof.signature),
      proof.signatureType || 'EcdsaSecp256k1Signature2019',
      proof.id,
      document
    );
  }

  return false;
}

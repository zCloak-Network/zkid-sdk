// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { decodeMultibase, eip712 } from '@zcloak/crypto';
import { hashDidDocument } from '@zcloak/did';
import { getPublishDocumentTypedData } from '@zcloak/did/utils';
import { DidDocument } from '@zcloak/did-resolver/types';

import { didVerify } from './didVerify';

export async function verifyDidDocumentProof(document: DidDocument): Promise<boolean> {
  if (!document.proof || document.proof.length === 0) {
    return false;
  }

  const proof = document.proof[0];

  if (proof.type === 'creation') {
    const message =
      proof.signatureType === 'EcdsaSecp256k1SignatureEip712'
        ? eip712.getMessage(getPublishDocumentTypedData(document), true)
        : hashDidDocument(document);

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

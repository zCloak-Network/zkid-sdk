// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { verifySignature } from '@zcloak/crypto';
import { DidDocument } from '@zcloak/did-resolver/types';

import { decodeMultibase } from './did/helpers';
import { hashDidDocument } from './hasher';

export function verifyDidDocumentProof(document: DidDocument): boolean {
  if (!document.proof || document.proof.length === 0) {
    return false;
  }

  const encoded = hashDidDocument(document);

  const proof = document.proof[0];

  if (proof.type === 'creation') {
    const publicKeyMultibase =
      document.verificationMethod &&
      document.verificationMethod.find((method) => method.id === proof.id)?.publicKeyMultibase;

    return (
      !!publicKeyMultibase &&
      !!document.capabilityInvocation?.includes(proof.id) &&
      verifySignature(
        encoded,
        decodeMultibase(proof.signature),
        decodeMultibase(publicKeyMultibase)
      ).isValid
    );
  }

  return false;
}

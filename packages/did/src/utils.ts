import type { DidDocument } from '@zcloak/did-resolver/types';
import type { IDidDetails } from './types';

import {
  base32Decode,
  base58Decode,
  base64Decode,
  isBase32,
  isBase58,
  isBase64
} from './multibase';

export function parseDidDocument(document: DidDocument): IDidDetails {
  const didDetails: IDidDetails = {
    id: document.id,
    controller: new Set(document.controller)
  };

  const keys = [
    'authentication',
    'assertionMethod',
    'keyAgreement',
    'capabilityInvocation',
    'capabilityDelegation'
  ] as const;

  keys.forEach((key) => {
    didDetails[key] =
      document[key] &&
      document.verificationMethod &&
      new Set(
        document.verificationMethod
          .filter((method) => document[key]?.includes(method.id))
          .map((method) => {
            if (isBase58(method.publicKeyMultibase)) {
              return base58Decode(method.publicKeyMultibase);
            } else if (isBase32(method.publicKeyMultibase)) {
              return base32Decode(method.publicKeyMultibase);
            } else if (isBase64(method.publicKeyMultibase)) {
              return base64Decode(method.publicKeyMultibase);
            } else {
              throw new Error(
                `Decode ${method.publicKeyMultibase} error, only support base58, base32, base64`
              );
            }
          })
      );
  });

  didDetails.service = document.service;

  return didDetails;
}

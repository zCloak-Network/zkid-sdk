import type { DidDocument } from '@zcloak/did-resolver/types';
import type { IDidDetails } from './types';

import { base58btc } from './multibase';

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
          // TODO: this maybe to use an universal multibase function
          .map((method) => base58btc.decode(method.publicKeyMultibase))
      );
  });

  didDetails.service = document.service;

  return didDetails;
}

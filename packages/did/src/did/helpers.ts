// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DidResolver } from '@zcloak/did-resolver';
import type { DidDocument, DidUrl } from '@zcloak/did-resolver/types';
import type { KeyringInstance } from '@zcloak/keyring/types';

import { decodeMultibase } from '@zcloak/crypto';
import { defaultResolver } from '@zcloak/did-resolver/defaults';

import { IDidDetails } from '../types';
import { Did } from '.';

/**
 * parse a did document to [[IDidDetails]]
 * @param document an object of [[DidDocument]]
 * @returns object of [[IDidDetails]]
 */
export function parseDidDocument(document: DidDocument): IDidDetails {
  const didDetails: IDidDetails = {
    id: document.id,
    controller: new Set(document.controller),
    keyRelationship: new Map()
  };

  document.verificationMethod?.forEach((method) => {
    didDetails.keyRelationship.set(method.id, {
      id: method.id,
      controller: method.controller,
      publicKey: decodeMultibase(method.publicKeyMultibase),
      type: method.type
    });
  });

  const keys = [
    'authentication',
    'assertionMethod',
    'keyAgreement',
    'capabilityInvocation',
    'capabilityDelegation'
  ] as const;

  keys.forEach((key) => {
    didDetails[key] = new Set(document[key]);
  });

  if (document.service) {
    didDetails.service = new Map(document.service.map((s) => [s.id, s]));
  }

  return didDetails;
}

/**
 * query did document from `VDR`, and parse it to [[Did]]
 * @param did a string that conforms to the DID Syntax.
 * @param keyring(optional) an instance of [[KeyringInstance]], if passed, will call `did.init` method
 * @param resolver(optional) a [[DidResolver]] instance, default [[ArweaveDidResolver]]
 * @returns instance of [[Did]]
 * @example
 * <BR>
 * ```typescript
 * import { helpers, Did } from '@zcloak/did'
 *
 * const did: Did = helpers.fromDid('did:zk:0x082d674c00e27fBaAAE123a85f5024A1DD702e51');
 * ```
 */
export async function fromDid(
  did: DidUrl,
  keyring?: KeyringInstance,
  resolver: DidResolver = defaultResolver
): Promise<Did> {
  const document = await resolver.resolve(did);

  return fromDidDocument(document, keyring);
}

/**
 * parse a did document to [[Did]]
 * @param document an object of [[DidDocument]]
 * @param keyring(optional) an instance of [[KeyringInstance]], if passed, will call `did.init` method
 * @returns instance of [[Did]]
 * @example
 * <BR>
 * ```typescript
 * import { helpers, Did } from '@zcloak/did'
 * import type { DidDocument } from '@zcloak/did-resolver/types';
 *
 * const document: DidDocument = {};
 * const did: Did = heloers.fromDidDocument(document);
 * ```
 */
export function fromDidDocument(document: DidDocument, keyring?: KeyringInstance): Did {
  const details = parseDidDocument(document);

  const did = new Did(details);

  if (keyring) {
    did.init(keyring);
  }

  return did;
}

/**
 * create [[Did]] from a [[IDidDetails]] object
 * @param details an object of [[IDidDetails]]
 * @param keyring(optional) an instance of [[KeyringInstance]], if passed, will call `did.init` method
 * @returns instance of [[Did]]
 * @example
 * <BR>
 * ```typescript
 * import { helpers, Did } from '@zcloak/did'
 * import { Keyring } from '@zcloak/keyring'
 * import type { IDidDetails } from '@zcloak/did/types';
 *
 * const details: IDidDetails = {};
 * const keyring: Keyring = new Keyring();
 * const did: Did = helpers.create(details, keyring);
 * ```
 */
export function create(details: IDidDetails, keyring?: KeyringInstance): Did {
  const did = new Did(details);

  if (keyring) {
    did.init(keyring);
  }

  return did;
}

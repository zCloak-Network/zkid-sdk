// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DidResolver } from '@zcloak/did-resolver';
import type { DidDocument, DidUrl } from '@zcloak/did-resolver/types';
import type { KeyringInstance } from '@zcloak/keyring/types';
import type { KeyGen } from './types';

import { base58Encode, decodeMultibase, ethereumEncode } from '@zcloak/crypto';
import { defaultResolver } from '@zcloak/did-resolver/defaults';
import { Keyring } from '@zcloak/keyring';

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

/**
 * pass `mnemonic`, and create [[Did]] from a [[IDidDetails]] object
 * @returns instance of [[Did]]
 * @example
 * <BR>
 * ```typescript
 * import { helpers, Did } from '@zcloak/did'
 * import { Keyring } from '@zcloak/keyring'
 * import type { IDidDetails } from '@zcloak/did/types';
 *
 * const mnemonic = 'health correct setup usage father decorate curious copper sorry recycle skin equal';
 * const keyring: Keyring = new Keyring();
 * const did: Did = helpers.createEcdsaFromMnemonic(mnemonic, keyring);
 * ```
 */
export function createEcdsaFromMnemonic(
  mnemonic: string,
  keyring: KeyringInstance = new Keyring()
): Did {
  const {
    identifier,
    keys: [key0, key1]
  } = keyFromMnemonic(keyring, mnemonic, 'ecdsa');

  const didUri: DidUrl = `did:zk:${ethereumEncode(identifier)}`;
  const document: DidDocument = {
    '@context': ['https://www.w3.org/ns/did/v1'],
    id: didUri,
    controller: [didUri],
    verificationMethod: [
      {
        id: `${didUri}#key-0`,
        controller: [didUri],
        type: 'EcdsaSecp256k1VerificationKey2019',
        publicKeyMultibase: base58Encode(key0)
      },
      {
        id: `${didUri}#key-1`,
        controller: [didUri],
        type: 'X25519KeyAgreementKey2019',
        publicKeyMultibase: base58Encode(key1)
      }
    ],
    authentication: [`${didUri}#key-0`],
    assertionMethod: [`${didUri}#key-0`],
    keyAgreement: [`${didUri}#key-1`],
    capabilityInvocation: [`${didUri}#key-0`],
    capabilityDelegation: [`${didUri}#key-0`],
    service: []
  };

  const did = create(parseDidDocument(document), keyring);

  return did;
}

export function keyFromMnemonic(keyring: KeyringInstance, mnemonic: string, type: 'ecdsa'): KeyGen;
export function keyFromMnemonic(
  keyring: KeyringInstance,
  mnemonic: string,
  type: 'ed25519'
): KeyGen;

export function keyFromMnemonic(
  keyring: KeyringInstance,
  mnemonic: string,
  type: 'ecdsa' | 'ed25519'
): KeyGen {
  const identifier = keyring.addFromMnemonic(
    mnemonic,
    type === 'ecdsa' ? "/m/44'/60'/0'/0/0" : undefined,
    type
  );
  const pair1 = keyring.addFromMnemonic(
    mnemonic,
    type === 'ecdsa' ? "/m/44'/60'/0'/0/0/0" : '//0',
    type
  );
  const pair2 = keyring.addFromMnemonic(mnemonic, '//1', 'x25519');

  return {
    identifier: identifier.publicKey,
    keys: [pair1.publicKey, pair2.publicKey]
  };
}

import type { DidResolver } from '@zcloak/did-resolver';
import type { DidDocument, DidUrl } from '@zcloak/did-resolver/types';
import type { KeyringInstance } from '@zcloak/keyring/types';

import { ethereumEncode } from '@polkadot/util-crypto';

import {
  base32Decode,
  base58Decode,
  base58Encode,
  base64Decode,
  isBase32,
  isBase58,
  isBase64
} from '@zcloak/crypto';
import { Keyring } from '@zcloak/keyring';

import { defaultResolver } from '../defaults';
import { IDidDetails } from '../types';
import { Did } from '.';

export function decodeMultibase(multibase: string): Uint8Array {
  if (isBase58(multibase)) {
    return base58Decode(multibase);
  } else if (isBase32(multibase)) {
    return base32Decode(multibase);
  } else if (isBase64(multibase)) {
    return base64Decode(multibase);
  } else {
    throw new Error(`Decode ${multibase} error, only support base58, base32, base64`);
  }
}

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
      publicKey: decodeMultibase(method.publicKeyMultibase)
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

  didDetails.service = document.service;

  return didDetails;
}

/**
 * query did document from `VDR`, and parse it to [[Did]]
 * @param did a string that conforms to the DID Syntax.
 * @param resolver(optional) a [[DidResolver]] instance, default [[ZkidDidResolver]]
 * @returns instance of [[Did]]
 * @example
 * <BR>
 * ```typescript
 * import { helpers, Did } from '@zcloak/did'
 *
 * const did: Did = helpers.fromDid('did:zk:0x082d674c00e27fBaAAE123a85f5024A1DD702e51');
 * ```
 */
export async function fromDid(did: DidUrl, resolver: DidResolver = defaultResolver): Promise<Did> {
  const document = await resolver.resolve(did);

  return fromDidDocument(document);
}

/**
 * parse a did document to [[Did]]
 * @param document an object of [[DidDocument]]
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
export function fromDidDocument(document: DidDocument): Did {
  const details = parseDidDocument(document);

  return new Did(details);
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
  const identifier = keyring.addFromMnemonic(mnemonic, "/m/44'/60'/0'/0/0", 'ecdsa');
  const key0 = keyring.addFromMnemonic(mnemonic, "/m/44'/60'/0'/0/1", 'ecdsa');
  const key1 = keyring.addFromMnemonic(mnemonic, undefined, 'x25519');

  const didUri: DidUrl = `did:zk:${ethereumEncode(identifier.publicKey)}`;
  const document: DidDocument = {
    '@context': ['https://www.w3.org/ns/did/v1'],
    id: didUri,
    controller: [didUri],
    verificationMethod: [
      {
        id: `${didUri}#key-0`,
        controller: [didUri],
        type: 'EcdsaSecp256k1VerificationKey2019',
        publicKeyMultibase: base58Encode(key0.publicKey)
      },
      {
        id: `${didUri}#key-1`,
        controller: [didUri],
        type: 'X25519KeyAgreementKey2019',
        publicKeyMultibase: base58Encode(key1.publicKey)
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

import type { DidResolver } from '@zcloak/did-resolver';
import type { DidDocument, DidUrl } from '@zcloak/did-resolver/types';
import type { KeyringInstance } from '@zcloak/keyring/types';

import { ethereumEncode } from '@polkadot/util-crypto';

import { Keyring } from '@zcloak/keyring';

import { defaultResolver } from '../defaults';
import { base58Encode } from '../multibase';
import { IDidDetails } from '../types';
import { parseDidDocument } from '../utils';
import { Did } from '.';

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
  const identifier = keyring.addFromMnemonic(mnemonic, "m/44'/60'/0'/0", 0, 'ecdsa');
  const key0 = keyring.addFromMnemonic(mnemonic, "m/44'/60'/0'/0", 1, 'ecdsa');
  const key1 = keyring.addFromMnemonic(mnemonic, "m/0'", 0, 'x25519');

  const didUri: DidUrl = `did:zk:${ethereumEncode(identifier.publicKey)}`;
  const document: DidDocument = {
    id: didUri,
    controller: [didUri],
    verificationMethod: [
      {
        id: `${didUri}#key-0`,
        controller: didUri,
        type: 'EcdsaSecp256k1VerificationKey2019',
        publicKeyMultibase: base58Encode(key0.publicKey)
      },
      {
        id: `${didUri}#key-1`,
        controller: didUri,
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

  const did = fromDidDocument(document);

  did.init(keyring);

  return did;
}

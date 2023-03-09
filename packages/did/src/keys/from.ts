// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DidDocument, DidUrl } from '@zcloak/did-resolver/types';
import type { KeyringInstance } from '@zcloak/keyring/types';
import type { Did } from '../did';

import { base58Encode, ethereumEncode } from '@zcloak/crypto';

import { fromDidDocument } from '../did/helpers';

/**
 * @name fromMnemonic
 * @summary create Did from mnemonic.
 * @description
 * create Did like `did:zk:` from `mnemonic`. generate signing key by `signingKeyType`. Returns [[Did]] instance.
 *
 * @param index
 * controller path is `/m/44'/60'/0'/0/index`
 *
 * ecdsa path is `/m/44'/60'/0'/0/index/0`
 *
 * ed25519 path is `//index`
 *
 * x25519 path is `//index * 2`
 * @example
 * ```javascript
 * import { keys } from '@zcloak/did';
 *
 * const mnemonic = '...';
 *
 * const did = keys.fromMnemonic(keyring, mnemonic, 'ecdsa')
 * ```
 */
export function fromMnemonic(
  keyring: KeyringInstance,
  mnemonic: string,
  signingKeyType: 'ecdsa' | 'ed25519' = 'ecdsa',
  index = 0
): Did {
  const controllerPath = `/m/44'/60'/0'/0/${index}`;
  const ecdsaPath = `${controllerPath}/0`;
  const edPath = `//${index * 2}`;
  const xPath = `//${index * 2 + 1}`;

  const controller = keyring.addFromMnemonic(mnemonic, controllerPath, 'ecdsa');
  const singingKey = keyring.addFromMnemonic(mnemonic, signingKeyType === 'ecdsa' ? ecdsaPath : edPath, signingKeyType);
  const encryptionKey = keyring.addFromMnemonic(mnemonic, xPath, 'x25519');

  const didUri: DidUrl = `did:zk:${ethereumEncode(controller.publicKey)}`;
  const document: DidDocument = {
    '@context': ['https://www.w3.org/ns/did/v1'],
    id: didUri,
    controller: [didUri],
    verificationMethod: [
      {
        id: `${didUri}#key-0`,
        controller: [didUri],
        type: signingKeyType === 'ecdsa' ? 'EcdsaSecp256k1VerificationKey2019' : 'Ed25519VerificationKey2020',
        publicKeyMultibase: base58Encode(singingKey.publicKey)
      },
      {
        id: `${didUri}#key-1`,
        controller: [didUri],
        type: 'X25519KeyAgreementKey2019',
        publicKeyMultibase: base58Encode(encryptionKey.publicKey)
      }
    ],
    authentication: [`${didUri}#key-0`],
    assertionMethod: [`${didUri}#key-0`],
    keyAgreement: [`${didUri}#key-1`],
    capabilityInvocation: [`${didUri}#key-0`],
    capabilityDelegation: [`${didUri}#key-0`],
    service: []
  };

  return fromDidDocument(document, keyring);
}

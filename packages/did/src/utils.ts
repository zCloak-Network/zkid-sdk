// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TypedData } from '@zcloak/crypto/eip712/types';
import type { DidDocument, DidUrl, VerificationMethodType } from '@zcloak/did-resolver/types';
import type { KeypairType } from '@zcloak/keyring/types';

import { assert, isNumber } from '@polkadot/util';

import { decodeMultibase } from '@zcloak/crypto';
import { parseDid } from '@zcloak/did-resolver/parseDid';

/**
 * Compare whether two didUrls have the same Uri
 * such as: `did:zk:abcd#key-0` is equal to `did:zk:abcd?query#key-1`
 */
export function isSameUri(didUrl1: DidUrl, didUrl2: DidUrl): boolean {
  const { did: did1 } = parseDid(didUrl1);
  const { did: did2 } = parseDid(didUrl2);

  return did1 === did2;
}

export function isDidUrl(value: unknown): value is DidUrl {
  if (typeof value !== 'string') return false;

  try {
    parseDid(value);

    return true;
  } catch {
    return false;
  }
}

/**
 * @name typeTransform
 * @summary transform `keypairType` to `VerificationMethodType`
 * @descryption
 * provide `KeypairType`, return `VerificationMethodType`, throw Error when not transform.
 */
export function typeTransform(type: KeypairType): VerificationMethodType {
  switch (type) {
    case 'ecdsa':
      return 'EcdsaSecp256k1VerificationKey2019';
    case 'ed25519':
      return 'Ed25519VerificationKey2020';
    case 'x25519':
      return 'X25519KeyAgreementKey2019';

    default:
      throw new Error(`Can not transform type: ${type}`);
  }
}

export function getPublishDocumentTypedData(document: DidDocument): TypedData {
  const message = {
    id: document.id,
    controller: document.controller,
    verificationMethod:
      document.verificationMethod?.map((method) => ({
        id: method.id,
        controller: method.controller,
        type: method.type,
        publicKey: decodeMultibase(method.publicKeyMultibase)
      })) ?? [],
    authentication:
      document.authentication?.map((didUrl) => {
        const index = document.verificationMethod?.findIndex((method) => method.id === didUrl);

        assert(isNumber(index), `Can't find authentication verificationMethod with key: ${didUrl}`);

        return index;
      }) ?? [],
    assertionMethod:
      document.assertionMethod?.map((didUrl) => {
        const index = document.verificationMethod?.findIndex((method) => method.id === didUrl);

        assert(
          isNumber(index),
          `Can't find assertionMethod verificationMethod with key: ${didUrl}`
        );

        return index;
      }) ?? [],
    keyAgreement:
      document.keyAgreement?.map((didUrl) => {
        const index = document.verificationMethod?.findIndex((method) => method.id === didUrl);

        assert(isNumber(index), `Can't find keyAgreement verificationMethod with key: ${didUrl}`);

        return index;
      }) ?? [],
    capabilityInvocation:
      document.capabilityInvocation?.map((didUrl) => {
        const index = document.verificationMethod?.findIndex((method) => method.id === didUrl);

        assert(
          isNumber(index),
          `Can't find capabilityInvocation verificationMethod with key: ${didUrl}`
        );

        return index;
      }) ?? [],
    capabilityDelegation:
      document.capabilityDelegation?.map((didUrl) => {
        const index = document.verificationMethod?.findIndex((method) => method.id === didUrl);

        assert(
          isNumber(index),
          `Can't find capabilityDelegation verificationMethod with key: ${didUrl}`
        );

        return index;
      }) ?? [],
    creationTime: document.creationTime || Date.now()
  };

  return {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' }
      ],
      VerificationMethod: [
        { name: 'id', type: 'string' },
        { name: 'controller', type: 'string[]' },
        { name: 'type', type: 'string' },
        { name: 'publicKey', type: 'bytes' }
      ],
      PublishDocument: [
        { name: 'id', type: 'string' },
        { name: 'controller', type: 'string[]' },
        { name: 'verificationMethod', type: 'VerificationMethod[]' },
        { name: 'authentication', type: 'uint256[]' },
        { name: 'assertionMethod', type: 'uint256[]' },
        { name: 'keyAgreement', type: 'uint256[]' },
        { name: 'capabilityInvocation', type: 'uint256[]' },
        { name: 'capabilityDelegation', type: 'uint256[]' },
        { name: 'creationTime', type: 'uint256' }
      ]
    },
    primaryType: 'PublishDocument',
    domain: {
      name: 'DidDocument',
      version: '0'
    },
    message
  };
}

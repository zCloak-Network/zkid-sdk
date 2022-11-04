// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { Did } from '@zcloak/did';
import type {
  HashType,
  VerifiableCredential,
  VerifiablePresentation,
  VerifiablePresentationType
} from './types';

import { assert, isHex, stringToU8a, u8aConcat, u8aToHex } from '@polkadot/util';

import { base58Encode } from '@zcloak/crypto';

import { rootHashFromMerkle } from './credential/rootHash';
import { keyTypeToSignatureType } from './utils';

// @internal
// transform Verifiable Credential by [[VerifiablePresentationType]]
function transformVC(
  vc: VerifiableCredential,
  type: VerifiablePresentationType,
  selectedAttributes?: string[]
): VerifiableCredential {
  assert(vc.credentialSubjectHashes, 'Credential subject hashes no provided');
  assert(vc.credentialSubjectNonceMap, 'Credential subject nonce-map no provided');
  assert(!isHex(vc.credentialSubject), 'Credential subject is not key-value');

  if (type === 'VP') {
    return vc;
  } else if (type === 'VP_SelectiveDisclosure') {
    assert(selectedAttributes, 'no selected attributes provided');

    for (const key in vc.credentialSubject) {
      if (!selectedAttributes.includes(key)) {
        delete vc.credentialSubject[key];
      }
    }
  } else {
    const { hashes, nonceMap, rootHash } = rootHashFromMerkle(
      vc.credentialSubjectHashes,
      vc.credentialSubjectNonceMap
    );

    vc.credentialSubject = rootHash;
    vc.credentialSubjectHashes = hashes;
    vc.credentialSubjectNonceMap = nonceMap;
  }

  return vc;
}

function hashDigests(
  digests: HexString[],
  challenge?: string,
  hashType: HashType = 'Keccak256'
): { hash: HexString; type: HashType } {
  const hash = u8aToHex(u8aConcat(stringToU8a(challenge), ...digests));

  return { hash, type: hashType };
}

export function createPresentation(
  did: Did,
  vc: VerifiableCredential,
  vpType: VerifiablePresentationType = 'VP',
  selectedAttributes?: string[],
  hashType?: HashType,
  challenge?: string
): VerifiablePresentation {
  vc = transformVC(vc, vpType, selectedAttributes);
  const { hash, type: hashTypeOut } = hashDigests([vc.digest], challenge, hashType);

  const { didUrl, signature, type: keyType } = did.signWithKey('authentication', hash);

  return {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    version: '0',
    type: [vpType],
    verifiableCredential: [vc],
    id: hash,
    proof: {
      type: `${hashTypeOut}+${keyTypeToSignatureType(keyType)}`,
      created: Date.now(),
      verificationMethod: didUrl,
      proofPurpose: 'authentication',
      proofValue: base58Encode(signature)
    }
  };
}

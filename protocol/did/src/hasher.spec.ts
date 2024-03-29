// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { u8aToHex } from '@polkadot/util';

import { initCrypto } from '@zcloak/crypto';
import { DidDocument } from '@zcloak/did-resolver/types';

import { hashDidDocument } from './hasher';

const DOCUMENT_ONE: DidDocument = {
  '@context': ['https://www.w3.org/ns/did/v1'],
  id: 'did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1',
  controller: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1'],
  verificationMethod: [
    {
      id: 'did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0',
      controller: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1'],
      type: 'EcdsaSecp256k1VerificationKey2019',
      publicKeyMultibase: 'zgz4zgTUcbvduVZ1Jf3MNMeVeRYP2eiKDJnY7A6PCq3ew'
    },
    {
      id: 'did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-1',
      controller: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1'],
      type: 'X25519KeyAgreementKey2019',
      publicKeyMultibase: 'z13hUFht8HXUi4bmTa6Zz4Mr9j5TXUoRsTtSKnKU6qfR7'
    }
  ],
  authentication: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0'],
  assertionMethod: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0'],
  keyAgreement: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-1'],
  capabilityInvocation: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0'],
  capabilityDelegation: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0'],
  service: [],
  creationTime: 1666263022530
};

const DOCUMENT_TWO: DidDocument = {
  id: 'did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1',
  controller: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1'],
  '@context': ['https://www.w3.org/ns/did/v1'],
  verificationMethod: [
    {
      id: 'did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0',
      type: 'EcdsaSecp256k1VerificationKey2019',
      publicKeyMultibase: 'zgz4zgTUcbvduVZ1Jf3MNMeVeRYP2eiKDJnY7A6PCq3ew',
      controller: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1']
    },
    {
      type: 'X25519KeyAgreementKey2019',
      publicKeyMultibase: 'z13hUFht8HXUi4bmTa6Zz4Mr9j5TXUoRsTtSKnKU6qfR7',
      id: 'did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-1',
      controller: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1']
    }
  ],
  authentication: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0'],
  assertionMethod: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0'],
  keyAgreement: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-1'],
  service: [],
  capabilityDelegation: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0'],
  creationTime: 1666263022531,
  capabilityInvocation: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0']
};

const HASH = '0x1086bc9b75ba37f82225b0fd4d118314f3b34f4d10681a36593509e79552a056';

describe('encode did document', (): void => {
  beforeAll(async () => {
    await initCrypto();
  });

  it('encode', (): void => {
    expect(u8aToHex(hashDidDocument(DOCUMENT_ONE))).toEqual(HASH);
  });

  it('encode with same content and different json', (): void => {
    expect(hashDidDocument(DOCUMENT_ONE)).toEqual(
      hashDidDocument({ ...DOCUMENT_TWO, creationTime: DOCUMENT_ONE.creationTime })
    );
  });

  it('without creationTime', (): void => {
    expect(hashDidDocument(DOCUMENT_ONE)).toEqual(hashDidDocument(DOCUMENT_TWO));
  });
});

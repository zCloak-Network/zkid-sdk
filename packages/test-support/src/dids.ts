// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DidDocument } from '@zcloak/did-resolver/types';

import { keys } from '@zcloak/did';

import { testKeyring } from './keyring';

export const alice = keys.fromMnemonic(
  testKeyring,
  'health correct setup usage father decorate curious copper sorry recycle skin equal'
);
export const bob = keys.fromMnemonic(
  testKeyring,
  'increase help fortune noise jelly bronze hand among like powder crowd swamp'
);
export const charlie = keys.fromMnemonic(
  testKeyring,
  'volume daring fancy soccer verify chronic category hurdle jungle ranch night zoo'
);
export const dave = keys.fromMnemonic(
  testKeyring,
  'risk split police harsh domain radio this country moon screen tragic faith'
);
export const eve = keys.fromMnemonic(
  testKeyring,
  'group drift eagle symptom pride hour cat seven various exercise sphere raccoon'
);
export const ferdie = keys.fromMnemonic(
  testKeyring,
  'lyrics window whale trial web dizzy axis fall use tiny drift anger'
);

export const DOCUMENTS: Record<string, DidDocument> = {
  alice: {
    '@context': ['https://www.w3.org/ns/did/v1'],
    id: 'did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1',
    controller: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1'],
    verificationMethod: [
      {
        id: 'did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0',
        controller: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1'],
        type: 'EcdsaSecp256k1VerificationKey2019',
        publicKeyMultibase: 'zdpxuL2ps42J5jVMJU9DpsMpwnJGsDkTS1N64JC3CbChq'
      },
      {
        id: 'did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-1',
        controller: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1'],
        type: 'X25519KeyAgreementKey2019',
        publicKeyMultibase: 'z9kQXjRwuVoQXKKmotXrkwxMQRhXEQX39A8XfWmZTgb4'
      }
    ],
    authentication: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0'],
    assertionMethod: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0'],
    keyAgreement: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-1'],
    capabilityInvocation: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0'],
    capabilityDelegation: ['did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0'],
    service: []
  }
};

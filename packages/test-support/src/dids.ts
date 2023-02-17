// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DidDocument } from '@zcloak/did-resolver/types';

import { helpers } from '@zcloak/did';

import { testKeyring } from './keyring';

export const alice = helpers.createEcdsaFromMnemonic(
  'health correct setup usage father decorate curious copper sorry recycle skin equal',
  testKeyring
);
export const bob = helpers.createEcdsaFromMnemonic(
  'increase help fortune noise jelly bronze hand among like powder crowd swamp',
  testKeyring
);
export const charlie = helpers.createEcdsaFromMnemonic(
  'volume daring fancy soccer verify chronic category hurdle jungle ranch night zoo',
  testKeyring
);
export const dave = helpers.createEcdsaFromMnemonic(
  'risk split police harsh domain radio this country moon screen tragic faith',
  testKeyring
);
export const eve = helpers.createEcdsaFromMnemonic(
  'group drift eagle symptom pride hour cat seven various exercise sphere raccoon',
  testKeyring
);
export const ferdie = helpers.createEcdsaFromMnemonic(
  'lyrics window whale trial web dizzy axis fall use tiny drift anger',
  testKeyring
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

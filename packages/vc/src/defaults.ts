// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type {
  HashType,
  SignatureType,
  VerifiableCredentialVersion,
  VerifiablePresentationType,
  VerifiablePresentationVersion
} from './types';

export const DEFAULT_VC_VERSION: VerifiableCredentialVersion = '0';

export const DEFAULT_VP_VERSION: VerifiablePresentationVersion = '0';

export const DEFAULT_CONTEXT: string[] = ['https://www.w3.org/2018/credentials/v1'];

export const DEFAULT_DIGEST_HASH_TYPE: HashType = 'Keccak256';

export const DEFAULT_ROOT_HASH_TYPE: HashType = 'RescuePrime';

export const DEFAULT_VP_HASH_TYPE: HashType = 'Keccak256';

export const ALL_HASH_TYPES: HashType[] = [
  'RescuePrime',
  'Blake3',
  'Blake2',
  'Keccak256',
  'Keccak512',
  'Sha256',
  'Sha512'
];

export const ALL_VP_TYPES: VerifiablePresentationType[] = [
  'VP',
  'VP_Digest',
  'VP_SelectiveDisclosure'
];

export const ALL_SIG_TYPES: SignatureType[] = [
  'EcdsaSecp256k1Signature2019',
  'Ed25519Signature2018'
];

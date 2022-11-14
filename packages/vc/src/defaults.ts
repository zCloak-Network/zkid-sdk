// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HashType, VerifiableCredentialVersion, VerifiablePresentationVersion } from './types';

export const DEFAULT_VC_VERSION: VerifiableCredentialVersion = '0';

export const DEFAULT_VP_VERSION: VerifiablePresentationVersion = '0';

export const DEFAULT_CONTEXT: string[] = ['https://www.w3.org/2018/credentials/v1'];

export const DEFAULT_DIGEST_HASH_TYPE: HashType = 'Keccak256';

export const DEFAULT_ROOT_HASH_TYPE: HashType = 'Rescue';

export const DEFAULT_VP_HASH_TYPE: HashType = 'Keccak256';

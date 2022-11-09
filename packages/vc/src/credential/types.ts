// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidUrl } from '@zcloak/did-resolver/types';
import type { AnyJson, HashType } from '../types';

export interface ISubject {
  contents: AnyJson;
  owner: DidUrl;
  ctype: HexString;
  hashType: HashType;

  rootHash?: HexString;
  hashes?: HexString[];
  nonceMap?: Record<HexString, HexString>;
}

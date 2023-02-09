// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { CType } from '@zcloak/ctype/types';
import type { DidUrl } from '@zcloak/did-resolver/types';
import type { AnyJson, HashType } from '../types';

export interface IRaw {
  contents: AnyJson;
  owner: DidUrl;
  ctype: CType;
  hashType: HashType;

  nonceMap?: Record<HexString, HexString>;
}

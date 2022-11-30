// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '../types';

export type RlpInput =
  | string
  | number
  | boolean
  | bigint
  | HexString
  | Uint8Array
  | null
  | undefined;

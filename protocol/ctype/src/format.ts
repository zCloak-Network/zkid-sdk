// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { isDidUrl } from '@zcloak/did';

export function validateDid(value: any): boolean {
  return isDidUrl(value);
}

export function validateTimestamp(value: any): boolean {
  return Number.isInteger(value);
}

export function validateNationalCode(value: any): boolean {
  return Number.isInteger(value);
}

// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getRandomValues as getRandomValuesBrowser } from './browser.js';
import { insecureRandomValues } from './fallback.js';
import { xglobal } from './xglobal.js';

export const getRandomValues =
  typeof xglobal.crypto === 'object' && typeof xglobal.crypto.getRandomValues === 'function'
    ? getRandomValuesBrowser
    : insecureRandomValues;

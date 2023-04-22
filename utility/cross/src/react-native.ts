// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Adapted from https://github.com/LinusU/react-native-get-random-values/blob/85f48393821c23b83b89a8177f56d3a81dc8b733/index.js
// Copyright (c) 2018, 2020 Linus Unnebäck
// SPDX-License-Identifier: MIT

import { xglobal } from '@polkadot/x-global';

import { getRandomValues as getRandomValuesBrowser } from './browser.js';
import { insecureRandomValues } from './fallback.js';

export const getRandomValues =
  typeof xglobal.crypto === 'object' && typeof xglobal.crypto.getRandomValues === 'function'
    ? getRandomValuesBrowser
    : insecureRandomValues;

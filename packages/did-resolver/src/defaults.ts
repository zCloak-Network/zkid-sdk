// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DidResolver } from './DidResolver';
import { ArweaveDidResolver } from '.';

export const defaultResolver: DidResolver = new ArweaveDidResolver();

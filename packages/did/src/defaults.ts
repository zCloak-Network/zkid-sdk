// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ArweaveDidResolver } from '@zcloak/did-resolver';
import { DidResolver } from '@zcloak/did-resolver/DidResolver';

export const defaultResolver: DidResolver = new ArweaveDidResolver();

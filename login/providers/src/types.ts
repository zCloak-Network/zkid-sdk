// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BaseProvider } from './base/Provider';

export type ProviderEvents = 'did_changed' | 'lock' | 'unlock';
type HexString = `0x${string}`;

export interface ZkidWalletProvider extends BaseProvider {
  importCredential(data: HexString): Promise<void>;
}

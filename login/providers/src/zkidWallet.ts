// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ExtensionProvider } from './ExtensionProvider';
import { PostMessageProvider } from './PostMessageProvider';
import { ZkidWalletProvider } from './types';

export function adaptZkidWallet(allowedOrigins: RegExp[] | null = null): ZkidWalletProvider {
  if (self !== parent) {
    return new PostMessageProvider(allowedOrigins);
  } else {
    return new ExtensionProvider();
  }
}

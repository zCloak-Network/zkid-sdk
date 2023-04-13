// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Request, RpcMethods, RpcRequest } from '@zcloak/login-rpc';
import type { ZkidWalletProvider } from './types';

import { BaseProvider } from './base/Provider';

declare module '@zcloak/login-rpc/rpcs' {
  interface Rpcs {
    credential_import: [{ credential: HexString }, undefined];
  }
}

declare global {
  interface Window {
    zkid?: { request: Request; events: any };
  }
}

type HexString = `0x${string}`;

const waitReady: Promise<void> = new Promise<void>((resolve) => {
  if (document.readyState === 'complete') {
    resolve();
  } else {
    self.addEventListener('load', () => resolve());
  }
});

const request: Request = async (method: RpcMethods, params: RpcRequest<RpcMethods>) => {
  await waitReady;
  if (!self.zkid) throw new Error('Please install zkID Wallet');

  return self.zkid.request(method, params);
};

export class ExtensionProvider extends BaseProvider implements ZkidWalletProvider {
  public static async isInstalled(): Promise<boolean> {
    await ExtensionProvider.isReady();

    return !!self.zkid;
  }

  public static isReady(): Promise<void> {
    return waitReady;
  }

  constructor() {
    super(request);

    waitReady.then(() => {
      if (!self.zkid) {
        console.warn(
          'Not zkID Wallet context, please install zkID Wallet https://chrome.google.com/webstore/detail/zkid-wallet/ahkpfejaeoepmfopmbhjgjekibmfcfgo'
        );
      }
    });

    self.zkid?.events?.on?.('zkID_Wallet_didLoggedChanged', this.#didChanged);
    self.zkid?.events?.on?.('zkID_Wallet_lock', this.#lock);
    self.zkid?.events?.on?.('zkID_Wallet_unlock', this.#unlock);
  }

  #didChanged = (...args: any[]) => {
    this.emit('did_changed', ...args);
  };

  #lock = (...args: any[]) => {
    this.emit('lock', ...args);
  };

  #unlock = (...args: any[]) => {
    this.emit('unlock', ...args);
  };

  public importCredential(data: HexString) {
    return this.request('credential_import', { credential: data });
  }
}

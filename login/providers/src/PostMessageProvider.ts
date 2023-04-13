// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ZkidWalletProvider } from './types';

import {
  isTransportEventMessage,
  isTransportResponseMessage,
  Request,
  RpcMethods,
  RpcRequest,
  RpcResponse
} from '@zcloak/login-rpc';

import { BaseProvider } from './base/Provider';

type Handlers = Record<
  string,
  {
    resolve: (data: RpcResponse<RpcMethods>) => void;
    reject: (error: Error) => void;
  }
>;
type HexString = `0x${string}`;

let increaseId = 0;

const handlers: Handlers = {};

const request: Request = (method: RpcMethods, params: RpcRequest<RpcMethods>) => {
  if (self === parent) throw new Error('Please open on zkID Wallet');

  return new Promise((resolve, reject) => {
    const id = `${Date.now()}.${increaseId++}`;

    handlers[id] = { reject, resolve };

    const message = {
      jsonrpc: '2.0',
      id,
      method,
      params
    };

    parent.postMessage(message, '*');
  });
};

export class PostMessageProvider extends BaseProvider implements ZkidWalletProvider {
  private readonly allowedOrigins: RegExp[] | null = null;

  constructor(allowedOrigins: RegExp[] | null = null) {
    super(request);

    this.allowedOrigins = allowedOrigins;
    self.addEventListener('message', this.#handleMessage);
  }

  private isValidMessage = ({ data, origin, source }: MessageEvent): boolean => {
    const emptyOrMalformed = !data;
    const sentFromParentEl = source === parent;
    let validOrigin = true;

    if (Array.isArray(this.allowedOrigins)) {
      validOrigin = this.allowedOrigins.find((regExp) => regExp.test(origin)) !== undefined;
    }

    return !emptyOrMalformed && sentFromParentEl && validOrigin;
  };

  #handleMessage = (message: MessageEvent) => {
    if (this.isValidMessage(message)) {
      if (isTransportEventMessage(message.data)) {
        // event transport message

        if (message.data.event === 'zkID_Wallet_didLoggedChanged') {
          this.emit('did_changed', message.data.data);
        } else if (message.data.event === 'zkID_Wallet_lock') {
          this.emit('lock', message.data.data);
        } else if (message.data.event === 'zkID_Wallet_unlock') {
          this.emit('unlock', message.data.data);
        }
      } else if (isTransportResponseMessage(message.data)) {
        // response transport message

        const handler = handlers[message.data.id];

        if (!handler) {
          console.error(`Unknown response: ${JSON.stringify(message.data)}`);

          return;
        }

        delete handlers[message.data.id];

        if (message.data.error) {
          handler.reject(new Error(message.data.error.message));
        } else {
          handler.resolve(message.data.result);
        }
      }
    }
  };

  public importCredential(data: HexString) {
    return this.request('credential_import', { credential: data });
  }
}

// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DidUrl } from '@zcloak/did-resolver/types';

import { assert, isHex, isString, isU8a, numberToHex, stringToHex, u8aToHex } from '@polkadot/util';

import { BaseProvider } from '@zcloak/login-providers/base/Provider';
import { isTransportResponseMessage, Request, RpcMethods, RpcRequest, RpcResponse } from '@zcloak/login-rpc';
import { DidSignature } from '@zcloak/login-rpc-defines/defineZk';

import { POPUPREADY } from './default';

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

const request: Request = (method: RpcMethods, params: RpcRequest<RpcMethods>, targetWindow?: Window | null) => {
  assert(targetWindow, 'TargetWindow error occurred while opening the popup wallet.');

  const channel = new MessageChannel();

  return new Promise((resolve, reject) => {
    const id = `${Date.now()}.${increaseId++}`;

    handlers[id] = { reject, resolve };

    const message = {
      jsonrpc: '2.0',
      id,
      method,
      params
    };

    channel.port1.onmessage = handleMessage;

    targetWindow.postMessage(message, '*', [channel.port2]);
  });
};

const handleMessage = (message: MessageEvent) => {
  if (isTransportResponseMessage(message.data)) {
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
};

export class PopupProvider extends BaseProvider {
  private targetUrl: string;
  private targetWindow: Window | undefined | null;
  protected override request: Request;

  constructor(targetUrl: string) {
    super(request);
    this.request = request;
    this.targetUrl = targetUrl;
  }

  private ensureTargetWindowOpened(): Promise<void> {
    return new Promise((resolve) => {
      this.targetWindow = window.open(
        `${this.targetUrl}?requestAppUrl=${window.location.origin}&requestAppTitle=${window.document.title}`,
        'Popup',
        'width=600,height=800'
      );

      window.addEventListener('message', (event) => {
        if (event.data === POPUPREADY) {
          resolve();
        }
      });
    });
  }

  public override async getCurrentDid(): Promise<RpcResponse<'did_getCurrent'>> {
    await this.ensureTargetWindowOpened();

    return this.request('did_getCurrent', undefined, this.targetWindow);
  }

  public override async sign(
    data: string | Uint8Array,
    keyId?:
      | `did:zk:${string}`
      | 'controller'
      | 'authentication'
      | 'assertionMethod'
      | 'capabilityInvocation'
      | 'capabilityDelegation'
      | undefined
  ): Promise<DidSignature> {
    await this.ensureTargetWindowOpened();

    const payload = isHex(data) ? data : isU8a(data) ? u8aToHex(data) : isString(data) ? stringToHex(data) : data;

    return this.request('did_sign', { payload, keyId }, this.targetWindow);
  }

  public override async isAuth(): Promise<boolean> {
    return Promise.resolve(true);
  }

  public override async decrypt(
    data: string | number | Uint8Array,
    sender: `did:zk:${string}`
  ): Promise<`0x${string}`> {
    await this.ensureTargetWindowOpened();

    const message: HexString = isHex(data)
      ? data
      : isU8a(data)
      ? u8aToHex(data)
      : isString(data)
      ? stringToHex(data)
      : numberToHex(data);

    return this.request('did_decrypt', { message, sender }, this.targetWindow);
  }

  public override async encrypt(
    data: HexString | Uint8Array | string | number,
    receiver: DidUrl
  ): Promise<RpcResponse<'did_encrypt'>> {
    await this.ensureTargetWindowOpened();

    const message: HexString = isHex(data)
      ? data
      : isU8a(data)
      ? u8aToHex(data)
      : isString(data)
      ? stringToHex(data)
      : numberToHex(data);

    return this.request('did_encrypt', { message, receiver }, this.targetWindow);
  }

  public override async batchSign(params: RpcRequest<'batch_sign'>): Promise<RpcResponse<'batch_sign'>> {
    await this.ensureTargetWindowOpened();

    return this.request('batch_sign', params, this.targetWindow);
  }

  public override async batchEncrypt(params: RpcRequest<'batch_encrypt'>): Promise<RpcResponse<'batch_encrypt'>> {
    await this.ensureTargetWindowOpened();

    return this.request('batch_encrypt', params, this.targetWindow);
  }

  public override async batchDecrypt(params: RpcRequest<'batch_decrypt'>): Promise<RpcResponse<'batch_decrypt'>> {
    await this.ensureTargetWindowOpened();

    return this.request('batch_decrypt', params, this.targetWindow);
  }
}

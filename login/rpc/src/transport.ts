// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { RpcErrorInterface } from './errors';
import type { RpcEvents, RpcEventTypes, RpcMethods, RpcRequest, RpcResponse } from './rpcs';

import { isObject } from '@polkadot/util';

export interface TransportRequestMessage<Method extends RpcMethods> {
  jsonrpc: '2.0';
  method: Method;
  params: RpcRequest<Method>;
  id: string;
}

export interface TransportResponseMessage<Method extends RpcMethods> {
  jsonrpc: '2.0';
  result: RpcResponse<Method>;
  id: string;
  error?: RpcErrorInterface;
}

export interface TransportEventMessage<Type extends RpcEventTypes> {
  event: Type;
  data: RpcEvents[Type];
}

export function isTransportRequestMessage<T extends RpcMethods = RpcMethods>(
  value: unknown
): value is TransportRequestMessage<T> {
  return (
    isObject(value) && Object.hasOwn(value, 'jsonrpc') && Object.hasOwn(value, 'id') && Object.hasOwn(value, 'method')
  );
}

export function isTransportResponseMessage<T extends RpcMethods = RpcMethods>(
  value: unknown
): value is TransportResponseMessage<T> {
  return isObject(value) && Object.hasOwn(value, 'jsonrpc') && Object.hasOwn(value, 'id');
}

export function isTransportEventMessage<T extends RpcEventTypes = RpcEventTypes>(
  value: unknown
): value is TransportEventMessage<T> {
  return isObject(value) && Object.hasOwn(value, 'event') && Object.hasOwn(value, 'data');
}

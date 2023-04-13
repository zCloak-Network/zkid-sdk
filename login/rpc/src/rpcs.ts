// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Rpcs {}

export type RpcMethods = keyof Rpcs;

export type RpcRequest<Method extends RpcMethods> = Rpcs[Method][0];

export type RpcResponse<Method extends RpcMethods> = Rpcs[Method][1];

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RpcEvents {}

export type RpcEventTypes = keyof RpcEvents;

// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface RpcErrorInterface {
  code: number;
  message: string;
  meaning: string;
}

export class RpcError extends Error {
  public code: number;
  public meaning: string;

  constructor(code: number, message: string, meaning: string) {
    super(message);
    this.code = code;
    this.meaning = meaning;
  }

  public toJson(): RpcErrorInterface {
    return {
      code: this.code,
      message: this.message,
      meaning: this.meaning
    };
  }

  public static fromCode(code: number): RpcErrorInterface {
    switch (code) {
      case -32700:
        return new RpcError(
          code,
          'Parse error',
          'Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.'
        ).toJson();
      case -32600:
        return new RpcError(code, 'Invalid Request', 'The JSON sent is not a valid Request object.').toJson();
      case -32601:
        return new RpcError(code, 'Method not found', 'The method does not exist / is not available.').toJson();
      case -32602:
        return new RpcError(code, 'Invalid params', 'Invalid method parameter(s).').toJson();
      case -32603:
        return new RpcError(code, 'Internal error', 'Internal JSON-Rpc error.').toJson();
      case -32001:
        return new RpcError(code, 'User Reject', 'User reject operation').toJson();
      default:
        return new RpcError(code, 'Unknown Error', 'Unknown Error').toJson();
    }
  }

  public static fromError(error: any): RpcErrorInterface {
    return new RpcError(
      error?.code ?? -1,
      error?.message ?? 'Unknown Error',
      error?.reason ?? 'Unknown Error'
    ).toJson();
  }
}

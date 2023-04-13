// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface DataTypeProperty {
  name: string;
  type: string;
}

export interface DataTypes {
  [additionalProperties: string]: DataTypeProperty[];
}

export interface TypedData {
  types: DataTypes;
  primaryType: string;
  domain: {
    name?: string;
    version?: string;
    chainId?: number;
    verifyingContract?: string;
    salt?: string;
  };
  message: Record<string, unknown>;
}

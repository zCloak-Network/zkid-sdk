// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DidUrl } from '@zcloak/did-resolver/types';

export type InstanceType = 'array' | 'boolean' | 'integer' | 'null' | 'number' | 'string';

export type InstanceFormat =
  | 'date'
  | 'time'
  | 'date-time'
  | 'duration'
  | 'url'
  | 'email'
  | 'hostname'
  | 'ipv4'
  | 'ipv6'
  | 'int32'
  | 'int64'
  | 'uint32'
  | 'uint64'
  | 'float'
  | 'double'
  | 'bytes'
  | 'hex'
  | 'did';

export type CTypeSchema = {
  type: InstanceType;
  format?: InstanceFormat;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
  multipleOf?: number;
  minLength?: number;
  maxLength?: number;
  formatMaximum?: string;
  formatMinimum?: string;
  formatExclusiveMaximum?: string;
  formatExclusiveMinimum?: string;
};

export interface BaseCType {
  title: string;
  description: string;
  type: 'object';
  properties: Record<string, CTypeSchema>;
  required?: string[];
}

export interface ICType extends BaseCType {
  $id: string;
  $schema: string;
  publisher: DidUrl;
  signature: string;
}

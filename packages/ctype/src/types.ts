// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidUrl } from '@zcloak/did-resolver/types';

export type CTypeVersion = '1';

export type InstanceType =
  | 'object'
  | 'array'
  | 'boolean'
  | 'integer'
  | 'null'
  | 'number'
  | 'string';

export type InstanceFormat =
  | 'date'
  | 'time'
  | 'date-time'
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
  type?: InstanceType;
  format?: InstanceFormat;
  formatMaximum?: string;
  formatMinimum?: string;
  formatExclusiveMaximum?: string;
  formatExclusiveMinimum?: string;
  enum?: (string | number)[];
  // for number
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
  multipleOf?: number;
  // for string
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  // for array
  items?: CTypeSchema | CTypeSchema[];
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  // for object
  properties?: Record<string, CTypeSchema>;
  required?: string[] | boolean;
};

export interface BaseCType extends CTypeSchema {
  title: string;
  description: string;
  type: 'object';
  properties: Record<string, CTypeSchema>;
  required?: string[];
}

export interface CType extends BaseCType {
  $id: HexString;
  $schema: string;
  publisher: DidUrl;
  signature: string;
}

// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { base64 } from '@scure/base';

import { createDecode, createEncode, createIs, createValidate } from './helpers';

const config = {
  chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
  coder: base64,
  prefix: 'm',
  type: 'base64'
};

/**
 * @description
 * Validates that the supplied value is valid base64
 */
export const base64Validate = createValidate(config);

/**
 * @description Checks if the input is in base64, returning true/false
 */
export const isBase64 = createIs(base64Validate);

/**
 * @description
 * From the provided input, decode the base64 and return the result as an `Uint8Array`.
 */
export const base64Decode = createDecode(config, base64Validate);

/**
 * @description
 * From the provided input, create the base64 and return the result as a string.
 */
export const base64Encode = createEncode(config);

// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { utils } from '@scure/base';

import { createDecode, createEncode, createIs, createValidate } from './helpers';

const chars = 'abcdefghijklmnopqrstuvwxyz234567';

const config = {
  chars,
  coder: utils.chain(
    // We define our own chain, the default base32 has padding
    utils.radix2(5),
    utils.alphabet(chars),
    {
      decode: (input: string) => input.split(''),
      encode: (input: string[]) => input.join('')
    }
  ),
  prefix: 'b',
  type: 'base32'
};

/**
 * @description
 * Validates that the supplied value is valid base32, throwing exceptions if not
 */
export const base32Validate = createValidate(config);

/**
 * @description Checks if the input is in base32, returning true/false
 */
export const isBase32 = createIs(base32Validate);

/**
 * @description
 * From the provided input, decode the base32 and return the result as an `Uint8Array`.
 */
export const base32Decode = createDecode(config, base32Validate);

/**
 * @description
 * From the provided input, create the base32 and return the result as a string.
 */
export const base32Encode = createEncode(config);

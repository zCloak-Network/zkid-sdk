import { base58 } from '@scure/base';

import { createDecode, createEncode, createIs, createValidate } from './helpers';

const config = {
  chars: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
  coder: base58,
  prefix: 'z',
  type: 'base58'
};

/**
 * @description
 * Validates that the supplied value is valid base58, throwing exceptions if not
 */
export const base58Validate = createValidate(config);

/**
 * @description
 * From the provided input, decode the base58 and return the result as an `Uint8Array`.
 */
export const base58Decode = createDecode(config, base58Validate);

/**
 * @description
 * From the provided input, create the base58 and return the result as a string.
 */
export const base58Encode = createEncode(config);

/**
 * @description Checks if the input is in base58, returning true/false
 */
export const isBase58 = createIs(base58Validate);

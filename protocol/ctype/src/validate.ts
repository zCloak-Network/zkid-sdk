// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BaseCType } from './types';

import { Validator, ValidatorResult } from 'jsonschema';

import { validateDid, validateNationalCode, validateTimestamp } from './format';

const validator = new Validator();

validator.customFormats = {
  did: validateDid,
  timestamp: validateTimestamp,
  'national-code': validateNationalCode
};

/**
 * @name validateSubject
 * @summary Validate subject data structure
 * @description
 * Use the `ctype` to validate `subject` data structure, Returns `true` on success, `false` otherwise.
 */
export function validateSubject(ctype: BaseCType, subject: any): ValidatorResult {
  const result = validator.validate(subject, ctype);

  return result;
}

/**
 * @name validateSubjectPartial
 * @summary Validate partial subject data structure
 * @description
 * Use the `ctype` to validate `subject` partial data structure, Returns `true` on success, `false` otherwise.
 */
export function validateSubjectPartial(ctype: BaseCType, subject: any): ValidatorResult {
  const result = validator.validate(subject, { ...ctype, required: [] });

  return result;
}

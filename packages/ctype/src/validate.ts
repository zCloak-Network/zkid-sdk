// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AnyJson } from '@zcloak/vc/types';
import type { BaseCType } from './types';

import Ajv from 'ajv';

/**
 * @name validateSubject
 * @summary Validate subject data structure
 * @description
 * Use the `ctype` to validate `subject` data structure, Returns `true` on success, `false` otherwise.
 */
export function validateSubject(ctype: BaseCType, subject: AnyJson): boolean {
  const ajv = new Ajv();

  const validate = ajv.compile(ctype);

  return validate(subject);
}

/**
 * @name validateSubjectPartial
 * @summary Validate partial subject data structure
 * @description
 * Use the `ctype` to validate `subject` partial data structure, Returns `true` on success, `false` otherwise.
 */
export function validateSubjectPartial(ctype: BaseCType, subject: AnyJson): boolean {
  const ajv = new Ajv();

  const validate = ajv.compile({ ...ctype, required: [] });

  return validate(subject);
}

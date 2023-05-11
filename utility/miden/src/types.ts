// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

export type ConstraintOperation =
  // for array
  | 'membership_in'
  | 'membership_out'
  // for number
  | 'gt'
  | 'gte'
  | 'neq'
  | 'lte'
  | 'lt'
  // for string
  | 'contain'
  | 'uncontain'
  | 'start with'
  | 'end with';

export type ConstraintField = number;

export interface ProgramConstraints {
  fields: ConstraintField[];
  operation: ConstraintOperation[];
  value: ConstraintField | ConstraintField[];
}

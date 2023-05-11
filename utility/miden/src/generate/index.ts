// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ConstraintField, ConstraintOperation, ProgramConstraints } from '../types';

import { isArray, isNumber } from '@polkadot/util';

import {
  prepareAuthPath,
  prepareMembershipInOperation,
  prepareNumberOperationSingle,
  prepareStringOperation,
  preprareMembershipOutOperation
} from './prepare';
import { PROGRAM } from './program';

export function generateProgram(leavesCounts: number, constraints: ProgramConstraints[]) {
  let wholeProgram = PROGRAM;

  for (const constraint of constraints) {
    const constraintProgram = handleSingleConstraint(
      leavesCounts,
      constraint.fields[0],
      constraint.operation[0],
      constraint.value
    );

    wholeProgram = `${wholeProgram} ${constraintProgram}`;
  }

  wholeProgram = `
${wholeProgram}
    mem_load.101 padw mem_loadw.100
end`;

  return wholeProgram;
}

// handle single constraint, prepare auth-proc and cons-proc.
function handleSingleConstraint(
  leavesCounts: number,
  fields: ConstraintField,
  operation: ConstraintOperation,
  value: ConstraintField | ConstraintField[]
) {
  const authProgram = prepareAuthPath(leavesCounts, fields); // [ 'left', 'right', 'right' ]
  let constraintProgram: string;

  if (typeof value === 'string') {
    constraintProgram = prepareStringOperation(operation, value);
  } else if (isNumber(value)) {
    constraintProgram = prepareNumberOperationSingle(operation, value);
  } else if (isArray(value)) {
    if (operation === 'membership_in') {
      constraintProgram = prepareMembershipInOperation(value);
    } else if (operation === 'membership_out') {
      constraintProgram = preprareMembershipOutOperation(value);
    } else {
      throw new Error('The operation for array value is wrong!');
    }
  } else {
    throw new Error('only support string, number, array for value');
  }

  return `${authProgram} ${constraintProgram}`;
}

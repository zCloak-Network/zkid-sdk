// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ProgramConstraints } from '../types';
// eslint-disable-next-line camelcase
import { unstable_generateProgram } from '.';

describe('generate miden program', (): void => {
  it('generateProgram number lt and leavesCounts = 4', () => {
    const constraints: ProgramConstraints[] = [
      {
        fields: [1],
        operation: ['lt'],
        value: 1104508800
      }
    ];

    expect(() => unstable_generateProgram(4, constraints)).not.toThrow();
  });

  it('generateProgram number membership_in and leavesCounts = 4', () => {
    const constraints: ProgramConstraints[] = [
      {
        fields: [2],
        operation: ['membership_in'],
        value: [
          40, 56, 100, 196, 203, 276, 208, 724, 233, 246, 250, 300, 191, 348, 372, 380, 440, 442, 428, 470, 528, 616,
          642, 703, 705, 752
        ]
      }
    ];

    expect(() => unstable_generateProgram(4, constraints)).not.toThrow();
  });

  it('generateProgram number membership_in throw error when value not array', () => {
    const constraints: ProgramConstraints[] = [
      {
        fields: [2],
        operation: ['membership_in'],
        value: 4
      }
    ];

    expect(() => unstable_generateProgram(4, constraints)).toThrow('error number compare operation');
  });
});

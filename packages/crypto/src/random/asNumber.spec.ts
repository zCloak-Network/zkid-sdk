// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { randomAsNumber } from '.';

describe('randomAsNumber', (): void => {
  it('generates subsequent non-matching numbers', (): void => {
    expect(randomAsNumber()).not.toEqual(randomAsNumber());
  });
});

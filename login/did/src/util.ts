// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { isHex } from '@polkadot/util';
import { ethers, toBeHex } from 'ethers';

export const bigNumberishToHex = (value: BigNumberish): string => {
  if (isHex(value)) {
    return value;
  }

  if (typeof value === 'bigint' || typeof value === 'number' || typeof value === 'string') {
    return toBeHex(value);
  }

  if (ethers.isBytesLike(value)) {
    return ethers.hexlify(value);
  }

  if (value instanceof BigNumber) {
    return value.toHexString();
  }

  throw new Error(`Convert ${value} to hex failed.`);
};

// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initCrypto } from '../initCrypto';
import { isEthereumAddress } from './';

const ADDRESS = '0x00a329c0648769A73afAc7F9381E08FB43dBEA72';

describe('isEthereumAddress', () => {
  beforeAll(async () => {
    await initCrypto();
  });

  it('returns true when fully lowercase', () => {
    expect(isEthereumAddress(ADDRESS.toLowerCase())).toBe(true);
  });

  it('returns true when fully uppercase', () => {
    expect(isEthereumAddress(ADDRESS.toUpperCase().replace('0X', '0x'))).toBe(true);
  });

  it('returns true when checksummed', () => {
    expect(isEthereumAddress(ADDRESS)).toBe(true);
  });

  it('returns false when empty address', () => {
    expect(isEthereumAddress()).toBe(false);
  });

  it('returns false when invalid address', () => {
    expect(isEthereumAddress('0xinvalid')).toBe(false);
  });

  it('returns false when invalid address of correct length', () => {
    expect(isEthereumAddress('0xinvalid000123456789012345678901234567890')).toBe(false);
  });
});

// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initCrypto } from '../initCrypto';
import { isEthereumChecksum } from './';

const ADDRESS = '0x00a329c0648769A73afAc7F9381E08FB43dBEA72';

describe('isEthereumChecksum', () => {
  beforeAll(async () => {
    await initCrypto();
  });

  it('returns false on invalid address', () => {
    expect(isEthereumChecksum('0x00a329c0648769')).toBe(false);
  });

  it('returns false on non-checksum address', () => {
    expect(isEthereumChecksum('0x1234567890abcdeedcba1234567890abcdeedcba')).toBe(false);
  });

  it('returns false when fully lowercase', () => {
    expect(isEthereumChecksum(ADDRESS.toLowerCase())).toBe(false);
  });

  it('returns false when fully uppercase', () => {
    expect(isEthereumChecksum(ADDRESS.toUpperCase().replace('0X', '0x'))).toBe(false);
  });

  it('returns true on a checksummed address', () => {
    expect(isEthereumChecksum(ADDRESS)).toBe(true);
  });
});

// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { hexToU8a, stringToU8a } from '@polkadot/util';

import { initCrypto } from '../initCrypto';
import { keccak256AsU8a, keccak512AsU8a } from '.';

describe('keccakAsU8a', (): void => {
  beforeAll(async (): Promise<void> => {
    await initCrypto();
  });

  const input = 'test value';
  const output = {
    256: hexToU8a('0x2d07364b5c231c56ce63d49430e085ea3033c750688ba532b24029124c26ca5e'),
    512: hexToU8a(
      '0xc1b50cc57f85ccd968a9d7c7a809dcebd140a548c8e0b67f3afcdd6fc14cca2b1d04187aef24ba0081b74f2ec362431e425760febe94a5607790854cafe5b197'
    )
  };

  describe('keccak256', () => {
    it('returns an hex representation (string)', (): void => {
      expect(keccak256AsU8a(input)).toEqual(output[256]);
    });

    it('returns an hex representation (Buffer)', (): void => {
      expect(keccak256AsU8a(Buffer.from(input))).toEqual(output[256]);
    });

    it('returns an hex representation (Uint8Array)', (): void => {
      expect(keccak256AsU8a(stringToU8a(input))).toEqual(output[256]);
    });
  });

  describe('keccak512', () => {
    it('returns an hex representation (string)', (): void => {
      expect(keccak512AsU8a(input)).toEqual(output[512]);
    });

    it('returns an hex representation (Buffer)', (): void => {
      expect(keccak512AsU8a(Buffer.from(input))).toEqual(output[512]);
    });

    it('returns an hex representation (Uint8Array)', (): void => {
      expect(keccak512AsU8a(stringToU8a(input))).toEqual(output[512]);
    });
  });
});

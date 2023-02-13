// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Keypair } from '../types';

import { u8aToHex, u8aToNumber } from '@polkadot/util';

import { ethereumEncode } from '../ethereum';
import { initCrypto } from '../initCrypto';
import { keccak256AsU8a } from '../keccak';
import { secp256k1PairFromSeed, secp256k1Sign } from '../secp256k1';
import { encodeData, encodeType, getMessage, structHash, typeHash } from './eip712';

const typedData = {
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' }
    ],
    Person: [
      { name: 'name', type: 'string' },
      { name: 'wallet', type: 'address' }
    ],
    Mail: [
      { name: 'from', type: 'Person' },
      { name: 'to', type: 'Person' },
      { name: 'contents', type: 'string' }
    ]
  },
  primaryType: 'Mail',
  domain: {
    name: 'Ether Mail',
    version: '1',
    chainId: 1,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
  },
  message: {
    from: {
      name: 'Cow',
      wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
    },
    to: {
      name: 'Bob',
      wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
    },
    contents: 'Hello, Bob!'
  }
};

describe('EIP-712', (): void => {
  let pair: Keypair;

  beforeAll(async (): Promise<void> => {
    await initCrypto();
    pair = secp256k1PairFromSeed(keccak256AsU8a('cow'));
  });

  it('eip712 encodeType', () => {
    expect(encodeType(typedData, 'Mail')).toBe(
      'Mail(Person from,Person to,string contents)Person(string name,address wallet)'
    );
  });

  it('eip712 typeHash', () => {
    expect(u8aToHex(typeHash(typedData, 'Mail'))).toBe(
      '0xa0cedeb2dc280ba39b857546d74f5549c3a1d7bdc2dd96bf881f76108e23dac2'
    );
  });

  it('eip712 encodeData', () => {
    expect(u8aToHex(encodeData(typedData, typedData.primaryType, typedData.message))).toBe(
      '0xa0cedeb2dc280ba39b857546d74f5549c3a1d7bdc2dd96bf881f76108e23dac2fc71e5fa27ff56c350aa531bc129ebdf613b772b6604664f5d8dbe21b85eb0c8cd54f074a4af31b4411ff6a60c9719dbd559c221c8ac3492d9d872b041d703d1b5aadf3154a261abdd9086fc627b61efca26ae5702701d05cd2305f7c52a2fc8'
    );
  });

  it('eip712 structHash', () => {
    expect(u8aToHex(structHash(typedData, typedData.primaryType, typedData.message))).toBe(
      '0xc52c0ee5d84264471806290a3f2c4cecfc5490626bf912d01f240d7a274b371e'
    );
    expect(u8aToHex(structHash(typedData, 'EIP712Domain', typedData.domain))).toBe(
      '0xf2cee375fa42b42143804025fc449deafd50cc031ca257e0b194a650a912090f'
    );
  });

  it('eip712 getMessage', () => {
    expect(u8aToHex(getMessage(typedData, true))).toBe(
      '0xbe609aee343fb3c4b28e1df9e632fca64fcfaede20f02e86244efddf30957bd2'
    );
  });

  it('eip712 getMessage signature', () => {
    const message = getMessage(typedData, true);

    expect(ethereumEncode(pair.publicKey)).toBe(
      ethereumEncode('0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826')
    );
    const signature = secp256k1Sign(message, pair);

    const v = signature.slice(-1);
    const r = signature.slice(0, 32);
    const s = signature.slice(32, 64);

    expect(u8aToNumber(v)).toBe(1);
    expect(u8aToHex(r)).toBe('0x4355c47d63924e8a72e509b65029052eb6c299d53a04e167c5775fd466751c9d');
    expect(u8aToHex(s)).toBe('0x07299936d304c153f6443dfa05f40ff007d72911b6f72307f996231605b91562');
  });
});

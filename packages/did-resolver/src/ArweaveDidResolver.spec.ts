// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ArweaveDidResolver } from './ArweaveDidResolver';
import { DidNotFoundError, ServerResponseError } from './errors';

const DID_URI = 'did:zk:0x8A63688576294474862cE18486CD489144721D77';

const DOCUMENT = {
  '@context': ['https://www.w3.org/ns/did/v1'],
  assertionMethod: ['did:zk:0x8A63688576294474862cE18486CD489144721D77#key-0'],
  authentication: ['did:zk:0x8A63688576294474862cE18486CD489144721D77#key-0'],
  capabilityDelegation: ['did:zk:0x8A63688576294474862cE18486CD489144721D77#key-0'],
  capabilityInvocation: ['did:zk:0x8A63688576294474862cE18486CD489144721D77#key-0'],
  controller: ['did:zk:0x8A63688576294474862cE18486CD489144721D77'],
  createdTime: 1666336001243,
  id: 'did:zk:0x8A63688576294474862cE18486CD489144721D77',
  keyAgreement: ['did:zk:0x8A63688576294474862cE18486CD489144721D77#key-1'],
  proof: [
    {
      id: 'did:zk:0x8A63688576294474862cE18486CD489144721D77#key-0',
      signature:
        'zMkj3eCzxioVEhSxFJyQPKbZ93bnnWbDafpWmvRke6NfTUW8z1bAXRAXK48wbhqfXZxb3yPEMrN2m9nkSqk5zF6i7S',
      type: 'publish'
    }
  ],
  service: [],
  verificationMethod: [
    {
      controller: ['did:zk:0x8A63688576294474862cE18486CD489144721D77'],
      id: 'did:zk:0x8A63688576294474862cE18486CD489144721D77#key-0',
      publicKeyMultibase: 'z25LmFwNQi68JRGhMxqWYdPUDi1Mrntrd22bzEoiXVqcs5',
      type: 'EcdsaSecp256k1VerificationKey2019'
    },
    {
      controller: ['did:zk:0x8A63688576294474862cE18486CD489144721D77'],
      id: 'did:zk:0x8A63688576294474862cE18486CD489144721D77#key-1',
      publicKeyMultibase: 'z3SF5idgW4q6MHgaCFvUVmRsPa9hWq6iYj8WULqaXuzDe',
      type: 'X25519KeyAgreementKey2019'
    }
  ]
};

describe('ArweaveDidResolver', (): void => {
  let resolver: ArweaveDidResolver;

  beforeEach(() => {
    resolver = new ArweaveDidResolver();
  });

  it('resolve didUrl from server', async (): Promise<void> => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            code: 200,
            data: {
              _id: '6371f66c7b64987021e67afd',
              status: 3,
              rawData: DOCUMENT,
              id: 'did:zk:0x8A63688576294474862cE18486CD489144721D77',
              __v: 0
            },
            message: 'operation successful'
          })
      })
    ) as jest.Mock;

    const res = await resolver.resolve(DID_URI);

    expect(res).toStrictEqual(DOCUMENT);
  });

  it('should throw DidNotFoundError', () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            code: 200,
            data: null,
            message: 'operation successful'
          })
      })
    ) as jest.Mock;

    expect(() => resolver.resolve(DID_URI)).rejects.toThrow(DidNotFoundError);
  });

  it('should throw ServerResponseError', () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            code: 500,
            data: null,
            message: 'unknown error'
          })
      })
    ) as jest.Mock;
    expect(() => resolver.resolve(DID_URI)).rejects.toThrow(ServerResponseError);
  });
});

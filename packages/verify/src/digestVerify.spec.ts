// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initCrypto } from '@zcloak/crypto';

import { digestVerify } from './digestVerify';

describe('verify digest', (): void => {
  const rootHash = '0x0a86d6642395770ac481f8a215b08a881e9e0229de2686d498893dec0572649a';
  const holder = 'did:zk:0x082d674c00e27fBaAAE123a85f5024A1DD702e51';
  const ctype = '0xd50f5298fda74ff0b46be740e602fa5ce0bc2a48fc5ddfbbae3c0678f59b5b97';

  beforeEach(async (): Promise<void> => {
    await initCrypto();
  });

  describe('verify digest use Keccak256', (): void => {
    it('verify digest without expirationDate', (): void => {
      const expectedDigest = '0x358c172298da91c7736df58b30ddc87fcec1ff13f85bcfd60f0ef4d54a12c419';

      expect(
        digestVerify(
          expectedDigest,
          {
            rootHash,
            holder,
            ctype
          },
          'Keccak256'
        )
      ).toBe(true);
    });

    it('verify digest include expirationDate', (): void => {
      const expectedDigest = '0xafe8c82e9581af9917f20d72d997ece3ed6edad6fc25498c5a2f61324be79a2a';

      expect(
        digestVerify(
          expectedDigest,
          {
            rootHash,
            holder,
            ctype,
            expirationDate: 1668167309925
          },
          'Keccak256'
        )
      ).toBe(true);
    });
  });

  describe('verify digest use Blake3', (): void => {
    it('verify digest without expirationDate', (): void => {
      const expectedDigest = '0x95a9fe24ced5800caf0b31558700ed96d8c896cc9ecc877adc5059577f98c4fd';

      expect(
        digestVerify(
          expectedDigest,
          {
            rootHash,
            holder,
            ctype
          },
          'Blake3'
        )
      ).toBe(true);
    });

    it('verify digest include expirationDate', (): void => {
      const expectedDigest = '0xd6648d4aa8054975e0e7bc1b012d9dd95c052269c32a082eaeda25c021e18765';

      expect(
        digestVerify(
          expectedDigest,
          {
            rootHash,
            holder,
            ctype,
            expirationDate: 1668167309925
          },
          'Blake3'
        )
      ).toBe(true);
    });
  });

  describe('verify digest use Blake2', (): void => {
    it('verify digest without expirationDate', (): void => {
      const expectedDigest = '0x895723d7b51f60fb3a4d7c408600cdbdfd077899a23f3009a8968348b4cf49cc';

      expect(
        digestVerify(
          expectedDigest,
          {
            rootHash,
            holder,
            ctype
          },
          'Blake2'
        )
      ).toBe(true);
    });

    it('verify digest include expirationDate', (): void => {
      const expectedDigest = '0xbd54e9609a47ccef94111f870b4fd32c9388cbe5105a57e8f67e84c9d3edd335';

      expect(
        digestVerify(
          expectedDigest,
          {
            rootHash,
            holder,
            ctype,
            expirationDate: 1668167309925
          },
          'Blake2'
        )
      ).toBe(true);
    });
  });

  describe('verify digest use Sha256', (): void => {
    it('verify digest without expirationDate', (): void => {
      const expectedDigest = '0x8f35a8411fdb42cdca44ac8666b370e0de1233f5a56267183e939e9659a4ba80';

      expect(
        digestVerify(
          expectedDigest,
          {
            rootHash,
            holder,
            ctype
          },
          'Sha256'
        )
      ).toBe(true);
    });

    it('verify digest include expirationDate', (): void => {
      const expectedDigest = '0x5b6d9f4d1f188494b1a32ba5995d797ba573efe40291774e92dd77cc3bc7dfa6';

      expect(
        digestVerify(
          expectedDigest,
          {
            rootHash,
            holder,
            ctype,
            expirationDate: 1668167309925
          },
          'Sha256'
        )
      ).toBe(true);
    });
  });
});

// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initCrypto } from '@zcloak/crypto';

import { calcDigest, DigestPayload } from './digest';
import { calcRoothash } from './rootHash';

describe('digest', (): void => {
  beforeEach(async (): Promise<void> => {
    await initCrypto();
  });

  describe('digest use keccak256', (): void => {
    it('digest without expirationDate', (): void => {
      const payload: DigestPayload = {
        rootHash: '0x0a86d6642395770ac481f8a215b08a881e9e0229de2686d498893dec0572649a',
        holder: 'did:zk:0x082d674c00e27fBaAAE123a85f5024A1DD702e51',
        ctype: '0xd50f5298fda74ff0b46be740e602fa5ce0bc2a48fc5ddfbbae3c0678f59b5b97'
      };

      expect(calcDigest(payload)).toEqual({
        type: 'Keccak256',
        digest: '0x358c172298da91c7736df58b30ddc87fcec1ff13f85bcfd60f0ef4d54a12c419'
      });
    });

    it('digest include expirationDate', (): void => {
      const payload: DigestPayload = {
        rootHash: '0x0a86d6642395770ac481f8a215b08a881e9e0229de2686d498893dec0572649a',
        holder: 'did:zk:0x082d674c00e27fBaAAE123a85f5024A1DD702e51',
        expirationDate: 1668167309925,
        ctype: '0xd50f5298fda74ff0b46be740e602fa5ce0bc2a48fc5ddfbbae3c0678f59b5b97'
      };

      expect(calcDigest(payload)).toEqual({
        type: 'Keccak256',
        digest: '0xafe8c82e9581af9917f20d72d997ece3ed6edad6fc25498c5a2f61324be79a2a'
      });
    });
    it('digest with calcRoothash by hashType Blake32to1', (): void => {
      const input = {
        name: 'zCloakzCloakzCloakzCloakzCloakzCloakzCloakzCloak',
        age: 19,
        birthday: '2022.10.31',
        isUser: true
      };

      const { rootHash } = calcRoothash(input, 'Blake32to1', {
        '0x6b90277e3f4ab97b83b3fc61ecffa4ec063f70d7255233ef5afdf418dcec3b75':
          '0x25807968a4c5f3ce2f116c5914991c97e33020408146406a36e4fa4826dd6c7d',
        '0x1300000000000000000000000000000000000000000000000000000000000000':
          '0x45bc02739bdb13135f43bc23fe0583410ee2b0edb552b5d64a70c9e72bfaa826',
        '0x8a323032322e31302e3331000000000000000000000000000000000000000000':
          '0x513e426a949975f70ef1562bec46c217c3455f8130addcc68035120f5373fcac',
        '0x0100000000000000000000000000000000000000000000000000000000000000':
          '0x0186debe062c28eef2a5cd1865a9190479d5713bb78ad91ea252a2ae7c9214de'
      });

      expect(
        calcDigest({
          rootHash,
          holder: 'did:zk:0x4042F3631656227d92452C9561889677c48f2C4c',
          ctype: '0x7d31ec6cceb9d313ab35dafa9058c88e758f30887362c2fab3c845902f9ccb31'
        })
      ).toEqual({
        type: 'Keccak256',
        digest: '0x20404b42f45a10a476cdd49a20c3db24c8d279cb3d009730536004a5c3ca22d6'
      });
    });
  });

  describe('digest use Blake3', (): void => {
    it('digest without expirationDate', (): void => {
      const payload: DigestPayload = {
        rootHash: '0x0a86d6642395770ac481f8a215b08a881e9e0229de2686d498893dec0572649a',
        holder: 'did:zk:0x082d674c00e27fBaAAE123a85f5024A1DD702e51',
        ctype: '0xd50f5298fda74ff0b46be740e602fa5ce0bc2a48fc5ddfbbae3c0678f59b5b97'
      };

      expect(calcDigest(payload, 'Blake3')).toEqual({
        type: 'Blake3',
        digest: '0x95a9fe24ced5800caf0b31558700ed96d8c896cc9ecc877adc5059577f98c4fd'
      });
    });

    it('digest include expirationDate', (): void => {
      const payload: DigestPayload = {
        rootHash: '0x0a86d6642395770ac481f8a215b08a881e9e0229de2686d498893dec0572649a',
        holder: 'did:zk:0x082d674c00e27fBaAAE123a85f5024A1DD702e51',
        expirationDate: 1668167309925,
        ctype: '0xd50f5298fda74ff0b46be740e602fa5ce0bc2a48fc5ddfbbae3c0678f59b5b97'
      };

      expect(calcDigest(payload, 'Blake3')).toEqual({
        type: 'Blake3',
        digest: '0xd6648d4aa8054975e0e7bc1b012d9dd95c052269c32a082eaeda25c021e18765'
      });
    });
  });

  describe('digest use Blake2', (): void => {
    it('digest without expirationDate', (): void => {
      const payload: DigestPayload = {
        rootHash: '0x0a86d6642395770ac481f8a215b08a881e9e0229de2686d498893dec0572649a',
        holder: 'did:zk:0x082d674c00e27fBaAAE123a85f5024A1DD702e51',
        ctype: '0xd50f5298fda74ff0b46be740e602fa5ce0bc2a48fc5ddfbbae3c0678f59b5b97'
      };

      expect(calcDigest(payload, 'Blake2')).toEqual({
        type: 'Blake2',
        digest: '0x895723d7b51f60fb3a4d7c408600cdbdfd077899a23f3009a8968348b4cf49cc'
      });
    });

    it('digest include expirationDate', (): void => {
      const payload: DigestPayload = {
        rootHash: '0x0a86d6642395770ac481f8a215b08a881e9e0229de2686d498893dec0572649a',
        holder: 'did:zk:0x082d674c00e27fBaAAE123a85f5024A1DD702e51',
        expirationDate: 1668167309925,
        ctype: '0xd50f5298fda74ff0b46be740e602fa5ce0bc2a48fc5ddfbbae3c0678f59b5b97'
      };

      expect(calcDigest(payload, 'Blake2')).toEqual({
        type: 'Blake2',
        digest: '0xbd54e9609a47ccef94111f870b4fd32c9388cbe5105a57e8f67e84c9d3edd335'
      });
    });
  });

  describe('digest use Sha256', (): void => {
    it('digest without expirationDate', (): void => {
      const payload: DigestPayload = {
        rootHash: '0x0a86d6642395770ac481f8a215b08a881e9e0229de2686d498893dec0572649a',
        holder: 'did:zk:0x082d674c00e27fBaAAE123a85f5024A1DD702e51',
        ctype: '0xd50f5298fda74ff0b46be740e602fa5ce0bc2a48fc5ddfbbae3c0678f59b5b97'
      };

      expect(calcDigest(payload, 'Sha256')).toEqual({
        type: 'Sha256',
        digest: '0x8f35a8411fdb42cdca44ac8666b370e0de1233f5a56267183e939e9659a4ba80'
      });
    });

    it('digest include expirationDate', (): void => {
      const payload: DigestPayload = {
        rootHash: '0x0a86d6642395770ac481f8a215b08a881e9e0229de2686d498893dec0572649a',
        holder: 'did:zk:0x082d674c00e27fBaAAE123a85f5024A1DD702e51',
        expirationDate: 1668167309925,
        ctype: '0xd50f5298fda74ff0b46be740e602fa5ce0bc2a48fc5ddfbbae3c0678f59b5b97'
      };

      expect(calcDigest(payload, 'Sha256')).toEqual({
        type: 'Sha256',
        digest: '0x5b6d9f4d1f188494b1a32ba5995d797ba573efe40291774e92dd77cc3bc7dfa6'
      });
    });
  });
});

// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initCrypto } from '@zcloak/crypto';

import { calcRoothash } from './rootHash';

describe('calcRoothash', (): void => {
  beforeAll(async (): Promise<void> => {
    await initCrypto();
  });

  describe('calcRoothash with RescuePrime', () => {
    it('calcRoothash', (): void => {
      const input = {
        name: 'zCloak',
        age: 19,
        birthday: '2022.10.31',
        isUser: true
      };

      const { rootHash } = calcRoothash(input, 'RescuePrime', {
        '0x88af5a7ba28c1de54ebd589dea81d30caa3f467646f6d714c0d2604599d63e1e':
          '0x357d50aac640931f9976477de30b3b476be4a14ae367b045496670d7a23c457d',
        '0x9ad57aefa90d9473f855c14221f330fe959a554b3d86c9d701db11c7559ce107':
          '0xd50f5298fda74ff0b46be740e602fa5ce0bc2a48fc5ddfbbae3c0678f59b5b97',
        '0x2d2367a578506f669cfd4a744c08fd45315ad4ea3d248733957947cf00723662':
          '0xde121244bbf715927542ee94a87ee5f2e338093f58c71ad7f5ed25bec73d5939',
        '0x6bc2ebdc9345c21f804ef735209993cb8e5b3755af0650c41aa164a9faf674bd':
          '0x186474372ad7b8dd8e22d42832424b5d7a7b26390f4fd60918a43dbb45dc127b'
      });

      expect(rootHash).toEqual('0x0a86d6642395770ac481f8a215b08a881e9e0229de2686d498893dec0572649a');
    });

    it('calcRoothash with string array', (): void => {
      const input = {
        name: 'zCloak',
        age: 19,
        birthday: 1668160291923,
        isUser: true,
        types: ['1', '2', '5']
      };

      const { rootHash } = calcRoothash(input, 'RescuePrime', {
        '0x88af5a7ba28c1de54ebd589dea81d30caa3f467646f6d714c0d2604599d63e1e':
          '0x42ecebd0acae94843f906a9fe69e5c672c60d8d688b71aa85948d8e60becf082',
        '0x9ad57aefa90d9473f855c14221f330fe959a554b3d86c9d701db11c7559ce107':
          '0x5b327ad3ab06c19d31a6438458eb77b0f4e8e12ba009c3eae2f42076d8cd40e6',
        '0xe42a18def37c9679d1912c5da800f3a90aca785172ff5b747fff173c41a376cd':
          '0x777c6073953937c71ab3e0d20d05699648ed4e21de16fa24658542b5208d4034',
        '0x6bc2ebdc9345c21f804ef735209993cb8e5b3755af0650c41aa164a9faf674bd':
          '0x8e25dec4bd8cac366f2c397590154024669b283b02c9fa6d97ce7459e0ea4f65',
        '0xcadba3f187eca36e7df1ef2063478232c53fc996449cf878b7ef58b9a58f33d8':
          '0x9eb35f2ed9a24b0fd60faf3d63be84fb69bdcb997c2c37c2566e5870819b8211'
      });

      expect(rootHash).toEqual('0x51d3b9ef895f61a3fcb4821002f396b8374b6b7e440944961fc63e3f8ff0ba84');
    });

    it('calcRoothash without nonceMap', (): void => {
      const input = {
        name: 'zCloak',
        age: 19,
        birthday: 1668160291923,
        isUser: true,
        types: ['1', '2', '5']
      };

      const { rootHash } = calcRoothash(input, 'RescuePrime');

      expect(rootHash).toEqual('0x9579c93741b6979500bca88dcb104da424c2c3bb0e2fa85f13d76cd00637e46f');
    });
  });

  describe('calcRoothash with Blake32to1', () => {
    it('calcRoothash', (): void => {
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

      expect(rootHash).toEqual('0x4bf37b064a4c0063f0af05f53be10c1daaa1135ff656a02b326d8dfbf57879ff');
    });
  });

  describe('calcRoothash with RescuePrimeOptimized', () => {
    it('calcRoothash', (): void => {
      const input = {
        name: 'zCloakzCloakzCloakzCloakzCloakzCloakzCloakzCloak',
        age: 19,
        birthday: '2022.10.31',
        isUser: true
      };

      const { rootHash } = calcRoothash(input, 'RescuePrimeOptimized', {
        '0x011eed5f2e2321069b83e2bdd38c790948231cd1d49ed6c4dd09bb0f16b0661c':
          '0xfd766e5717ae2ae09abee1268d6a653dc50c2067d9efd665e7b52d8f0f597d2b',
        '0x7f8a33bf3f50ca9b84d1dc5561c8f71d48d6256763fd8d0f5e5e902dce5dfb88':
          '0x9600f4e358fdfd60181ba5cbe7480e9a2878baf1fe5ed1a6cf92df60de4b42f7',
        '0x6c56eda1ac0c148d682bc4c36d0457fcc4fa511871bd170c63596acd0f779aba':
          '0xb0b621cfb6794b164f362f02ada2c63be098a34097bedfe13954f4b62484917e',
        '0xfb20ae03df36661b746c4f247181eebd15850f6af189995ccbf8aa62223fd5ed':
          '0xd6739bc7b71a5a03642d4eed491cfd55c736e5a3fcf60c02ec4690ec56eff60c'
      });

      expect(rootHash).toEqual('0x2cbd72a75cf5797fb6893b222a45de60eaa2ddf2e5d435d67e5ed8067efb76e3');
    });
  });
});

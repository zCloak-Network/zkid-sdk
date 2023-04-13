// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { hexToU8a, u8aToHex } from '@polkadot/util';

import { initCrypto } from '../initCrypto';
import { hdKeyFromSeed } from '.';

const vector1Seed = '0x000102030405060708090a0b0c0d0e0f';
const vector2Seed =
  '0xfffcf9f6f3f0edeae7e4e1dedbd8d5d2cfccc9c6c3c0bdbab7b4b1aeaba8a5a29f9c999693908d8a8784817e7b7875726f6c696663605d5a5754514e4b484542';

const secp256k1Vector1 = [
  {
    path: 'm',
    fingerprint: '0x00000000',
    chainCode: '0x873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d508',
    seed: '0xe8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35',
    publicKey: '0x0339a36013301597daef41fbe593a02cc513d0b55527ec2df1050e2e8ff49c85c2'
  },
  {
    path: "m/0'",
    fingerprint: '0x3442193e',
    chainCode: '0x47fdacbd0f1097043b78c63c20c34ef4ed9a111d980047ad16282c7ae6236141',
    seed: '0xedb2e14f9ee77d26dd93b4ecede8d16ed408ce149b6cd80b0715a2d911a0afea',
    publicKey: '0x035a784662a4a20a65bf6aab9ae98a6c068a81c52e4b032c0fb5400c706cfccc56'
  },
  {
    path: "m/0'/1",
    fingerprint: '0x5c1bd648',
    chainCode: '0x2a7857631386ba23dacac34180dd1983734e444fdbf774041578e9b6adb37c19',
    seed: '0x3c6cb8d0f6a264c91ea8b5030fadaa8e538b020f0a387421a12de9319dc93368',
    publicKey: '0x03501e454bf00751f24b1b489aa925215d66af2234e3891c3b21a52bedb3cd711c'
  },
  {
    path: "m/0'/1/2'",
    fingerprint: '0xbef5a2f9',
    chainCode: '0x04466b9cc8e161e966409ca52986c584f07e9dc81f735db683c3ff6ec7b1503f',
    seed: '0xcbce0d719ecf7431d88e6a89fa1483e02e35092af60c042b1df2ff59fa424dca',
    publicKey: '0x0357bfe1e341d01c69fe5654309956cbea516822fba8a601743a012a7896ee8dc2'
  },
  {
    path: "m/0'/1/2'/2",
    fingerprint: '0xee7ab90c',
    chainCode: '0xcfb71883f01676f587d023cc53a35bc7f88f724b1f8c2892ac1275ac822a3edd',
    seed: '0x0f479245fb19a38a1954c5c7c0ebab2f9bdfd96a17563ef28a6a4b1a2a764ef4',
    publicKey: '0x02e8445082a72f29b75ca48748a914df60622a609cacfce8ed0e35804560741d29'
  },
  {
    path: "m/0'/1/2'/2/1000000000",
    fingerprint: '0xd880d7d8',
    chainCode: '0xc783e67b921d2beb8f6b389cc646d7263b4145701dadd2161548a8b078e65e9e',
    seed: '0x471b76e389e528d6de6d816857e012c5455051cad6660850e58372a6c3e6e7c8',
    publicKey: '0x022a471424da5e657499d1ff51cb43c47481a03b1e77f951fe64cec9f5a48f7011'
  }
];

const secp256k1Vector2 = [
  {
    path: 'm',
    fingerprint: '0x00000000',
    chainCode: '0x60499f801b896d83179a4374aeb7822aaeaceaa0db1f85ee3e904c4defbd9689',
    seed: '0x4b03d6fc340455b363f51020ad3ecca4f0850280cf436c70c727923f6db46c3e',
    publicKey: '0x03cbcaa9c98c877a26977d00825c956a238e8dddfbd322cce4f74b0b5bd6ace4a7'
  },
  {
    path: 'm/0',
    fingerprint: '0xbd16bee5',
    chainCode: '0xf0909affaa7ee7abe5dd4e100598d4dc53cd709d5a5c2cac40e7412f232f7c9c',
    seed: '0xabe74a98f6c7eabee0428f53798f0ab8aa1bd37873999041703c742f15ac7e1e',
    publicKey: '0x02fc9e5af0ac8d9b3cecfe2a888e2117ba3d089d8585886c9c826b6b22a98d12ea'
  },
  {
    path: "m/0/2147483647'",
    fingerprint: '0x5a61ff8e',
    chainCode: '0xbe17a268474a6bb9c61e1d720cf6215e2a88c5406c4aee7b38547f585c9a37d9',
    seed: '0x877c779ad9687164e9c2f4f0f4ff0340814392330693ce95a58fe18fd52e6e93',
    publicKey: '0x03c01e7425647bdefa82b12d9bad5e3e6865bee0502694b94ca58b666abc0a5c3b'
  },
  {
    path: "m/0/2147483647'/1",
    fingerprint: '0xd8ab4937',
    chainCode: '0xf366f48f1ea9f2d1d3fe958c95ca84ea18e4c4ddb9366c336c927eb246fb38cb',
    seed: '0x704addf544a06e5ee4bea37098463c23613da32020d604506da8c0518e1da4b7',
    publicKey: '0x03a7d1d856deb74c508e05031f9895dab54626251b3806e16b4bd12e781a7df5b9'
  },
  {
    path: "m/0/2147483647'/1/2147483646'",
    fingerprint: '0x78412e3a',
    chainCode: '0x637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e29',
    seed: '0xf1c7c871a54a804afe328b4c83a1c33b8e5ff48f5087273f04efa83b247d6a2d',
    publicKey: '0x02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0'
  },
  {
    path: "m/0/2147483647'/1/2147483646'/2",
    fingerprint: '0x31a507b8',
    chainCode: '0x9452b549be8cea3ecb7a84bec10dcfd94afe4d129ebfd3b3cb58eedf394ed271',
    seed: '0xbb7d39bdb83ecf58f2fd82b6d918341cbef428661ef01ab97c28a4842125ac23',
    publicKey: '0x024d902e1a2fc7a8755ab5b694c575fce742c48d9ff192e63df5193e4c7afe1f9c'
  }
];

const ed25519Vector1 = [
  {
    path: 'm',
    fingerprint: '0x00000000',
    chainCode: '0x90046a93de5380a72b5e45010748567d5ea02bbf6522f979e05c0d8d8ca9fffb',
    seed: '0x2b4be7f19ee27bbf30c667b642d5f4aa69fd169872f8fc3059c08ebae2eb19e7',
    publicKey: '0xa4b2856bfec510abab89753fac1ac0e1112364e7d250545963f135f2a33188ed'
  },
  {
    path: "m/0'",
    fingerprint: '0xddebc675',
    chainCode: '0x8b59aa11380b624e81507a27fedda59fea6d0b779a778918a2fd3590e16e9c69',
    seed: '0x68e0fe46dfb67e368c75379acec591dad19df3cde26e63b93a8e704f1dade7a3',
    publicKey: '0x8c8a13df77a28f3445213a0f432fde644acaa215fc72dcdf300d5efaa85d350c'
  },
  {
    path: "m/0'/1'",
    fingerprint: '0x13dab143',
    chainCode: '0xa320425f77d1b5c2505a6b1b27382b37368ee640e3557c315416801243552f14',
    seed: '0xb1d0bad404bf35da785a64ca1ac54b2617211d2777696fbffaf208f746ae84f2',
    publicKey: '0x1932a5270f335bed617d5b935c80aedb1a35bd9fc1e31acafd5372c30f5c1187'
  },
  {
    path: "m/0'/1'/2'",
    fingerprint: '0xebe4cb29',
    chainCode: '0x2e69929e00b5ab250f49c3fb1c12f252de4fed2c1db88387094a0f8c4c9ccd6c',
    seed: '0x92a5b23c0b8a99e37d07df3fb9966917f5d06e02ddbd909c7e184371463e9fc9',
    publicKey: '0xae98736566d30ed0e9d2f4486a64bc95740d89c7db33f52121f8ea8f76ff0fc1'
  },
  {
    path: "m/0'/1'/2'/2'",
    fingerprint: '0x316ec1c6',
    chainCode: '0x8f6d87f93d750e0efccda017d662a1b31a266e4a6f5993b15f5c1f07f74dd5cc',
    seed: '0x30d1dc7e5fc04c31219ab25a27ae00b50f6fd66622f6e9c913253d6511d1e662',
    publicKey: '0x8abae2d66361c879b900d204ad2cc4984fa2aa344dd7ddc46007329ac76c429c'
  },
  {
    path: "m/0'/1'/2'/2'/1000000000'",
    fingerprint: '0xd6322ccd',
    chainCode: '0x68789923a0cac2cd5a29172a475fe9e0fb14cd6adb5ad98a3fa70333e7afa230',
    seed: '0x8f94d394a8e8fd6b1bc2f3f49f5c47e385281d5c17e65324b0f62483e37e8793',
    publicKey: '0x3c24da049451555d51a7014a37337aa4e12d41e485abccfa46b47dfb2af54b7a'
  }
];

const ed25519Vector2 = [
  {
    path: 'm',
    fingerprint: '0x00000000',
    chainCode: '0xef70a74db9c3a5af931b5fe73ed8e1a53464133654fd55e7a66f8570b8e33c3b',
    seed: '0x171cb88b1b3c1db25add599712e36245d75bc65a1a5c9e18d76f9f2b1eab4012',
    publicKey: '0x8fe9693f8fa62a4305a140b9764c5ee01e455963744fe18204b4fb948249308a'
  },
  {
    path: "m/0'",
    fingerprint: '0x31981b50',
    chainCode: '0x0b78a3226f915c082bf118f83618a618ab6dec793752624cbeb622acb562862d',
    seed: '0x1559eb2bbec5790b0c65d8693e4d0875b1747f4970ae8b650486ed7470845635',
    publicKey: '0x86fab68dcb57aa196c77c5f264f215a112c22a912c10d123b0d03c3c28ef1037'
  },
  {
    path: "m/0'/2147483647'",
    fingerprint: '0x1e9411b1',
    chainCode: '0x138f0b2551bcafeca6ff2aa88ba8ed0ed8de070841f0c4ef0165df8181eaad7f',
    seed: '0xea4f5bfe8694d8bb74b7b59404632fd5968b774ed545e810de9c32a4fb4192f4',
    publicKey: '0x5ba3b9ac6e90e83effcd25ac4e58a1365a9e35a3d3ae5eb07b9e4d90bcf7506d'
  },
  {
    path: "m/0'/2147483647'/1'",
    fingerprint: '0xfcadf38c',
    chainCode: '0x73bd9fff1cfbde33a1b846c27085f711c0fe2d66fd32e139d3ebc28e5a4a6b90',
    seed: '0x3757c7577170179c7868353ada796c839135b3d30554bbb74a4b1e4a5a58505c',
    publicKey: '0x2e66aa57069c86cc18249aecf5cb5a9cebbfd6fadeab056254763874a9352b45'
  },
  {
    path: "m/0'/2147483647'/1'/2147483646'",
    fingerprint: '0xaca70953',
    chainCode: '0x0902fe8a29f9140480a00ef244bd183e8a13288e4412d8389d140aac1794825a',
    seed: '0x5837736c89570de861ebc173b1086da4f505d4adb387c6a1b1342d5e4ac9ec72',
    publicKey: '0xe33c0f7d81d843c572275f287498e8d408654fdf0d1e065b84e2e6f157aab09b'
  },
  {
    path: "m/0'/2147483647'/1'/2147483646'/2'",
    fingerprint: '0x422c654b',
    chainCode: '0x5d70af781f3a37b829f0d060924d5e960bdc02e85423494afc0b1a41bbe196d4',
    seed: '0x551d333177df541ad876a60ea71f00447931c0a9da16f227c11ea080d7391b8d',
    publicKey: '0x47150c75db263559a70d5778bf36abbab30fb061ad69f69ece61a72b0cfa4fc0'
  }
];

describe('formatAddress', () => {
  beforeAll(async () => {
    await initCrypto();
  });

  describe('secp256k1 hd key', () => {
    secp256k1Vector1.forEach(({ chainCode, path, publicKey, seed }, index): void => {
      it(`secp256k1 hd key vector1 #${index}`, (): void => {
        const hdKey = hdKeyFromSeed(hexToU8a(vector1Seed), 'secp256k1', path);

        expect(u8aToHex(hdKey.chainCode)).toEqual(chainCode);
        expect(u8aToHex(hdKey.seed)).toEqual(seed);
        expect(u8aToHex(hdKey.publicKey)).toEqual(publicKey);
      });
    });

    secp256k1Vector2.forEach(({ chainCode, path, publicKey, seed }, index): void => {
      it(`secp256k1 hd key vector2 #${index}`, (): void => {
        const hdKey = hdKeyFromSeed(hexToU8a(vector2Seed), 'secp256k1', path);

        expect(u8aToHex(hdKey.chainCode)).toEqual(chainCode);
        expect(u8aToHex(hdKey.seed)).toEqual(seed);
        expect(u8aToHex(hdKey.publicKey)).toEqual(publicKey);
      });
    });
  });

  describe('ed25519 hd key', () => {
    ed25519Vector1.forEach(({ chainCode, path, publicKey, seed }, index): void => {
      it(`ed25519 hd key vector1 #${index}`, (): void => {
        const hdKey = hdKeyFromSeed(hexToU8a(vector1Seed), 'ed25519', path);

        expect(u8aToHex(hdKey.chainCode)).toEqual(chainCode);
        expect(u8aToHex(hdKey.seed)).toEqual(seed);
        expect(u8aToHex(hdKey.publicKey)).toEqual(publicKey);
      });
    });

    ed25519Vector2.forEach(({ chainCode, path, publicKey, seed }, index): void => {
      it(`ed25519 hd key vector2 #${index}`, (): void => {
        const hdKey = hdKeyFromSeed(hexToU8a(vector2Seed), 'ed25519', path);

        expect(u8aToHex(hdKey.chainCode)).toEqual(chainCode);
        expect(u8aToHex(hdKey.seed)).toEqual(seed);
        expect(u8aToHex(hdKey.publicKey)).toEqual(publicKey);
      });
    });
  });
});

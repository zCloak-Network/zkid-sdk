// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';

import { initCrypto, randomAsHex } from '@zcloak/crypto';

import { rootHashVerify } from './rootHashVerify';

describe('verify rootHash', (): void => {
  const nonceMap: Record<HexString, HexString> = {
    '0x88af5a7ba28c1de54ebd589dea81d30caa3f467646f6d714c0d2604599d63e1e':
      '0x357d50aac640931f9976477de30b3b476be4a14ae367b045496670d7a23c457d',
    '0x9ad57aefa90d9473f855c14221f330fe959a554b3d86c9d701db11c7559ce107':
      '0xd50f5298fda74ff0b46be740e602fa5ce0bc2a48fc5ddfbbae3c0678f59b5b97',
    '0x2d2367a578506f669cfd4a744c08fd45315ad4ea3d248733957947cf00723662':
      '0xde121244bbf715927542ee94a87ee5f2e338093f58c71ad7f5ed25bec73d5939',
    '0x6bc2ebdc9345c21f804ef735209993cb8e5b3755af0650c41aa164a9faf674bd':
      '0x186474372ad7b8dd8e22d42832424b5d7a7b26390f4fd60918a43dbb45dc127b'
  };

  const hashes: HexString[] = [
    '0x147c2e0b39f6ac6db8bbfb7ded2083fa2f4d5ee0c3f1a12eed52d42b487ec893',
    '0xa88dd3ffe858082e38035a3bf06f7967a1bcd6d59a2544d01c25f436efde166e',
    '0x42f5864b05270386f4cd220c0a0ce534b96ab407e75c0a05d5a1a941bafb3467',
    '0xc88ba770f3d9748cda017e1f528729e137c03350eb8f48e8ec2493f8bec42cd7'
  ];

  const rootHash = '0x0a86d6642395770ac481f8a215b08a881e9e0229de2686d498893dec0572649a';

  const contents = {
    name: 'zCloak',
    age: 19,
    birthday: '2022.10.31',
    isUser: true
  };

  beforeEach(async (): Promise<void> => {
    await initCrypto();
  });

  it('verify rootHash with full text presentation', (): void => {
    expect(rootHashVerify('Rescue', hashes, contents, nonceMap, rootHash)).toBe(true);
  });

  it('verify rootHash with selective disclosure presentation', (): void => {
    const nonceMap: Record<HexString, HexString> = {
      '0x9ad57aefa90d9473f855c14221f330fe959a554b3d86c9d701db11c7559ce107':
        '0xd50f5298fda74ff0b46be740e602fa5ce0bc2a48fc5ddfbbae3c0678f59b5b97',
      '0x2d2367a578506f669cfd4a744c08fd45315ad4ea3d248733957947cf00723662':
        '0xde121244bbf715927542ee94a87ee5f2e338093f58c71ad7f5ed25bec73d5939',
      '0x6bc2ebdc9345c21f804ef735209993cb8e5b3755af0650c41aa164a9faf674bd':
        '0x186474372ad7b8dd8e22d42832424b5d7a7b26390f4fd60918a43dbb45dc127b'
    };

    const contents = {
      age: 19,
      birthday: '2022.10.31',
      isUser: true
    };

    expect(rootHashVerify('Rescue', hashes, contents, nonceMap, rootHash)).toBe(true);
  });

  it('verify rootHash with selective disclosure presentation but nonce is error', (): void => {
    const nonceMap: Record<HexString, HexString> = {
      '0x9ad57aefa90d9473f855c14221f330fe959a554b3d86c9d701db11c7559ce107': randomAsHex(32),
      '0x2d2367a578506f669cfd4a744c08fd45315ad4ea3d248733957947cf00723662':
        '0xde121244bbf715927542ee94a87ee5f2e338093f58c71ad7f5ed25bec73d5939',
      '0x6bc2ebdc9345c21f804ef735209993cb8e5b3755af0650c41aa164a9faf674bd':
        '0x186474372ad7b8dd8e22d42832424b5d7a7b26390f4fd60918a43dbb45dc127b'
    };

    const contents = {
      age: 19,
      birthday: '2022.10.31',
      isUser: true
    };

    expect(rootHashVerify('Rescue', hashes, contents, nonceMap, rootHash)).toBe(false);
  });

  it('verify rootHash contents and nonceMap length error', (): void => {
    const nonceMap: Record<HexString, HexString> = {
      '0x9ad57aefa90d9473f855c14221f330fe959a554b3d86c9d701db11c7559ce107': randomAsHex(32),
      '0x2d2367a578506f669cfd4a744c08fd45315ad4ea3d248733957947cf00723662':
        '0xde121244bbf715927542ee94a87ee5f2e338093f58c71ad7f5ed25bec73d5939',
      '0x6bc2ebdc9345c21f804ef735209993cb8e5b3755af0650c41aa164a9faf674bd':
        '0x186474372ad7b8dd8e22d42832424b5d7a7b26390f4fd60918a43dbb45dc127b'
    };

    const contents = {
      birthday: '2022.10.31',
      isUser: true
    };

    expect(() => rootHashVerify('Rescue', hashes, contents, nonceMap, rootHash)).toThrow(
      /^contents and nonceMap must has the same keys length, receive contents keys length/
    );
  });

  it('verify rootHash hashes and contents length not equal', (): void => {
    const nonceMap: Record<HexString, HexString> = {
      '0x9ad57aefa90d9473f855c14221f330fe959a554b3d86c9d701db11c7559ce107': randomAsHex(32),
      '0x2d2367a578506f669cfd4a744c08fd45315ad4ea3d248733957947cf00723662':
        '0xde121244bbf715927542ee94a87ee5f2e338093f58c71ad7f5ed25bec73d5939',
      '0x6bc2ebdc9345c21f804ef735209993cb8e5b3755af0650c41aa164a9faf674bd':
        '0x186474372ad7b8dd8e22d42832424b5d7a7b26390f4fd60918a43dbb45dc127b'
    };

    const contents = {
      age: 19,
      birthday: '2022.10.31',
      isUser: true
    };

    expect(() => rootHashVerify('Rescue', [], contents, nonceMap, rootHash)).toThrow(
      'hashes length must greater than contents length'
    );
  });
});

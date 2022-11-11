// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initCrypto } from '@zcloak/crypto';

import { calcRoothash } from './rootHash';

describe('calcRoothash', (): void => {
  beforeEach(async (): Promise<void> => {
    await initCrypto();
  });

  it('calcRoothash', (): void => {
    const input = {
      name: 'zCloak',
      age: 19,
      birthday: '2022.10.31',
      isUser: true
    };

    console.log(calcRoothash(input, undefined, {
      '0xb2561d1a1e6bbb5b29c0ffa068f7511d34e92440bc8ba6e8e70a448815a6cd10': '0x357d50aac640931f9976477de30b3b476be4a14ae367b045496670d7a23c457d',
      '0xa0e72a695082355fa1ba29355ff6297d3a321e3578b0067c7b5de4863dff1e1e': '0xd50f5298fda74ff0b46be740e602fa5ce0bc2a48fc5ddfbbae3c0678f59b5b97',
      '0xb127ca0b823bd13110c16365808b26277e1d6c28dba6702cfc895a38e05dc13a': '0xde121244bbf715927542ee94a87ee5f2e338093f58c71ad7f5ed25bec73d5939',
      '0x938e7bfd641a10f1ae9633aed8d12d56bca0ac268deac3f4dc82714409e9da02': '0x186474372ad7b8dd8e22d42832424b5d7a7b26390f4fd60918a43dbb45dc127b'
    }));
  });
});

import { Keyring } from '@zcloak/keyring';

import { createEcdsaFromMnemonic } from './helpers';

describe('Did', (): void => {
  describe('create', (): void => {
    let keyring: Keyring;

    beforeEach((): void => {
      keyring = new Keyring();
    });

    it('create ecdsa from mnemonic', (): void => {
      const mnemonic =
        'health correct setup usage father decorate curious copper sorry recycle skin equal';
      const did = createEcdsaFromMnemonic(mnemonic);
    });
  });
});

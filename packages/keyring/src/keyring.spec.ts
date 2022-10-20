import { stringToU8a } from '@polkadot/util';
import { utils } from 'ethers';

import { ed25519Verify, randomAsU8a, secp256k1Verify } from '@zcloak/crypto';

import { Keyring } from './keyring';

describe('Keyring', (): void => {
  const publicKeyOne = new Uint8Array([
    2, 205, 25, 42, 142, 34, 155, 70, 229, 74, 177, 12, 155, 50, 22, 154, 25, 125, 200, 87, 63, 75,
    107, 11, 106, 74, 11, 9, 62, 163, 227, 195, 155
  ]);
  const publicKeyTwo = new Uint8Array([
    204, 156, 197, 219, 207, 229, 90, 222, 152, 163, 250, 68, 54, 105, 148, 170, 235, 167, 132, 161,
    168, 11, 25, 245, 196, 192, 42, 14, 204, 6, 107, 153
  ]);
  const publicKeyThree = new Uint8Array([
    101, 111, 177, 164, 252, 50, 24, 234, 6, 105, 145, 221, 146, 149, 5, 230, 159, 46, 251, 240,
    155, 108, 150, 8, 224, 17, 208, 122, 126, 157, 100, 8
  ]);

  const seedOne = '0xa31a712188e9e55eb2075fc62cec3141ce7f21e209605ab15cee6ad3a376d9f0';

  describe('ecdsa', (): void => {
    let keyring: Keyring;

    beforeEach((): void => {
      keyring = new Keyring();

      keyring.addFromMnemonic(
        'potato act energy ahead stone taxi receive fame gossip equip chest round'
      );
    });

    it('adds from a mnemonic', (): void => {
      expect(
        utils.computeAddress(
          keyring.addFromMnemonic(
            'potato act energy ahead stone taxi receive fame gossip equip chest round'
          ).publicKey
        )
      ).toEqual(utils.getAddress('0x9cdc88edf924a757b4c9b86d051fdfbafce141b4'));
    });

    it('sign and verify', (): void => {
      const MESSAGE = stringToU8a('abcd');

      const pair = keyring.getPair(publicKeyOne);
      const signature = pair.sign(MESSAGE);

      expect(secp256k1Verify(MESSAGE, signature, pair.publicKey)).toBe(true);
      expect(secp256k1Verify(MESSAGE, signature, randomAsU8a(32))).toBe(false);
      expect(secp256k1Verify(new Uint8Array(), signature, pair.publicKey)).toBe(false);
    });
  });

  describe('ed25519', (): void => {
    let keyring: Keyring;

    beforeEach((): void => {
      keyring = new Keyring();

      keyring.addFromMnemonic(
        'potato act energy ahead stone taxi receive fame gossip equip chest round',
        undefined,
        'ed25519'
      );
    });

    it('adds from a mnemonic', (): void => {
      expect(
        keyring.addFromMnemonic(
          'potato act energy ahead stone taxi receive fame gossip equip chest round',
          undefined,
          'ed25519'
        ).publicKey
      ).toEqual(publicKeyTwo);
    });

    it('sign and verify', (): void => {
      const MESSAGE = stringToU8a('abcd');

      const pair = keyring.getPair(publicKeyTwo);
      const signature = pair.sign(MESSAGE);

      expect(ed25519Verify(MESSAGE, signature, pair.publicKey)).toBe(true);
      expect(ed25519Verify(MESSAGE, signature, randomAsU8a(32))).toBe(false);
      expect(ed25519Verify(new Uint8Array(), signature, pair.publicKey)).toBe(false);
    });
  });

  describe('x25519', (): void => {
    let keyring: Keyring;

    beforeEach((): void => {
      keyring = new Keyring();

      console.log(
        keyring.addFromMnemonic(
          'potato act energy ahead stone taxi receive fame gossip equip chest round',
          '//0///1',
          'x25519'
        ).publicKey
      );
      keyring.addFromSeed(seedOne, 'x25519');
    });

    it('adds from a mnemonic', (): void => {
      expect(
        keyring.addFromMnemonic(
          'potato act energy ahead stone taxi receive fame gossip equip chest round',
          '//0///1',
          'x25519'
        ).publicKey
      ).toEqual(publicKeyThree);
    });

    it('encrypt and decrypt', (): void => {
      const [pair1, pair2] = keyring.getPairs();

      const MESSAGE = stringToU8a('abcd');

      const encrypted = pair1.encrypt(MESSAGE, pair2.publicKey);
      const decrypted = pair2.decrypt(encrypted, pair1.publicKey);

      expect(decrypted).toEqual(MESSAGE);
    });
  });
});

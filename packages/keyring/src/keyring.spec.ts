import { stringToU8a } from '@polkadot/util';
import { utils } from 'ethers';
import { randomBytes } from 'tweetnacl';

import { ed25519Verify } from './pair/ed25519';
import { secp256k1Verify } from './pair/secp256k1';
import { Keyring } from './keyring';

describe('Keyring', (): void => {
  const publicKeyOne = new Uint8Array([
    2, 205, 25, 42, 142, 34, 155, 70, 229, 74, 177, 12, 155, 50, 22, 154, 25, 125, 200, 87, 63, 75,
    107, 11, 106, 74, 11, 9, 62, 163, 227, 195, 155
  ]);
  const publicKeyTwo = new Uint8Array([
    193, 234, 138, 55, 226, 78, 92, 216, 4, 96, 56, 53, 148, 78, 86, 154, 224, 15, 135, 147, 240,
    19, 157, 140, 250, 16, 95, 168, 218, 250, 122, 233
  ]);
  const publicKeyThree = new Uint8Array([
    203, 175, 93, 60, 153, 113, 188, 160, 132, 176, 128, 178, 159, 251, 205, 252, 122, 242, 97, 14,
    66, 82, 254, 216, 68, 114, 33, 14, 190, 202, 158, 83
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
      expect(secp256k1Verify(MESSAGE, signature, randomBytes(32))).toBe(false);
      expect(secp256k1Verify(new Uint8Array(), signature, pair.publicKey)).toBe(false);
    });
  });

  describe('ed25519', (): void => {
    let keyring: Keyring;

    beforeEach((): void => {
      keyring = new Keyring();

      keyring.addFromMnemonic(
        'potato act energy ahead stone taxi receive fame gossip equip chest round',
        "m/0'",
        0,
        'ed25519'
      );
    });

    it('adds from a mnemonic', (): void => {
      expect(
        keyring.addFromMnemonic(
          'potato act energy ahead stone taxi receive fame gossip equip chest round',
          "m/0'",
          0,
          'ed25519'
        ).publicKey
      ).toEqual(publicKeyTwo);
    });

    it('sign and verify', (): void => {
      const MESSAGE = stringToU8a('abcd');

      const pair = keyring.getPair(publicKeyTwo);
      const signature = pair.sign(MESSAGE);

      expect(ed25519Verify(MESSAGE, signature, pair.publicKey)).toBe(true);
      expect(ed25519Verify(MESSAGE, signature, randomBytes(32))).toBe(false);
      expect(ed25519Verify(new Uint8Array(), signature, pair.publicKey)).toBe(false);
    });
  });

  describe('x25519', (): void => {
    let keyring: Keyring;

    beforeEach((): void => {
      keyring = new Keyring();

      keyring.addFromMnemonic(
        'potato act energy ahead stone taxi receive fame gossip equip chest round',
        "m/0'",
        0,
        'x25519'
      );
      keyring.addFromSeed(seedOne, 'x25519');
    });

    it('adds from a mnemonic', (): void => {
      expect(
        keyring.addFromMnemonic(
          'potato act energy ahead stone taxi receive fame gossip equip chest round',
          "m/0'",
          0,
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

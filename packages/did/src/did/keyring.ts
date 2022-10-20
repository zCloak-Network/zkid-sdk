import type { HexString } from '@zcloak/crypto/types';
import type { KeyringInstance } from '@zcloak/keyring/types';
import type { IDidKeyring } from '../types';

import { assert } from '@polkadot/util';

export abstract class DidKeyring implements IDidKeyring {
  protected keyring: KeyringInstance | null = null;

  public init(keyring: KeyringInstance) {
    this.keyring = keyring;
  }

  public sign(publicKey: Uint8Array, message: Uint8Array | HexString): Uint8Array {
    assert(this.keyring, 'Need to init before call method');

    const pair = this.keyring.getPair(publicKey);

    return pair.sign(message);
  }

  public encrypt(
    publicKey: Uint8Array,
    message: Uint8Array | HexString,
    recipientPublicKey: Uint8Array | HexString,
    nonce?: Uint8Array | HexString | undefined
  ): Uint8Array {
    assert(this.keyring, 'Need to init before call method');

    const pair = this.keyring.getPair(publicKey);

    return pair.encrypt(message, recipientPublicKey, nonce);
  }

  public decrypt(
    publicKey: Uint8Array,
    encryptedMessageWithNonce: Uint8Array | HexString,
    senderPublicKey: Uint8Array | HexString
  ): Uint8Array {
    assert(this.keyring, 'Need to init before call method');

    const pair = this.keyring.getPair(publicKey);

    return pair.decrypt(encryptedMessageWithNonce, senderPublicKey);
  }
}

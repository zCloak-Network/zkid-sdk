import type { DidUrl, Service } from '@zcloak/did-resolver/types';
import type { HexString } from '@zcloak/keyring/types';

export interface IDidDetails {
  id: DidUrl;
  controller: Set<DidUrl>;
  authentication?: Set<Uint8Array>;
  assertionMethod?: Set<Uint8Array>;
  keyAgreement?: Set<Uint8Array>;
  capabilityInvocation?: Set<Uint8Array>;
  capabilityDelegation?: Set<Uint8Array>;
  service?: Service[];
}

export interface IDidKeyring {
  sign(publicKey: Uint8Array, message: HexString | Uint8Array): Uint8Array;
  encrypt(
    publicKey: Uint8Array,
    message: HexString | Uint8Array,
    recipientPublicKey: HexString | Uint8Array,
    nonce?: HexString | Uint8Array
  ): Uint8Array;
  decrypt(
    publicKey: Uint8Array,
    encryptedMessageWithNonce: HexString | Uint8Array,
    senderPublicKey: HexString | Uint8Array
  ): Uint8Array;
}

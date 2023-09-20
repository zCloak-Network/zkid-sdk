// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DidKeys, EncryptedData, IDidDetails, IDidKeyring, SignedData } from '@zcloak/did/types';
import type { DidUrl } from '@zcloak/did-resolver/types';
import type { BaseProvider } from '@zcloak/login-providers/base/Provider';

import { UnsignedTransaction } from '@ethersproject/transactions';
import { hexToU8a } from '@polkadot/util';

import { Did } from '@zcloak/did';
import { parseDidDocument } from '@zcloak/did/did/helpers';

import { bigNumberishToHex } from './util';

type HexString = `0x${string}`;

export class LoginDid extends Did implements IDidKeyring {
  /**
   * @name fromProvider
   * @description
   * init did instance from `provider`
   * @example
   * ```typescript
   * import { LoginDid } from '@zcloak/login-did'
   *
   * const did = await LoginDid.from(provider);
   *
   * await did.sign(...); // sign with did login
   * await did.encrypt(...); // encrypt with did login
   * ```
   */
  public static async fromProvider(provider: BaseProvider) {
    if (!(await provider.isAuth())) {
      await provider.requestAuth();
    }

    const { document } = await provider.getCurrentDid();

    const didDetails = parseDidDocument(document);

    return new LoginDid(didDetails, provider);
  }

  public provider: BaseProvider;

  constructor(didDetails: IDidDetails, provider: BaseProvider) {
    super(didDetails);
    this.provider = provider;
  }

  public override async encrypt(message: Uint8Array | HexString, receiverUrlIn: DidUrl): Promise<EncryptedData> {
    const { data, receiverUrl, senderUrl, type } = await this.provider.encrypt(message, receiverUrlIn);

    return {
      data: hexToU8a(data),
      receiverUrl,
      senderUrl,
      type
    };
  }

  public override async decrypt(
    encryptedMessageWithNonce: Uint8Array | HexString,
    senderUrl: DidUrl
  ): Promise<Uint8Array> {
    const decrypted = await this.provider.decrypt(encryptedMessageWithNonce, senderUrl);

    return hexToU8a(decrypted);
  }

  public override async signWithKey(
    message: Uint8Array | HexString,
    keyOrDidUrl: DidUrl | Exclude<DidKeys, 'keyAgreement'>
  ): Promise<SignedData> {
    const { id, signature, type } = await this.provider.sign(message, keyOrDidUrl);

    return {
      id,
      type,
      signature: hexToU8a(signature)
    };
  }

  public override async sendTransaction(
    tx: UnsignedTransaction,
    providerUrl: string,
    keyOrDidUrl: DidUrl | Exclude<DidKeys, 'keyAgreement'> = 'controller'
  ): Promise<any> {
    const _tx: UnsignedTransaction = {
      ...tx,
      gasLimit: tx.gasLimit ? bigNumberishToHex(tx.gasLimit) : undefined,
      gasPrice: tx.gasPrice ? bigNumberishToHex(tx.gasPrice) : undefined,
      value: tx.value ? bigNumberishToHex(tx.value) : undefined,
      maxPriorityFeePerGas: tx.maxPriorityFeePerGas ? bigNumberishToHex(tx.maxPriorityFeePerGas) : undefined,
      maxFeePerGas: tx.maxFeePerGas ? bigNumberishToHex(tx.maxFeePerGas) : undefined
    };

    const result = await this.provider.sendTransaction(_tx, providerUrl, keyOrDidUrl);

    return result;
  }
}

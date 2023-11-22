// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { IDidKeyring } from '@zcloak/did/types';
import type { DidResolver } from '@zcloak/did-resolver';
import type { DidUrl } from '@zcloak/did-resolver/types';
import type { Message, MessageData, MessageType } from '../types';

import { stringToHex, stringToU8a } from '@polkadot/util';

import { base58Encode, randomAsHex } from '@zcloak/crypto';
import { Did } from '@zcloak/did';
import { VerifiableCredential } from '@zcloak/vc/types';

import { DEFAULT_MESSAGE_VERSION } from '../defaults';

function getCtype<T extends MessageType>(type: T, data: MessageData[T]): HexString | undefined {
  switch (type) {
    case 'Request_Attestation':
      return (data as MessageData['Request_Attestation']).ctype;

    case 'Response_Approve_Attestation':
      return (data as MessageData['Response_Approve_Attestation']).ctype;

    case 'Response_Reject_Attestation':
      return (data as MessageData['Response_Reject_Attestation']).ctype;

    case 'Reqeust_VP':
      return (data as MessageData['Reqeust_VP']).ctypes?.[0];

    case 'Response_Accept_VP':
      return (data as MessageData['Request_Attestation']).ctype;

    case 'Response_Reject_VP':
      return (data as MessageData['Response_Reject_VP']).ctypes?.[0];

    case 'Send_VP':
      return (data as MessageData['Send_VP']).verifiableCredential?.[0]?.ctype;

    case 'Send_issuedVC':
      return (data as MessageData['Send_issuedVC']).ctype;

    default:
      return undefined;
  }
}

/**
 * @name encryptMessage
 * @summary Encrypt the data to Message
 * @description
 * Encrypt the data to [[Message]] by different [[MessageCtyp]]. Returns encrypted message.
 */
export async function encryptMessage<T extends MessageType>(
  type: T,
  data: MessageData[T],
  sender: IDidKeyring,
  receiverUrl: DidUrl,
  reply?: string,
  resolver?: DidResolver
): Promise<Message<T>> {
  const id = randomAsHex(32);
  const createTime = Date.now();
  const version = DEFAULT_MESSAGE_VERSION;

  const message = stringToU8a(JSON.stringify(data));

  const encrypted = await sender.encrypt(message, receiverUrl, undefined, resolver);

  const ctype = getCtype(type, data);

  return {
    id,
    reply,
    createTime,
    version,
    msgType: type,
    sender: encrypted.senderUrl,
    receiver: encrypted.receiverUrl,
    ctype,
    encryptedMsg: base58Encode(encrypted.data)
  };
}

export async function batchEncryptMessage(
  data: VerifiableCredential<boolean>[],
  sender: Did,
  receivers: DidUrl[],
  reply?: string,
  resolver?: DidResolver
): Promise<Message<'Send_issuedVC'>[]> {
  const createTime = Date.now();
  const version = DEFAULT_MESSAGE_VERSION;

  const messages = data.map((vc, index) => {
    return {
      receiver: receivers[index],
      message: stringToHex(JSON.stringify(vc))
    };
  });

  const results = await sender.batchEncrypt(messages, sender.id, resolver);

  return results.map((result, index) => {
    const ctype = getCtype('Send_issuedVC', data[index]);
    const id = randomAsHex(32);

    return {
      id,
      reply,
      createTime,
      version,
      msgType: 'Send_issuedVC',
      sender: result.senderUrl,
      receiver: result.receiverUrl,
      ctype,
      encryptedMsg: base58Encode(result.data)
    };
  });
}

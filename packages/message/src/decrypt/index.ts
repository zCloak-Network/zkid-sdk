// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IDidKeyring } from '@zcloak/did/types';
import type { DidResolver } from '@zcloak/did-resolver';
import type { BaseMessage, DecryptedMessage, Message, MessageData, MessageType } from '../types';

import { assert, isHex, isNumber, u8aToString } from '@polkadot/util';

import { decodeMultibase } from '@zcloak/crypto';
import { isDidUrl, isSameUri } from '@zcloak/did/utils';
import { defaultResolver } from '@zcloak/did-resolver/defaults';
import { isRawCredential, isVC, isVP } from '@zcloak/vc/utils';

import { SUPPORT_MESSAGE_TYPES } from '../defaults';

export function verifyMessageBody<T extends MessageType>(message: DecryptedMessage<T>): void {
  const { data, msgType, sender } = message;

  switch (msgType) {
    case 'Request_Attestation':
      assert(
        isRawCredential(data),
        `Expected message data with msgType:${msgType} is RawCredential object`
      );
      assert(isSameUri(sender, data.holder), 'Message sender is not the holder of RawCredential');

      break;

    case 'Response_Approve_Attestation':
      assert(
        isVC(data),
        `Expected message data with msgType:${msgType} is VerifiableCredential object`
      );
      assert(
        isSameUri(sender, data.issuer),
        'Message sender is not the issuer of VerifiableCredential'
      );

      break;

    case 'Response_Reject_Attestation':
      assert(
        isDidUrl((data as any).holder) && isHex((data as any).ctype),
        `Expected message data with msgType:${msgType} has required keys holder(DidUrl) and ctype(HexString)`
      );

      break;

    case 'Reqeust_VP':
      break;

    case 'Response_Accept_VP':
      assert(
        isVP(data),
        `Expected message data with msgType:${msgType} is VerifiablePresentation object`
      );
      assert(
        isSameUri(sender, data.proof.verificationMethod),
        'Message sender is not the signer of VerifiablePresentation'
      );

      break;

    case 'Response_Reject_VP':
      break;

    case 'Send_VP':
      assert(
        isVP(data),
        `Expected message data with msgType:${msgType} is VerifiablePresentation object`
      );
      assert(
        isSameUri(sender, data.proof.verificationMethod),
        'Message sender is not the signer of VerifiablePresentation'
      );

      break;

    case 'Send_issuedVC':
      assert(
        isVC(data),
        `Expected message data with msgType:${msgType} is VerifiableCredential object`
      );
      assert(
        isSameUri(sender, data.issuer),
        'Message sender is not the issuer of VerifiableCredential'
      );

      break;

    default:
      throw new Error('Unsupport msgType $:msgType}');
  }
}

export function verifyMessageEnvelope<T extends MessageType>(message: BaseMessage<T>): void {
  const { createTime, ctype, id, msgType, receiver, reply, sender } = message;

  assert(isHex(id), 'Expected id is hex string');

  assert(isNumber(createTime), 'Expected createTime is number');

  assert(isHex(ctype), 'Expected ctype is hex string');

  assert(isHex(ctype), 'Expected ctype is hex string');

  assert(SUPPORT_MESSAGE_TYPES.includes(msgType), `Unsupported msgType:${msgType}`);

  assert(isDidUrl(receiver), 'Expected receiver is DidUrl');

  assert(isDidUrl(sender), 'Expected sender is DidUrl');

  if (reply && !isHex(reply)) {
    throw new Error('Expected reply is hex string');
  }
}

export async function decryptMessage<T extends MessageType>(
  message: Message<T>,
  did: IDidKeyring,
  resolver: DidResolver = defaultResolver
): Promise<DecryptedMessage<T>> {
  verifyMessageEnvelope(message);

  const decrypted = await did.decrypt(
    decodeMultibase(message.encryptedMsg),
    message.sender,
    message.receiver,
    resolver
  );

  const data: MessageData[T] = JSON.parse(u8aToString(decrypted));

  const decryptedMessage: DecryptedMessage<T> = {
    id: message.id,
    reply: message.reply,
    createTime: message.createTime,
    version: message.version,
    msgType: message.msgType,
    sender: message.sender,
    receiver: message.receiver,
    ctype: message.ctype,
    data
  };

  verifyMessageBody(decryptedMessage);

  return decryptedMessage;
}

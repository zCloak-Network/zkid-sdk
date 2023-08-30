// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IDidKeyring } from '@zcloak/did/types';
import type { DidResolver } from '@zcloak/did-resolver';
import type { BaseMessage, DecryptedMessage, Message, MessageData, MessageType } from '../types';

import { assert, isHex, isNumber, u8aToString } from '@polkadot/util';

import { decodeMultibase } from '@zcloak/crypto';
import { isDidUrl, isSameUri } from '@zcloak/did/utils';
import { defaultResolver } from '@zcloak/did-resolver/defaults';
import { isRawCredential, isVC, isVP } from '@zcloak/vc/is';

import { SUPPORT_MESSAGE_TYPES } from '../defaults';

/**
 * @name verifyMessageData
 * @summary Verifies the message data.
 * @description
 * Verifies the `message` data is correct, throw `Error` when failed, no throw otherwise.
 *
 * 1. check the data is correct.
 * 2. check the sender and issuer/holder.
 */
export function verifyMessageData(message: DecryptedMessage<MessageType>): void {
  const { data, msgType, sender } = message;

  switch (msgType) {
    case 'Request_Attestation':
      assert(isRawCredential(data), `Expected message data with msgType:${msgType} is RawCredential object`);
      assert(isSameUri(sender, data.holder), 'Message sender is not the holder of RawCredential');

      break;

    case 'Response_Approve_Attestation':
      assert(isVC(data), `Expected message data with msgType:${msgType} is VerifiableCredential object`);

      if (typeof data.issuer === 'object') {
        assert(
          data.issuer.some((issuer) => isSameUri(sender, issuer)),
          'Message sender is not the issuer of VerifiableCredential'
        );
      } else if (typeof data.issuer === 'string') {
        assert(isSameUri(sender, data.issuer), 'Message sender is not the issuer VerifiableCredential');
      } else {
        const check: never = data.issuer;

        return check;
      }

      break;

    case 'Response_Reject_Attestation':
      assert(
        isDidUrl(data.holder) && isHex(data.ctype),
        `Expected message data with msgType:${msgType} has required keys holder(DidUrl) and ctype(HexString)`
      );

      break;

    case 'Reqeust_VP':
      break;

    case 'Response_Accept_VP':
      assert(isVP(data), `Expected message data with msgType:${msgType} is VerifiablePresentation object`);
      assert(
        isSameUri(sender, data.proof.verificationMethod),
        'Message sender is not the signer of VerifiablePresentation'
      );

      break;

    case 'Response_Reject_VP':
      break;

    case 'Send_VP':
      assert(isVP(data), `Expected message data with msgType:${msgType} is VerifiablePresentation object`);
      assert(
        isSameUri(sender, data.proof.verificationMethod),
        'Message sender is not the signer of VerifiablePresentation'
      );

      break;

    case 'Send_issuedVC':
      assert(isVC(data), `Expected message data with msgType:${msgType} is VerifiableCredential object`);

      if (typeof data.issuer === 'object') {
        assert(
          data.issuer.some((issuer) => isSameUri(sender, issuer)),
          'Message sender is not the issuer of VerifiableCredential'
        );
      } else if (typeof data.issuer === 'string') {
        assert(isSameUri(sender, data.issuer), 'Message sender is not the issuer VerifiableCredential');
      } else {
        const check: never = data.issuer;

        throw new Error(`Message sender type wrong, the wrong issuer is : ${check}`);
      }

      break;

    default:
      if (!msgType.startsWith('Extends_')) {
        throw new Error(`Unsupport msgType: ${msgType}`);
      }
  }
}

/**
 * @name verifyMessageEnvelope
 * @summary Verifies the message field is correct.
 * @description
 * Verifies the `message` field is correct, throw `Error` when failed, no throw otherwise.
 */
export function verifyMessageEnvelope<T extends MessageType>(message: BaseMessage<T>): void {
  const { createTime, ctype, id, msgType, receiver, reply, sender } = message;

  assert(isHex(id), 'Expected id is hex string');

  assert(isNumber(createTime), 'Expected createTime is number');

  ctype && assert(isHex(ctype), 'Expected ctype is hex string');

  assert(SUPPORT_MESSAGE_TYPES.includes(msgType) || msgType.startsWith('Extends_'), `Unsupported msgType:${msgType}`);

  assert(isDidUrl(receiver), 'Expected receiver is DidUrl');

  assert(isDidUrl(sender), 'Expected sender is DidUrl');

  if (reply && !isHex(reply)) {
    throw new Error('Expected reply is hex string');
  }
}

/**
 * @name decryptMessage
 * @summary Decrypted the data to Message
 * @description
 * Decrypted the data to [[DecryptedMessage]] by different [[MessageCtyp]]. Returns decrypted message.
 */
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

  verifyMessageData(decryptedMessage);

  return decryptedMessage;
}

// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Message } from '@zcloak/message/types';

import { choseResolver, sendEncryptedMessage } from '../utils';

export async function issueWithMessage(didResolver: string, message: string) {
  const baseUrl = choseResolver(didResolver);

  if (baseUrl === undefined) {
    console.log('didUrl is undefiend');

    return false;
  }

  await sendEncryptedMessage(baseUrl, JSON.parse(message) as Message<'Send_issuedVC'>);

  console.log('send encrypted message successfully !!!');

  return true;
}

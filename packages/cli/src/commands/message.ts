// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

// import fs from 'fs';

// import { initCrypto } from '@zcloak/crypto';
// import { CType } from '@zcloak/ctype/types';
// import { Did } from '@zcloak/did';
// import { encryptMessage } from '@zcloak/message';
// import { VerifiableCredentialBuilder } from '@zcloak/vc';
// import { RawCredential, VerifiableCredential } from '@zcloak/vc/types';

// import { choseResolver, getCType, getDidFromMnemonic, isValidPath } from '../utils';

// export async function sendMessage() {}

// export async function message(didResolver: string, messageType: string, vc: string, attesterMnemonic: string) {
//   const baseUrl = choseResolver(didResolver);

//   if (!baseUrl) {
//     return false;
//   }

//   let attesterDid: Did;

//   if (!isValidPath(attesterMnemonic)) {
//     // attesterMnemonic is string
//     attesterDid = getDidFromMnemonic(attesterMnemonic);
//   } else {
//     // attesterMnemonic is json file
//     const { mnemonic } = JSON.parse(fs.readFileSync(attesterMnemonic, { encoding: 'utf-8' }));

//     attesterDid = getDidFromMnemonic(mnemonic);
//   }

//   if (!isValidPath(vc)) {
//     // vc is string
//     const vcred = JSON.parse(vc) as VerifiableCredential<false | true>;

//     const { holder } = vcred;
//     // const
//     // const message = await encryptMessage(messageType, vcred, attesterDid, );
//   } else {
//     // vc is json file
//   }
// }

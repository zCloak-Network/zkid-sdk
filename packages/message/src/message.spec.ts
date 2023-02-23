// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CType } from '@zcloak/ctype/types';
import type { RawCredential } from '@zcloak/vc/types';

import { alice, bob, testResolver } from 'test-support';

import { initCrypto } from '@zcloak/crypto';
import { getPublish } from '@zcloak/ctype';
import { Raw, VerifiableCredentialBuilder } from '@zcloak/vc';

import { decryptMessage } from './decrypt';
import { encryptMessage } from './encrypt';

describe('message encrypt and decrypt', (): void => {
  let rawCredential: RawCredential;

  let ctype: CType;

  beforeAll(async () => {
    await initCrypto();
    ctype = await getPublish(
      {
        title: 'Test',
        description: 'Test',
        type: 'object',
        properties: {
          name: {
            type: 'string'
          },
          age: {
            type: 'integer'
          },
          no: {
            type: 'string'
          }
        },
        required: ['name', 'age']
      },
      bob
    );
    const raw = new Raw({
      contents: {
        name: 'zCloak',
        age: 1,
        no: '1234'
      },
      owner: alice.id,
      ctype,
      hashType: 'RescuePrime'
    });

    rawCredential = raw.toRawCredential('Keccak256');
  });

  describe('Send Attestation message types', () => {
    it('Send Request_Attestation message', async () => {
      const message = await encryptMessage(
        'Request_Attestation',
        rawCredential,
        alice,
        bob.getKeyUrl('keyAgreement'),
        undefined,
        testResolver
      );
      const decrypted = await decryptMessage(message, bob, testResolver);

      expect(decrypted.data).toEqual(rawCredential);
    });

    it('Send Response_Reject_Attestation message', async () => {
      const message = await encryptMessage(
        'Response_Reject_Attestation',
        {
          reason: 'No reason',
          ctype: ctype.$id,
          holder: alice.id
        },
        bob,
        alice.getKeyUrl('keyAgreement'),
        undefined,
        testResolver
      );
      const decrypted = await decryptMessage(message, alice, testResolver);

      expect(decrypted.data).toEqual({
        reason: 'No reason',
        ctype: ctype.$id,
        holder: alice.id
      });
    });

    it('Send Response_Approve_Attestation message', async () => {
      const vc = await VerifiableCredentialBuilder.fromRawCredential(rawCredential, ctype)
        .setExpirationDate(null)
        .build(bob);
      const message = await encryptMessage(
        'Response_Approve_Attestation',
        vc,
        bob,
        alice.getKeyUrl('keyAgreement'),
        undefined,
        testResolver
      );
      const decrypted = await decryptMessage(message, alice, testResolver);

      expect(decrypted.data).toEqual(vc);
    });
  });

  describe('Send Extends msgType', () => {
    it('Send string data', async () => {
      const message = await encryptMessage(
        'Extends_send_string',
        'send string data',
        alice,
        bob.getKeyUrl('keyAgreement'),
        undefined,
        testResolver
      );
      const decrypted = await decryptMessage(message, bob, testResolver);

      expect(decrypted.data).toEqual('send string data');
    });

    it('Send object data', async () => {
      const message = await encryptMessage(
        'Extends_send_object',
        {
          key1: 'key1',
          key2: 'key2'
        },
        alice,
        bob.getKeyUrl('keyAgreement'),
        undefined,
        testResolver
      );
      const decrypted = await decryptMessage(message, bob, testResolver);

      expect(decrypted.data).toEqual({
        key1: 'key1',
        key2: 'key2'
      });
    });

    it('Send boolean data', async () => {
      const message = await encryptMessage(
        'Extends_send_boolean',
        true,
        alice,
        bob.getKeyUrl('keyAgreement'),
        undefined,
        testResolver
      );
      const decrypted = await decryptMessage(message, bob, testResolver);

      expect(decrypted.data).toEqual(true);
    });
  });
});

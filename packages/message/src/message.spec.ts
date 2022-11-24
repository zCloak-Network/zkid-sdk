// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CType } from '@zcloak/ctype/types';
import type { RawCredential } from '@zcloak/vc/types';

import { generateMnemonic, initCrypto } from '@zcloak/crypto';
import { getPublish } from '@zcloak/ctype';
import { Did, helpers } from '@zcloak/did';
import { MockDidResolver } from '@zcloak/did-resolver';
import { Raw, VerifiableCredentialBuilder } from '@zcloak/vc';

import { decryptMessage } from './decrypt';
import { encryptMessage } from './encrypt';

describe('message encrypt and decrypt', (): void => {
  const resolver = new MockDidResolver();
  let holder: Did;
  let issuer: Did;
  let rawCredential: RawCredential;

  let ctype: CType;

  beforeAll(async () => {
    await initCrypto();
    holder = helpers.createEcdsaFromMnemonic(generateMnemonic(12));
    issuer = helpers.createEcdsaFromMnemonic(generateMnemonic(12));
    resolver.addDocument(holder.getDocument());
    resolver.addDocument(issuer.getDocument());
    ctype = getPublish(
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
      issuer
    );
    const raw = new Raw({
      contents: {
        name: 'zCloak',
        age: 1,
        no: '1234'
      },
      owner: holder.id,
      ctype,
      hashType: 'RescuePrime'
    });

    raw.calcRootHash();

    rawCredential = raw.toRawCredential('Keccak256');
  });

  describe('Send Attestation message types', () => {
    it('Send Request_Attestation message', async () => {
      const message = await encryptMessage(
        'Request_Attestation',
        rawCredential,
        holder,
        issuer.getKeyUrl('keyAgreement'),
        undefined,
        resolver
      );
      const decrypted = await decryptMessage(message, issuer, resolver);

      expect(decrypted.data).toEqual(rawCredential);
    });

    it('Send Response_Reject_Attestation message', async () => {
      const message = await encryptMessage(
        'Response_Reject_Attestation',
        {
          reason: 'No reason',
          ctype: ctype.$id,
          holder: holder.id
        },
        issuer,
        holder.getKeyUrl('keyAgreement'),
        undefined,
        resolver
      );
      const decrypted = await decryptMessage(message, holder, resolver);

      expect(decrypted.data).toEqual({
        reason: 'No reason',
        ctype: ctype.$id,
        holder: holder.id
      });
    });

    it('Send Response_Approve_Attestation message', async () => {
      const vc = VerifiableCredentialBuilder.fromRawCredential(rawCredential, ctype)
        .setExpirationDate(null)
        .build(issuer);
      const message = await encryptMessage(
        'Response_Approve_Attestation',
        vc,
        issuer,
        holder.getKeyUrl('keyAgreement'),
        undefined,
        resolver
      );
      const decrypted = await decryptMessage(message, holder, resolver);

      expect(decrypted.data).toEqual(vc);
    });
  });
});

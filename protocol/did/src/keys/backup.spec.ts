// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { testKeyring } from 'test-support';

import { initCrypto, mnemonicGenerate } from '@zcloak/crypto';

import { backup, getEcdsaIdentifierPair } from './backup';
import { DEFAULT_DID_KEYS_JSON_VERSION } from './defaults';
import { fromMnemonic } from './from';

describe('Backup did', (): void => {
  beforeAll(async () => {
    await initCrypto();
  });

  it('get ecdsa identifier pair', () => {
    const mnemonic = mnemonicGenerate(12);
    const did = fromMnemonic(testKeyring, mnemonic);

    expect(getEcdsaIdentifierPair(testKeyring, did)?.publicKey).toEqual(
      testKeyring.createFromMnemonic(mnemonic, undefined, 'ecdsa').publicKey
    );
  });

  it('backup did', () => {
    const mnemonic = mnemonicGenerate(12);
    const did = fromMnemonic(testKeyring, mnemonic);

    expect(backup(testKeyring, did, '1234')).toMatchObject({
      didUrl: did.id,
      version: DEFAULT_DID_KEYS_JSON_VERSION,
      authentication: Array.from(did.authentication ?? []),
      assertionMethod: Array.from(did.assertionMethod ?? []),
      keyAgreement: Array.from(did.keyAgreement ?? []),
      capabilityInvocation: Array.from(did.capabilityInvocation ?? []),
      capabilityDelegation: Array.from(did.capabilityDelegation ?? [])
    });
  });
});

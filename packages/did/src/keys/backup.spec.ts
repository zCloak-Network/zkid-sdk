// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initCrypto, mnemonicGenerate } from '@zcloak/crypto';
import { Keyring } from '@zcloak/keyring';

import { createEcdsaFromMnemonic } from '../did/helpers';
import { backup, getEcdsaIdentifierPair } from './backup';
import { DEFAULT_DID_KEYS_JSON_VERSION } from './defaults';

describe('Backup did', (): void => {
  const keyring = new Keyring();

  beforeAll(async () => {
    await initCrypto();
  });

  it('get ecdsa identifier pair', () => {
    const mnemonic = mnemonicGenerate(12);
    const did = createEcdsaFromMnemonic(mnemonic, keyring);

    expect(getEcdsaIdentifierPair(keyring, did)?.publicKey).toEqual(
      keyring.createFromMnemonic(mnemonic, undefined, 'ecdsa').publicKey
    );
  });

  it('backup did', () => {
    const mnemonic = mnemonicGenerate(12);
    const did = createEcdsaFromMnemonic(mnemonic, keyring);

    expect(backup(keyring, did, '1234')).toMatchObject({
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

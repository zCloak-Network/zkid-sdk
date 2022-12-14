// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidDocument, DidUrl } from '@zcloak/did-resolver/types';

import { u8aToU8a } from '@polkadot/util';

import { decodeMultibase, ed25519Verify, secp256k1Verify } from '@zcloak/crypto';
import { DidResolver } from '@zcloak/did-resolver';
import { defaultResolver } from '@zcloak/did-resolver/defaults';

/**
 * @name didVerify
 * @summary Verifies the signature on the supplied message.
 * @description
 * Verifies the `signature` on `message` with the supplied `didUrl`. Returns `true` on success, `false` otherwise.
 *
 * You alson can supply `resolverOrDidDocument`, it support [[DidDocument]] and [[DidResolver]]
 * @example
 * <BR>
 * supply [[DidDocument]]
 * ```typescript
 * import { didVerify } from '@zcloak/verify'
 *
 * didVerify([...], [...], 'did:zk:...', didDocument); // true/false
 * ```
 * supply [[DidResolver]]
 * ```typescript
 * import { didVerify } from '@zcloak/verify'
 *
 * didVerify([...], [...], 'did:zk:...', resolver); // true/false
 * ```
 *
 * use without resolver
 * @example
 * ```typescript
 * import { didVerify } from '@zcloak/verify'
 *
 * // if you don't supply resolver, default to use [[ArweaveResolver]]
 * didVerify([...], [...], 'did:zk:...'); // true/false
 * ```
 */
export async function didVerify(
  message: HexString | Uint8Array | string,
  signature: HexString | Uint8Array,
  didUrl: DidUrl,
  resolverOrDidDocument?: DidDocument | DidResolver
): Promise<boolean> {
  if (resolverOrDidDocument === undefined) {
    resolverOrDidDocument = defaultResolver;
  }

  const messageU8a = u8aToU8a(message);

  const document =
    resolverOrDidDocument instanceof DidResolver
      ? await resolverOrDidDocument.resolve(didUrl)
      : resolverOrDidDocument;

  const finded = document.verificationMethod?.find((method) => {
    return method.id;
  });

  if (!finded) return false;

  const publicKey = decodeMultibase(finded.publicKeyMultibase);

  if (finded.type === 'EcdsaSecp256k1VerificationKey2019') {
    return secp256k1Verify(messageU8a, signature, publicKey);
  } else if (finded.type === 'Ed25519VerificationKey2020') {
    return ed25519Verify(messageU8a, signature, publicKey);
  }

  return false;
}

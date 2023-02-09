// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidDocument, DidUrl, VerificationMethodType } from '@zcloak/did-resolver/types';

import { u8aToU8a } from '@polkadot/util';

import { ed25519Verify, secp256k1Verify } from '@zcloak/crypto';
import { helpers } from '@zcloak/did';
import { DidResolver } from '@zcloak/did-resolver';
import { defaultResolver } from '@zcloak/did-resolver/defaults';

const VERIFIERS: Record<
  VerificationMethodType,
  (message: Uint8Array, signature: HexString | Uint8Array, publicKey: Uint8Array) => boolean
> = {
  EcdsaSecp256k1VerificationKey2019: secp256k1Verify,
  Ed25519VerificationKey2020: ed25519Verify,
  X25519KeyAgreementKey2019: () => false
};

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

  const did = helpers.fromDidDocument(document);

  for (const [, { publicKey, type }] of did.keyRelationship) {
    const isTrue = VERIFIERS[type](messageU8a, signature, publicKey);

    if (isTrue) {
      return isTrue;
    }
  }

  return false;
}

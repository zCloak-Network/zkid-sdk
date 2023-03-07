// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidDocument, DidUrl, SignatureType } from '@zcloak/did-resolver/types';

import { ed25519Verify, eip191HashMessage, keccak256AsU8a, secp256k1Verify } from '@zcloak/crypto';
import { helpers } from '@zcloak/did';
import { DidResolver } from '@zcloak/did-resolver';
import { defaultResolver } from '@zcloak/did-resolver/defaults';

const VERIFIERS: Record<
  SignatureType,
  (
    message: Uint8Array,
    signature: HexString | Uint8Array,
    publicKey: HexString | Uint8Array
  ) => boolean
> = {
  EcdsaSecp256k1Signature2019: secp256k1Verify,
  EcdsaSecp256k1SignatureEip191: secp256k1Verify,
  Ed25519Signature2018: ed25519Verify
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
  message: HexString | Uint8Array,
  signature: HexString | Uint8Array,
  signatureType: SignatureType,
  didUrl: DidUrl,
  resolverOrDidDocument?: DidDocument | DidResolver
): Promise<boolean> {
  if (resolverOrDidDocument === undefined) {
    resolverOrDidDocument = defaultResolver;
  }

  const messageU8a: Uint8Array =
    signatureType === 'EcdsaSecp256k1SignatureEip191'
      ? eip191HashMessage(message)
      : keccak256AsU8a(message);

  const document =
    resolverOrDidDocument instanceof DidResolver
      ? await resolverOrDidDocument.resolve(didUrl)
      : resolverOrDidDocument;

  const did = helpers.fromDidDocument(document);

  const { publicKey } = did.get(didUrl);
  const isTrue = VERIFIERS[signatureType](messageU8a, signature, publicKey);

  return isTrue;
}

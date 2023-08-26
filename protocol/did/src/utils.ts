// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DidUrl, VerificationMethodType } from '@zcloak/did-resolver/types';
import type { KeypairType } from '@zcloak/keyring/types';

import { stringToU8a, u8aConcat } from '@polkadot/util';

import { parseDid } from '@zcloak/did-resolver/parseDid';

/**
 * Compare whether two didUrls have the same Uri
 * such as: `did:zk:abcd#key-0` is equal to `did:zk:abcd?query#key-1`
 */
export function isSameUri(didUrl1: DidUrl, didUrl2: DidUrl): boolean {
  const { did: did1 } = parseDid(didUrl1);
  const { did: did2 } = parseDid(didUrl2);

  return did1 === did2;
}

export function isDidUrl(value: unknown): value is DidUrl {
  if (typeof value !== 'string') return false;

  try {
    parseDid(value);

    return true;
  } catch {
    return false;
  }
}

/**
 * @name typeTransform
 * @summary transform `keypairType` to `VerificationMethodType`
 * @descryption
 * provide `KeypairType`, return `VerificationMethodType`, throw Error when not transform.
 */
export function typeTransform(type: KeypairType): VerificationMethodType {
  switch (type) {
    case 'ecdsa':
      return 'EcdsaSecp256k1VerificationKey2019';
    case 'ed25519':
      return 'Ed25519VerificationKey2020';
    case 'x25519':
      return 'X25519KeyAgreementKey2019';

    default:
      throw new Error(`Can not transform type: ${type}`);
  }
}

/**
 * @name encodeDidUrl
 * @summary
 * encode `didUrl` to a bytes.
 * @description
 * encode `didUrl` to bytes with the identifier as HexString, and the prefix is `did:zk:`. Returns `Uint8Array`.
 * @example
 * ```typescript
 * import { encodeDidUrl } from '@zcloak/did'
 *
 * encodeDidUrl('did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1'); // [...]
 * ```
 */
export function encodeDidUrl(didUrl: DidUrl): Uint8Array {
  const { identifier, method } = parseDid(didUrl);

  const prefix = stringToU8a(`did:${method}:`);

  return u8aConcat(prefix, identifier);
}

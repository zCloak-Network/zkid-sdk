// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidUrl } from '@zcloak/did-resolver/types';
import type { HashType, VerifiableCredentialVersion } from './types';

import { numberToU8a, stringToU8a, u8aConcat, u8aToHex } from '@polkadot/util';

import { DEFAULT_DIGEST_HASH_TYPE } from './defaults';
import { HASHER } from './hasher';

export type DigestResult = { digest: HexString; type: HashType };

export interface DigestPayloadV0 {
  /**
   * rootHash of credential subject
   */
  rootHash: HexString;
  /**
   * the holder of vc
   */
  holder: DidUrl;
  /**
   * expiration date
   */
  expirationDate?: number;
  /**
   * ctype hash
   */
  ctype: HexString;
}

export interface DigestPayloadV1 extends DigestPayloadV0 {
  /**
   * @since `v1`
   * issuance date
   */
  issuanceDate: number;
}

export type DigestPayload<Version extends VerifiableCredentialVersion> = Version extends '0'
  ? DigestPayloadV0
  : DigestPayloadV1;

/**
 * @name calcDigest
 * @summary calc credential digest with version
 * @description
 * 1. it will encode by ctype, expirationDate, rootHash, holder, ?issuanceDate
 * 2. generate hash value use provide [[hashType]]
 * @example
 * ```typescript
 * import { calcDigest } from '@zcloak/vc';
 *
 * calcDigest('1', { rootHash: '0x...', holder: 'did:zk:...', ctype: '0x...' }); // { digest: '0x...', type: 'Keccak256' }
 * ```
 */
export function calcDigest<Version extends VerifiableCredentialVersion>(
  version: Version,
  payload: DigestPayload<Version>,
  hashType: HashType = DEFAULT_DIGEST_HASH_TYPE
) {
  let encoded: Uint8Array;

  if (version === '0') {
    encoded = u8aConcat(
      payload.rootHash,
      stringToU8a(payload.holder),
      numberToU8a(payload.expirationDate || 0),
      payload.ctype
    );
  } else {
    encoded = u8aConcat(
      payload.rootHash,
      stringToU8a(payload.holder),
      numberToU8a((payload as DigestPayload<'1'>).issuanceDate),
      numberToU8a(payload.expirationDate || 0),
      payload.ctype
    );
  }

  return {
    type: hashType,
    digest: u8aToHex(HASHER[hashType](encoded))
  };
}

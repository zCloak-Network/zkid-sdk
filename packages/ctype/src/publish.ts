// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { Did } from '@zcloak/did';
import type { DidUrl } from '@zcloak/did-resolver/types';
import type { BaseCType, CType } from './types';

import { u8aToHex } from '@polkadot/util';

import { base58Encode, jsonCanonicalize, keccak256AsU8a } from '@zcloak/crypto';
import { parseDid } from '@zcloak/did-resolver/parseDid';

import { DEFAULT_CTYPE_SCHEMA } from './defaults';

export function getCTypeHash(
  base: BaseCType,
  publisher: DidUrl,
  schema = DEFAULT_CTYPE_SCHEMA
): HexString {
  const obj = {
    title: base.title,
    description: base.description,
    type: base.type,
    properties: base.properties,
    required: base.required,
    $schema: schema,
    publisher: parseDid(publisher).did
  };

  return u8aToHex(keccak256AsU8a(jsonCanonicalize(obj)));
}

export async function getPublish(base: BaseCType, publisher: Did): Promise<CType> {
  const hash = getCTypeHash(base, publisher.id);

  const { id, signature } = await publisher.signWithKey(hash, 'authentication');

  return {
    $id: hash,
    $schema: DEFAULT_CTYPE_SCHEMA,
    ...base,
    publisher: id,
    signature: base58Encode(signature)
  };
}

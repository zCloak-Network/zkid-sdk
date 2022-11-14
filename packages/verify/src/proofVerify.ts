// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidDocument } from '@zcloak/did-resolver/types';
import type { Proof } from '@zcloak/vc/types';

import { stringToU8a, u8aConcat } from '@polkadot/util';

import { decodeMultibase } from '@zcloak/crypto';
import { DidResolver } from '@zcloak/did-resolver';

import { didVerify } from './didVerify';

export async function proofVerify(
  message: HexString | Uint8Array,
  proof: Proof,
  resolverOrDidDocument: DidDocument | DidResolver
): Promise<boolean>;
export async function proofVerify(message: HexString | Uint8Array, proof: Proof): Promise<boolean>;

export async function proofVerify(
  message: HexString | Uint8Array,
  proof: Proof,
  resolverOrDidDocument?: DidDocument | DidResolver
): Promise<boolean> {
  const { challenge, proofValue, verificationMethod } = proof;

  const signature = decodeMultibase(proofValue);

  message = u8aConcat(message, stringToU8a(challenge));

  if (!resolverOrDidDocument) {
    return didVerify(message, signature, verificationMethod);
  } else {
    return didVerify(message, signature, verificationMethod, resolverOrDidDocument);
  }
}

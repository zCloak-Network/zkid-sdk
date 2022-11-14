// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type {
  HashType,
  VerifiableCredential,
  VerifiablePresentation,
  VerifiablePresentationType
} from '@zcloak/vc/types';

import { hashDigests } from '@zcloak/vc';

import { proofVerify } from './proofVerify';
import { vcVerify, vcVerifyDigest } from './vcVerify';

// @internal check the id is right
function idCheck(digests: HexString[], hashType: HashType, id: HexString): boolean {
  const { hash } = hashDigests(digests, hashType);

  return hash === id;
}

const VERIFIERS: Record<
  VerifiablePresentationType,
  (vc: VerifiableCredential) => Promise<boolean>
> = {
  VP: vcVerify,
  VP_Digest: vcVerifyDigest,
  VP_SelectiveDisclosure: vcVerify
};

export async function vpVerify(vp: VerifiablePresentation): Promise<boolean> {
  const { hasher, id, proof, type, verifiableCredential } = vp;
  const idValid = idCheck(
    verifiableCredential.map(({ digest }) => digest),
    hasher[0],
    id
  );

  const proofValid = await proofVerify(id, proof);

  const results = await Promise.all(type.map((t, i) => VERIFIERS[t](verifiableCredential[i])));

  return idValid && proofValid && !results.includes(false);
}

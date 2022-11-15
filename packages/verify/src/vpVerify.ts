// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type {
  HashType,
  VerifiableCredential,
  VerifiablePresentation,
  VerifiablePresentationType
} from '@zcloak/vc/types';

import { assert } from '@polkadot/util';

import { isSameUri } from '@zcloak/did/utils';
import { hashDigests } from '@zcloak/vc';
import { isVP } from '@zcloak/vc/utils';

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

/**
 * @name vpVerify
 * @summary verify [[VerifiablePresentation]] is valid.
 * @description
 *
 */
export async function vpVerify(vp: VerifiablePresentation): Promise<boolean> {
  assert(isVP(vp), 'input `vp` is not VerifiablePresentation object');

  const { hasher, id, proof, type, verifiableCredential } = vp;
  const idValid = idCheck(
    verifiableCredential.map(({ digest }) => digest),
    hasher[0],
    id
  );

  // check vc is same did with proof's signer
  for (const vc of verifiableCredential) {
    if (!isSameUri(vc.issuer, proof.verificationMethod)) {
      return false;
    }
  }

  const proofValid = await proofVerify(id, proof);

  const results = await Promise.all(type.map((t, i) => VERIFIERS[t](verifiableCredential[i])));

  return idValid && proofValid && !results.includes(false);
}

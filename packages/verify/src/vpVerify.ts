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
 * @summary Verifies the vp is valid.
 * @description
 * Verifies the `vp` is valid. `true` on success, `false` otherwise.
 *
 * This function has below steps:
 * 1. check the `vp` is and [[VerifiablePresentation]] object.
 * 2. check the `vp.id` is `true`.
 * 3. check the holder on `vp.verifiableCredential` is sameUri with `proof.verificationMethod`.
 * 4. call `vcVerify` used the `vp.verifiableCredential`, and check is `true` or `false`.
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

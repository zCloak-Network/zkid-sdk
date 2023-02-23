// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidResolver } from '@zcloak/did-resolver';
import type { DidDocument } from '@zcloak/did-resolver/types';
import type {
  HashType,
  VerifiableCredential,
  VerifiablePresentation,
  VerifiablePresentationType,
  VerifiablePresentationVersion
} from '@zcloak/vc/types';

import { assert, stringToU8a, u8aConcat } from '@polkadot/util';

import { isSameUri } from '@zcloak/did/utils';
import { vpID } from '@zcloak/vc';
import { isVP } from '@zcloak/vc/is';
import { signedVPMessage } from '@zcloak/vc/utils';

import { proofVerify } from './proofVerify';
import { vcVerify, vcVerifyDigest } from './vcVerify';

// @internal check the id is right
function idCheck(
  digests: HexString[],
  hashType: HashType,
  id: HexString,
  version: VerifiablePresentationVersion
): boolean {
  const { hash } = vpID(digests, version, hashType);

  return hash === id;
}

const VERIFIERS: Record<
  VerifiablePresentationType,
  (
    vc: VerifiableCredential<boolean>,
    resolverOrDidDocument?: DidDocument | DidResolver
  ) => Promise<boolean>
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
export async function vpVerify(
  vp: VerifiablePresentation,
  resolverOrDidDocument?: DidDocument | DidResolver
): Promise<boolean> {
  assert(isVP(vp), 'input `vp` is not VerifiablePresentation object');

  const { hasher, id, proof, type, verifiableCredential, version } = vp;
  const idValid = idCheck(
    verifiableCredential.map(({ digest }) => digest),
    hasher[0],
    id,
    version
  );

  // check vc is same did with proof's signer
  for (const vc of verifiableCredential) {
    if (!isSameUri(vc.holder, proof.verificationMethod)) {
      return false;
    }
  }

  const message =
    version === '1'
      ? signedVPMessage(id, version, proof.challenge)
      : u8aConcat(id, stringToU8a(proof.challenge));

  const proofValid = await proofVerify(message, proof, resolverOrDidDocument);

  const results = await Promise.all(
    type.map((t, i) => VERIFIERS[t](verifiableCredential[i], resolverOrDidDocument))
  );

  return idValid && proofValid && !results.includes(false);
}

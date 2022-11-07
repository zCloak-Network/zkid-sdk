// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DidUrl } from '@zcloak/did-resolver/types';
import type { ICredential } from './credential/type';
import type { Proof, VerifiableCredential } from './types';

import { assert } from '@polkadot/util';

import { isSameUri } from '@zcloak/did/utils';

import { Credential } from './credential';

export function fromCredential(input: ICredential): VerifiableCredential {
  return Credential.fromCredential(input).getVC();
}

/**
 * compose multiple VC to a single VC
 * the digest of all VC must be the same, and length of issuer and proof is eq
 * @param vcs [[VerifiableCredential]] array
 * @returns composed VerifiableCredential
 */
// todo: we dont aggregate vcs, instead using vp
export function compose(...vcs: VerifiableCredential[]): VerifiableCredential {
  assert(vcs.length > 1, 'Can only be composed when there are multiple vc');

  const [main, ...others] = vcs;

  assert(
    others.map((other) => other.digest === main.digest).reduce((l, r) => l && r),
    'digest must be the same'
  );

  const issuer: DidUrl[] = [];
  const proof: Proof[] = [];

  vcs.forEach((vc) => {
    assert(isSameUri(vc.issuer[0], vc.proof[0]?.verificationMethod), 'not a same uri');
    issuer.push(vc.issuer[0]);
    proof.push(vc.proof[0]);
  });

  return {
    ...main,
    issuer,
    proof
  };
}

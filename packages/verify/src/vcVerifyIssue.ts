// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Did } from '@zcloak/did';
import type { DidResolver } from '@zcloak/did-resolver';
import type { VerifiableCredential } from '@zcloak/vc/types';
import { VerifiableCredentialBuilder } from '@zcloak/vc';

import { assert } from '@polkadot/util';
import { vcVerify } from './vcVerify';

/**
 * since @2.0.0
 * @param issuer
 * @param vc
 * @returns
 */
export async function addProof(
    issuer: Did,
    vc: VerifiableCredential<boolean>,
    resolverOrDidDocument?: DidResolver
  ): Promise<VerifiableCredential<boolean>> {
    const existedIssuer = vc.issuer;
    const existedProof = vc.proof;
    const exitedDigest = vc.digest;

    assert(vc.version === '2', 'Only version2 support addProof');

    // Must have  proof
    assert(existedIssuer.length > 0 && existedProof.length > 0, 'field issuer or proof is empty');

    const vcVerifyResult = await vcVerify(vc, resolverOrDidDocument);
    assert(vcVerifyResult, 'The VC is invalid')

    // addProof available since vc@2.0.0
    const version = '2';
    const proof = await VerifiableCredentialBuilder._signDigest(issuer, exitedDigest, version);
    const modifiedVC: VerifiableCredential<boolean> = {
      ...vc,
      issuer: [...existedIssuer, issuer.id] as any,
      proof: [...existedProof, proof]
    };

    return modifiedVC;
  }
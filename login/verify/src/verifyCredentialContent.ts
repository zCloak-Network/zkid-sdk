// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DidUri } from '@kiltprotocol/types';
import type { DidResolver } from '@zcloak/did-resolver';
import type { DidUrl } from '@zcloak/did-resolver/types';
import type { RpcResponse } from '@zcloak/login-rpc';

import { Credential } from '@kiltprotocol/core';
import { Utils } from '@kiltprotocol/did';
import { assert } from '@polkadot/util';

import { isDidUrl, isSameUri } from '@zcloak/did/utils';
import { isVP } from '@zcloak/vc/is';
import { vpVerify } from '@zcloak/verify';

/**
 * verify credential content, pass credential content, will check bellow.
 * check the data was not tampered with, by checking the data against hashes.
 * check claimerSignature is verified.
 * check that attestation is consistent with on-chain.
 * @param credential the `RequestCredentialContentReponse` of login-rpc, get it use `did_requestCredentialContent` method
 * @param challenge a random string, pass it when verify claimerSignature.
 * @param owner the credential owner
 * @returns `boolean` verify result
 */
export async function verifyCredentialContent<
  T extends 'did_requestCredentialContent' | 'did_requestCredentialContent$Kilt' = 'did_requestCredentialContent'
>(
  credential: RpcResponse<T>,
  challenge: string,
  owner: T extends 'did_requestCredentialContent' ? DidUrl : DidUri,
  resolver?: DidResolver
): Promise<boolean> {
  if (isVP(credential)) {
    assert(isDidUrl(owner), 'expect owner to be zkid did url');

    return (
      challenge === credential.proof.challenge &&
      isSameUri(credential.proof.verificationMethod, owner) &&
      vpVerify(credential, resolver)
    );
  }

  return (
    Utils.isSameSubject(credential.request.claim.owner, owner as DidUri) &&
    Credential.isICredential(credential) &&
    credential.request.claimerSignature?.challenge === challenge &&
    (await Credential.verify(credential))
  );
}

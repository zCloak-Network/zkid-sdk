// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SignatureType } from '@zcloak/did-resolver/types';
import type {
  HashType,
  Proof,
  RawCredential,
  VerifiableCredential,
  VerifiablePresentation,
  VerifiablePresentationType
} from './types';

import { isArray, isHex, isJsonObject, isNull, isNumber, isString, isUndefined } from '@polkadot/util';

import { isBase32, isBase58, isBase64 } from '@zcloak/crypto';
import { isDidUrl } from '@zcloak/did/utils';
import { parseDid } from '@zcloak/did-resolver/parseDid';

import { ALL_HASH_TYPES, ALL_SIG_TYPES, ALL_VP_TYPES } from './defaults';

/**
 * @name isHashType
 * @description
 * check the `input` is [[HashType]]
 */
export function isHashType(input: unknown): input is HashType {
  return ALL_HASH_TYPES.includes(input as any);
}

/**
 * @name isVpType
 * @description
 * check the `input` is [[VerifiablePresentationType]]
 */
export function isVpType(input: unknown): input is VerifiablePresentationType {
  return ALL_VP_TYPES.includes(input as any);
}

/**
 * @name isSignatureType
 * @description
 * check the `input` is [[SignatureType]]
 */
export function isSignatureType(input: unknown): input is SignatureType {
  return ALL_SIG_TYPES.includes(input as any);
}

/**
 * @name isProof
 * @description
 * check the `input` is [[Proof]]
 */
export function isProof(input: unknown): input is Proof {
  return (
    isJsonObject(input) &&
    isSignatureType(input.type) &&
    isNumber(input.created) &&
    isDidUrl(input.verificationMethod) &&
    isString(input.proofPurpose) &&
    (isBase58(input.proofValue) || isBase64(input.proofValue) || isBase32(input.proofValue))
  );
}

/**
 * @name isAttesterMapping
 * @description
 * check the `attester` is the same in [[Proof]]
 */
export function isAttesterMapping(issuer: unknown, proof: unknown): boolean {
  if (isProof(proof)) {
    const issuerInProof = parseDid(proof.verificationMethod).did;

    return issuer === issuerInProof;
  } else return false;
}

/**
 * @name isAttesterProof
 * @description
 * check the Proof is qualified or not
 */
export function isAttesterProof(issuer: unknown, proof: unknown): boolean {
  // version 0 & version 1, only one attester and one proof
  if (typeof issuer === 'string' && isArray(proof) && proof.length === 1) {
    return isAttesterMapping(issuer, proof[0]);
  } else if (isArray(issuer) && isArray(proof) && issuer.length === proof.length) {
    const check = issuer.every((issuer, index) => isAttesterMapping(issuer, proof[index]));

    return check;
  } else {
    return false;
  }
}

export function isAttester(value: unknown, version: unknown): boolean {
  if (typeof value === 'string' && (version === '0' || version === '1')) {
    return isDidUrl(value);
  } else if (isArray(value) && value.length !== 0 && version === '2') {
    const check = value.every(isDidUrl);

    return check;
  } else {
    return false;
  }
}

/**
 * @name isRawCredential
 * @description
 * check the `input` is [[RawCredential]]
 */
export function isRawCredential(input: unknown): input is RawCredential {
  return (
    isJsonObject(input) &&
    isHex(input.ctype) &&
    isJsonObject(input.credentialSubject) &&
    isDidUrl(input.holder) &&
    isHashType(input.hasher?.[0]) &&
    isHashType(input.hasher?.[1])
  );
}

/**
 * @name isPrivateVC
 * @description
 * check the `input` is [[VerifiableCredential]] and be public
 */
export function isPrivateVC(input: unknown): input is VerifiableCredential<false> {
  return (
    isJsonObject(input) &&
    isArray(input.credentialSubjectHashes) &&
    isJsonObject(input.credentialSubjectNonceMap) &&
    isVC(input)
  );
}

/**
 * @name isPublicVC
 * @description
 * check the `input` is [[VerifiableCredential]] and be public
 */
export function isPublicVC(input: unknown): input is VerifiableCredential<true> {
  return (
    isJsonObject(input) &&
    !input.credentialSubjectHashes &&
    !input.credentialSubjectNonceMap &&
    isVC(input) &&
    isJsonObject(input.credentialSubject)
  );
}

/**
 * @name isVC
 * @description
 * check the `input` is [[VerifiableCredential]]
 */
export function isVC(input: unknown): input is VerifiableCredential<boolean> {
  return (
    isJsonObject(input) &&
    isArray(input['@context']) &&
    isString(input.version) &&
    isNumber(input.issuanceDate) &&
    (isUndefined(input.expirationDate) || isNull(input.expirationDate) || isNumber(input.expirationDate)) &&
    isAttester(input.issuer, input.version) &&
    isHex(input.digest) &&
    isArray(input.proof) &&
    isAttesterProof(input.issuer, input.proof) &&
    isHex(input.ctype) &&
    (isJsonObject(input.credentialSubject) || isHex(input.credentialSubject)) &&
    isDidUrl(input.holder) &&
    isHashType(input.hasher?.[0]) &&
    isHashType(input.hasher?.[1])
  );
}

/**
 * @name isVP
 * @description
 * check the `input` is [[VerifiablePresentation]]
 */
export function isVP(input: unknown): input is VerifiablePresentation {
  return (
    isJsonObject(input) &&
    isArray(input['@context']) &&
    isArray(input.type) &&
    isArray(input.verifiableCredential) &&
    input.type.length === input.verifiableCredential.length &&
    !input.type.map((type) => isVpType(type)).includes(false) &&
    !input.verifiableCredential.map((vc) => isVC(vc)).includes(false) &&
    isHex(input.id) &&
    isHashType(input.hasher?.[0]) &&
    isProof(input.proof)
  );
}

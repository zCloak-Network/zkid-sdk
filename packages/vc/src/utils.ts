// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { VerificationMethodType } from '@zcloak/did-resolver/types';
import type {
  HashType,
  NativeType,
  NativeTypeWithOutNull,
  Proof,
  RawCredential,
  SignatureType,
  VerifiableCredential,
  VerifiablePresentation,
  VerifiablePresentationType
} from './types';

import { encode, Input } from '@ethereumjs/rlp';
import {
  isArray,
  isHex,
  isJsonObject,
  isNull,
  isNumber,
  isString,
  isUndefined
} from '@polkadot/util';

import { isBase32, isBase58, isBase64 } from '@zcloak/crypto';
import { isDidUrl } from '@zcloak/did/utils';

import { ALL_HASH_TYPES, ALL_SIG_TYPES, ALL_VP_TYPES } from './defaults';
import { HASHER } from './hasher';

export function keyTypeToSignatureType(type: VerificationMethodType): SignatureType {
  switch (type) {
    case 'EcdsaSecp256k1VerificationKey2019':
      return 'EcdsaSecp256k1Signature2019';
    case 'Ed25519VerificationKey2020':
      return 'Ed25519Signature2018';

    default:
      throw new Error(`Can not transform type: ${type}`);
  }
}

export function rlpEncode(
  input: NativeType | NativeTypeWithOutNull[],
  hashType: HashType
): Uint8Array {
  const param: Input =
    typeof input === 'boolean'
      ? Number(input)
      : Array.isArray(input)
      ? (input.map((inp) => (typeof inp === 'boolean' ? Number(inp) : inp)) as (string | number)[])
      : input;

  const result = encode(param);

  if (hashType === 'Rescue') {
    return HASHER.Rescue(result, true);
  } else {
    return HASHER[hashType](result);
  }
}

export function isHashType(input: unknown): input is HashType {
  return ALL_HASH_TYPES.includes(input as any);
}

export function isVpType(input: unknown): input is VerifiablePresentationType {
  return ALL_VP_TYPES.includes(input as any);
}

export function isSignatureType(input: unknown): input is SignatureType {
  return ALL_SIG_TYPES.includes(input as any);
}

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

export function isRawCredential(input: unknown): input is RawCredential {
  return (
    isJsonObject(input) &&
    isHex(input.ctype) &&
    (isHex(input.credentialSubject) || isJsonObject(input.credentialSubject)) &&
    isArray(input.credentialSubjectHashes) &&
    isJsonObject(input.credentialSubjectNonceMap) &&
    isDidUrl(input.holder) &&
    isHashType(input.hasher?.[0]) &&
    isHashType(input.hasher?.[1])
  );
}

export function isVC(input: unknown): input is VerifiableCredential {
  return (
    isJsonObject(input) &&
    isArray(input['@context']) &&
    isString(input.version) &&
    isNumber(input.issuanceDate) &&
    (isUndefined(input.expirationDate) ||
      isNull(input.expirationDate) ||
      isNumber(input.expirationDate)) &&
    isDidUrl(input.issuer) &&
    isHex(input.digest) &&
    isArray(input.proof) &&
    !input.proof.map((p) => isProof(p)).includes(false) &&
    isRawCredential(input)
  );
}

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

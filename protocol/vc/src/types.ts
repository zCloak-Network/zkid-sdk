// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidKeys } from '@zcloak/did/types';
import type { DidUrl, SignatureType } from '@zcloak/did-resolver/types';

export type NativeType = string | number | boolean | null | undefined;

export type NativeTypeWithOutNull = Exclude<NativeType, null | undefined>;

export type AnyJson = Record<string, NativeType | NativeTypeWithOutNull[]>;

export type CredentialSubject = AnyJson | HexString;

// Important NOTE: if you want to add new item, you will also add to [[ALL_HASH_TYPES]], and add function to [[HASHER]] map
export type HashType =
  | 'RescuePrimeOptimized'
  | 'RescuePrime'
  | 'Blake3'
  | 'Blake32to1'
  | 'Blake2'
  | 'Keccak256'
  | 'Keccak512'
  | 'Sha256'
  | 'Sha512';

export type VerifiablePresentationType = 'VP' | 'VP_Digest' | 'VP_SelectiveDisclosure';

export type VerifiableCredentialVersion = '0' | '1' | '2';

export type VerifiablePresentationVersion = '0' | '1';

export interface Proof {
  type: SignatureType;
  created: number;
  verificationMethod: DidUrl;
  proofPurpose: DidKeys;
  proofValue: string;
  challenge?: string;
}

export interface RawCredential {
  ctype: HexString;
  credentialSubject: AnyJson;
  holder: DidUrl;
  hasher: [HashType, HashType];
}

interface PublicVerifiableCredential extends RawCredential {
  '@context': string[];
  version: VerifiableCredentialVersion;
  issuanceDate: number;
  expirationDate?: number;
  issuer: DidUrl[];
  digest: HexString;
  proof: Proof[];
}

interface PrivateVerifiableCredential extends Omit<RawCredential, 'credentialSubject'> {
  '@context': string[];
  version: VerifiableCredentialVersion;
  issuanceDate: number;
  expirationDate?: number;
  issuer: DidUrl[];
  digest: HexString;
  proof: Proof[];
  // when CredentialSubject is HexString, it means [[rootHash]]
  credentialSubject: AnyJson | HexString;
  credentialSubjectHashes: HexString[];
  credentialSubjectNonceMap: Record<HexString, HexString>;
}

export type VerifiableCredential<Public extends boolean> = Public extends false
  ? PrivateVerifiableCredential
  : PublicVerifiableCredential;

export interface VerifiablePresentation {
  '@context': string[];
  version: VerifiablePresentationVersion;
  type: VerifiablePresentationType[];
  verifiableCredential: VerifiableCredential<boolean>[];
  id: HexString;
  proof: Proof;
  hasher: [HashType];
}

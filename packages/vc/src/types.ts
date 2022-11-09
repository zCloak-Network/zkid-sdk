// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidUrl } from '@zcloak/did-resolver/types';

export type AnyJson = Record<string, number | boolean | string | Array<number | boolean | string>>;

// when CredentialSubject is HexString, it means [[rootHash]]
export type CredentialSubject = AnyJson | HexString;

export type HashType = 'Rescue' | 'Blake3' | 'Keccak256' | 'Sha256';

export type SignatureType = 'EcdsaSecp256k1Signature2019' | 'Ed25519Signature2018';

export type ProofType = SignatureType;

export type VerifiablePresentationType = 'VP' | 'VP_Digest' | 'VP_SelectiveDisclosure';

export type ProofPurpose =
  | 'authentication'
  | 'assertionMethod'
  | 'keyAgreement'
  | 'capabilityInvocation'
  | 'capabilityDelegation';

export type VerifiableCredentialVersion = '0';

export type VerifiablePresentationVersion = '0';

export interface Proof {
  type: ProofType;
  created: number;
  verificationMethod: DidUrl;
  proofPurpose: ProofPurpose;
  proofValue: string;
  challenge?: string;
}

export interface RawCredential {
  ctype: HexString;
  credentialSubject: CredentialSubject;
  credentialSubjectHashes: HexString[];
  credentialSubjectNonceMap: Record<HexString, HexString>;
  holder: DidUrl;
  hasher: [HashType, HashType];
}

export interface VerifiableCredential extends RawCredential {
  '@context': string[];
  version: VerifiableCredentialVersion;
  issuanceDate: number;
  expirationDate?: number;
  issuer: DidUrl;
  digest: HexString;
  proof: Proof[];
}

export interface VerifiablePresentation {
  '@context': string[];
  version: VerifiablePresentationVersion;
  type: VerifiablePresentationType[];
  verifiableCredential: VerifiableCredential[];
  id: HexString;
  proof: Proof;
  hasher: [HashType];
}

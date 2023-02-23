// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

export type DidMethod = 'zk';

export type DidUrl = `did:${DidMethod}:${string}`;

export type DidDocumentVersion = '0';

export interface ParsedDid {
  did: DidUrl;
  didUrl: DidUrl;
  method: DidMethod;
  identifier: string;
  path?: string;
  query?: string;
  fragment?: string;
}

export type VerificationMethodType =
  | 'X25519KeyAgreementKey2019'
  | 'EcdsaSecp256k1VerificationKey2019'
  | 'Ed25519VerificationKey2020';

export type SignatureType =
  | 'EcdsaSecp256k1Signature2019'
  | 'EcdsaSecp256k1SignatureEip191'
  | 'Ed25519Signature2018';

export interface VerificationMethod {
  id: DidUrl;
  controller: DidUrl[];
  type: VerificationMethodType;
  publicKeyMultibase: string;
}

export interface Service {
  id: string;
  type: string[];
  serviceEndpoint: string;
}

export interface DidDocumentProof {
  signature: string;
  type: string;
  // since `@zcloak/did-resolver@1.0.0`
  signatureType?: SignatureType;
  id: DidUrl;
}

export interface DidDocument {
  '@context': ['https://www.w3.org/ns/did/v1'];
  // since `@zcloak/did-resolver@1.1.0`
  version?: DidDocumentVersion;
  id: DidUrl;
  controller: DidUrl[];
  verificationMethod?: VerificationMethod[];
  authentication?: DidUrl[];
  assertionMethod?: DidUrl[];
  keyAgreement?: DidUrl[];
  capabilityInvocation?: DidUrl[];
  capabilityDelegation?: DidUrl[];
  service?: Service[];
  creationTime?: number;
  proof?: DidDocumentProof[];
}

export type DidDocumentWithProof = Omit<DidDocument, 'proof'> & { proof: DidDocumentProof[] };

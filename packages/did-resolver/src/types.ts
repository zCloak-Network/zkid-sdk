export type DidMethod = 'zk';

export type DidUrl = `did:${DidMethod}:${string}`;

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
  id: DidUrl;
}

export interface DidDocument {
  '@context': ['https://www.w3.org/ns/did/v1'];
  id: DidUrl;
  controller: DidUrl[];
  verificationMethod?: VerificationMethod[];
  authentication?: DidUrl[];
  assertionMethod?: DidUrl[];
  keyAgreement?: DidUrl[];
  capabilityInvocation?: DidUrl[];
  capabilityDelegation?: DidUrl[];
  service?: Service[];
  createdTime?: number;
  proof?: DidDocumentProof[];
}

export type DidDocumentWithProof = Omit<DidDocument, 'proof'> & { proof: DidDocumentProof[] };

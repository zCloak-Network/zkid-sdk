// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidUrl } from '@zcloak/did-resolver/types';
import type { AnyJson, HashType, Proof } from '../types';
import type { ICredential } from './type';

// todo: rename it to BaseCredential
export abstract class Base implements ICredential {
  // todo: will this hashType be shown in the credential? or it is a hiding field
  // just for configuration?
  public hashType: HashType;

  public context?: string[];
  public ctype?: HexString;
  public issuanceDate?: number;
  public expirationDate?: number;
  public credentialSubject?: AnyJson;
  public issuer?: DidUrl;
  public holder?: DidUrl;
  public digest?: HexString;
  public proof?: Proof;

  constructor(hashType: HashType = 'Keccak256') {
    this.hashType = hashType;
  }

  public setContext(context?: string[]): void {
    this.context = context;
  }

  public setCtype(ctype?: HexString): void {
    this.ctype = ctype;
  }

  // todo: move this to class Credential
  public setIssuanceDate(issuanceDate?: number): void {
    this.issuanceDate = issuanceDate;
  }

  // todo: move this to class Credential
  public setExpirationDate(expirationDate?: number): void {
    this.expirationDate = expirationDate;
  }

  // todo: before setCredential Subject, do the format matching check:
  // the credentialSubject parameter's metadata should match the credential schema.
  public setCredentialSubject(credentialSubject?: AnyJson): void {
    this.credentialSubject = credentialSubject;
  }

  // todo: move this to class Credential
  public setIssuer(issuer?: DidUrl): void {
    this.issuer = issuer;
  }

  // todo: holder check. Do we enable a user to make credential for someone else?
  public setHolder(holder?: DidUrl): void {
    this.holder = holder;
  }

  public setDigest(digest?: HexString): void {
    this.digest = digest;
  }

  public setProof(proof?: Proof): void {
    this.proof = proof;
  }
}

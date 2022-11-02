// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidUrl } from '@zcloak/did-resolver/types';
import type { AnyJson, Proof } from '../types';
import type { ICredential } from './type';

export abstract class Base implements Partial<ICredential> {
  public context?: string[];
  public ctype?: HexString;
  public issuanceDate?: number;
  public expirationDate?: number;
  public credentialSubject?: AnyJson;
  public issuer?: DidUrl;
  public holder?: DidUrl;
  public proof?: Proof;

  public setContext(context: string[]): void {
    this.context = context;
  }

  public setCtype(ctype: HexString): void {
    this.ctype = ctype;
  }

  public setIssuanceDate(issuanceDate: number): void {
    this.issuanceDate = issuanceDate;
  }

  public setExpirationDate(expirationDate: number): void {
    this.expirationDate = expirationDate;
  }

  public setCredentialSubject(credentialSubject: AnyJson): void {
    this.credentialSubject = credentialSubject;
  }

  public setIssuer(issuer: DidUrl): void {
    this.issuer = issuer;
  }

  public setHolder(holder: DidUrl): void {
    this.holder = holder;
  }

  public setProof(proof: Proof): void {
    this.proof = proof;
  }
}

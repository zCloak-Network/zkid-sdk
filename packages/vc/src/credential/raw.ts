// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { CType } from '@zcloak/ctype/types';
import type { DidUrl } from '@zcloak/did-resolver/types';
import type { AnyJson, HashType, RawCredential } from '../types';
import type { IRaw } from './types';

import { assert, isHex } from '@polkadot/util';

import { validateSubject } from '@zcloak/ctype';
import { isDidUrl } from '@zcloak/did/utils';

import { calcRoothash, RootHashResult } from '../rootHash';

/**
 * [[IRaw]] implements
 *
 * @example
 * <BR>
 * ```typescript
 * const raw = new Raw({
 *   contents: {},
 *   hashType: DEFAULT_ROOT_HASH_TYPE,
 *   ctype: '0x...',
 *   owner: 'did:zk:claimer'
 * });
 *
 * raw.calcRootHash();
 * ```
 */
export class Raw implements IRaw {
  public contents: AnyJson;
  public owner: DidUrl;
  public ctype: CType;
  public hashType: HashType;

  public nonceMap?: Record<HexString, HexString>;

  public static fromRawCredential(rawCredential: RawCredential, ctype: CType): Raw {
    assert(!isHex(rawCredential.credentialSubject), 'credentialSubject can not be hex string');
    assert(ctype.$id === rawCredential.ctype, '`ctype` is not the raw credential ctype');

    return new Raw({
      contents: rawCredential.credentialSubject,
      owner: rawCredential.holder,
      ctype,
      hashType: rawCredential.hasher[0],
      nonceMap: rawCredential.credentialSubjectNonceMap
    });
  }

  constructor(raw: IRaw) {
    this.contents = raw.contents;
    this.owner = raw.owner;
    this.ctype = raw.ctype;
    this.hashType = raw.hashType;
  }

  /**
   * set `contents` attributes
   */
  public setContents(contents: AnyJson): this {
    this.contents = contents;

    return this;
  }

  /**
   * set `owner` attributes
   */
  public setOwner(owner: DidUrl): this {
    assert(isDidUrl(owner), `${owner} is not a did`);
    this.owner = owner;

    return this;
  }

  /**
   * set `ctype` attributes
   */
  public setCtype(ctype: CType): this {
    this.ctype = ctype;

    return this;
  }

  /**
   * set `hashType` attributes
   */
  public setHashType(hashType: HashType): this {
    this.hashType = hashType;

    return this;
  }

  /**
   * calc rootHash, use `this.nonceMap` if exists.
   * 1. check the subject is valid
   * 2. calc `rootHash` use nonceMap
   */
  public calcRootHash(): RootHashResult {
    assert(this.checkSubject(), `Subject check failed when use ctype ${this.ctype}`);

    return calcRoothash(this.contents, this.hashType, this.nonceMap);
  }

  /**
   * check the `contents` is valid by ctype
   * @returns `true` or `false`
   */
  public checkSubject(): boolean {
    return validateSubject(this.ctype, this.contents).valid;
  }

  public toRawCredential(digestHashType: HashType = 'Keccak256'): RawCredential {
    const { hashes, nonceMap } = this.calcRootHash();

    return {
      ctype: this.ctype.$id,
      credentialSubject: this.contents,
      credentialSubjectHashes: hashes,
      credentialSubjectNonceMap: nonceMap,
      holder: this.owner,
      hasher: [this.hashType, digestHashType]
    };
  }
}

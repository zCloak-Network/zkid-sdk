// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidUrl } from '@zcloak/did-resolver/types';
import type { AnyJson, HashType } from '../types';
import type { ISubject } from './types';

import { assert } from '@polkadot/util';

import { isDidUrl } from '@zcloak/did/utils';

import { calcRoothash } from '../rootHash';

/**
 * [[ISubject]] implements
 *
 * @example
 * <BR>
 * ```typescript
 * const subject = new Subject({
 *   contents: {},
 *   hashType: DEFAULT_ROOT_HASH_TYPE,
 *   ctype: '0x...',
 *   owner: 'did:zk:claimer'
 * });
 *
 * subject.calcRootHash();
 * ```
 */
export class Subject implements ISubject {
  public contents: AnyJson;
  public owner: DidUrl;
  public ctype: HexString;
  public hashType: HashType;

  public rootHash?: HexString;
  public hashes?: HexString[];
  public nonceMap?: Record<HexString, HexString>;

  constructor(subject: ISubject) {
    this.contents = subject.contents;
    this.owner = subject.owner;
    this.ctype = subject.ctype;
    this.hashType = subject.hashType;

    this.rootHash = subject.rootHash;
    this.hashes = subject.hashes;
    this.nonceMap = subject.nonceMap;
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
  public setCtype(ctype: HexString): this {
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
   * calc rootHash, if the `hashes`, `nonceMap` and `rootHash` attributes is `undefined`, it will calc new rootHash
   * or others, it will reCalc `rootHash`
   * 1. check `hashes`, `nonceMap` and `rootHash` is exists
   * 2. if exists, will check isValid, if check result is `true`, do nothing, else calc a new rootHash
   */
  public calcRootHash(): this {
    assert(this.checkSubject(), `Subject check failed when use ctype ${this.ctype}`);

    let doCalc = true;

    if (this.hashes && this.nonceMap && this.rootHash) {
      doCalc = !this.checkRootHash();
    }

    if (doCalc) {
      const { hashes, nonceMap, rootHash } = calcRoothash(this.contents, this.hashType);

      this.hashes = hashes;
      this.nonceMap = nonceMap;
      this.rootHash = rootHash;
    }

    return this;
  }

  /**
   * 1. call `this.checkSubject`
   * 2. call `this.checkRootHash`
   * @returns `true` or `false`
   */
  public check(): boolean {
    return this.checkSubject() && this.checkRootHash();
  }

  /**
   * check the `contents` is valid by ctype
   * @returns `true` or `false`
   */
  public checkSubject(): boolean {
    // TODO check the subject is valid by ctype

    return true;
  }

  /**
   * check the rootHash is valid
   * @returns `true` or `false`
   */
  public checkRootHash(): boolean {
    // TODO check rootHash is valid

    return true;
  }
}

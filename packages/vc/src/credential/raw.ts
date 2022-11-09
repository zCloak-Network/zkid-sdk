// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@zcloak/crypto/types';
import type { DidUrl } from '@zcloak/did-resolver/types';
import type { AnyJson, HashType, RawCredential } from '../types';
import type { IRaw } from './types';

import { assert, isHex } from '@polkadot/util';

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
  public ctype: HexString;
  public hashType: HashType;

  public rootHash?: HexString;
  public hashes?: HexString[];
  public nonceMap?: Record<HexString, HexString>;

  public static fromRawCredential(rawCredential: RawCredential): Raw {
    assert(!isHex(rawCredential.credentialSubject), 'credentialSubject can not be hex string');

    return new Raw({
      contents: rawCredential.credentialSubject,
      owner: rawCredential.holder,
      ctype: rawCredential.ctype,
      hashType: rawCredential.hasher[0]
    });
  }

  constructor(raw: IRaw) {
    this.contents = raw.contents;
    this.owner = raw.owner;
    this.ctype = raw.ctype;
    this.hashType = raw.hashType;

    this.rootHash = raw.rootHash;
    this.hashes = raw.hashes;
    this.nonceMap = raw.nonceMap;
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
  public calcRootHash(): RootHashResult {
    assert(this.checkSubject(), `Subject check failed when use ctype ${this.ctype}`);

    if (this.hashes && this.nonceMap && this.rootHash && this.checkRootHash()) {
      return {
        hashes: this.hashes,
        nonceMap: this.nonceMap,
        rootHash: this.rootHash,
        type: this.hashType
      };
    } else {
      const { hashes, nonceMap, rootHash, type } = calcRoothash(this.contents, this.hashType);

      this.hashes = hashes;
      this.nonceMap = nonceMap;
      this.rootHash = rootHash;

      return { hashes, nonceMap, rootHash, type };
    }
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

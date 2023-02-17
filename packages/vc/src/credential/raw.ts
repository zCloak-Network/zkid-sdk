// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CType } from '@zcloak/ctype/types';
import type { DidUrl } from '@zcloak/did-resolver/types';
import type { AnyJson, HashType, RawCredential } from '../types';
import type { IRaw } from './types';

import { assert } from '@polkadot/util';

import { validateSubject } from '@zcloak/ctype';
import { isDidUrl } from '@zcloak/did/utils';

import { DEFAULT_DIGEST_HASH_TYPE } from '../defaults';
import { isRawCredential } from '../is';

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

  public static fromRawCredential(rawCredential: RawCredential, ctype: CType): Raw {
    assert(isRawCredential(rawCredential), 'input is not a RawCredential object');
    assert(ctype.$id === rawCredential.ctype, '`ctype` is not the raw credential ctype');

    return new Raw({
      contents: rawCredential.credentialSubject,
      owner: rawCredential.holder,
      ctype,
      hashType: rawCredential.hasher[0]
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
   * check the `contents` is valid by ctype
   * @returns `true` or `false`
   */
  public checkSubject(): boolean {
    return validateSubject(this.ctype, this.contents).valid;
  }

  public toRawCredential(digestHashType: HashType = DEFAULT_DIGEST_HASH_TYPE): RawCredential {
    assert(this.checkSubject(), `Subject check failed when use ctype ${this.ctype}`);

    return {
      ctype: this.ctype.$id,
      credentialSubject: this.contents,
      holder: this.owner,
      hasher: [this.hashType, digestHashType]
    };
  }
}

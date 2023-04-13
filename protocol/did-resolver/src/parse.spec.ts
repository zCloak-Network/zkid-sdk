// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParsedDid } from './types';

import { parseDid } from './parseDid';

const DID_URI = 'did:zk:0x082d674c00e27fBaAAE123a85f5024A1DD702e51';
const DID_URI_WITH_PATH = `${DID_URI}/profile`;
const DID_URI_WITH_QUERY = `${DID_URI}?name=zcloak`;
const DID_URI_WITH_FRAGMENT = `${DID_URI}#key-0`;
const DID_WHOLE_URL = `${DID_URI}/profile?name=zcloak#key-0`;

describe('parse did url', (): void => {
  it('parse did only Uri', (): void => {
    const parsed: ParsedDid = parseDid(DID_URI);

    expect(parsed.did).toEqual(DID_URI);
    expect(parsed.method).toEqual('zk');
  });

  it('parse did with path', (): void => {
    const parsed: ParsedDid = parseDid(DID_URI_WITH_PATH);

    expect(parsed.did).toEqual(DID_URI);
    expect(parsed.method).toEqual('zk');
    expect(parsed.path).toEqual('/profile');
  });

  it('parse did with query', (): void => {
    const parsed: ParsedDid = parseDid(DID_URI_WITH_QUERY);

    expect(parsed.did).toEqual(DID_URI);
    expect(parsed.method).toEqual('zk');
    expect(parsed.query).toEqual('name=zcloak');
  });

  it('parse did with fragment', (): void => {
    const parsed: ParsedDid = parseDid(DID_URI_WITH_FRAGMENT);

    expect(parsed.did).toEqual(DID_URI);
    expect(parsed.method).toEqual('zk');
    expect(parsed.fragment).toEqual('key-0');
  });

  it('parse a whole did', (): void => {
    const parsed: ParsedDid = parseDid(DID_WHOLE_URL);

    expect(parsed.did).toEqual(DID_URI);
    expect(parsed.method).toEqual('zk');
    expect(parsed.path).toEqual('/profile');
    expect(parsed.query).toEqual('name=zcloak');
    expect(parsed.fragment).toEqual('key-0');
  });
});

// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from './types';

import { ethereumEncode, signatureVerify } from '@polkadot/util-crypto';

import { u8aToU8a } from '@zcloak/util';

export function verifySignature(
  message: HexString | Uint8Array | string,
  signature: HexString | Uint8Array | string,
  addressOrPublicKey: HexString | Uint8Array | string
) {
  const publicKeyU8a = u8aToU8a(addressOrPublicKey);

  return signatureVerify(
    message,
    signature,
    // check is ethereum publicKey or address
    [20, 33, 65].includes(publicKeyU8a.length) ? ethereumEncode(publicKeyU8a) : publicKeyU8a
  );
}

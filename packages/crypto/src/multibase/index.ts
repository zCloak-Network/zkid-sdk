// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { base32Decode, isBase32 } from './bs32';
import { base58Decode, isBase58 } from './bs58';
import { base64Decode, isBase64 } from './bs64';

export * from './bs32';
export * from './bs58';
export * from './bs64';

export function decodeMultibase(multibase: string): Uint8Array {
  if (isBase58(multibase)) {
    return base58Decode(multibase);
  } else if (isBase32(multibase)) {
    return base32Decode(multibase);
  } else if (isBase64(multibase)) {
    return base64Decode(multibase);
  } else {
    throw new Error(`Decode ${multibase} error, only support base58, base32, base64`);
  }
}

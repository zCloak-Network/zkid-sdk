// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { VerificationMethodType } from '@zcloak/did-resolver/types';
import type { HashType, NativeType, SignatureType } from './types';

import { encode } from '@ethereumjs/rlp';

import { HASHER } from './hasher';

export function keyTypeToSignatureType(type: VerificationMethodType): SignatureType {
  switch (type) {
    case 'EcdsaSecp256k1VerificationKey2019':
      return 'EcdsaSecp256k1Signature2019';
    case 'Ed25519VerificationKey2020':
      return 'Ed25519Signature2018';

    default:
      throw new Error(`Can not transform type: ${type}`);
  }
}

export function rlpEncode(input: NativeType | string[], hashType: HashType): Uint8Array {
  const result = encode(typeof input === 'boolean' ? Number(input) : input);

  if (hashType === 'Rescue') {
    return HASHER.Rescue(result, true);
  } else {
    return HASHER[hashType](result);
  }
}

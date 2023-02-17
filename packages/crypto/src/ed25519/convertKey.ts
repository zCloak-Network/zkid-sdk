// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { assertReturn } from '@polkadot/util';
import ed2curve from 'ed2curve';

export function convertSecretKeyToCurve25519(secretKey: Uint8Array): Uint8Array {
  return ed2curve.convertSecretKey(secretKey);
}

export function convertPublicKeyToCurve25519(publicKey: Uint8Array): Uint8Array {
  return assertReturn(
    ed2curve.convertPublicKey(publicKey),
    'Unable to convert publicKey to ed25519'
  );
}

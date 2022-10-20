import type { HexString } from './types';

import { u8aToU8a } from '@polkadot/util';
import { ethereumEncode, signatureVerify } from '@polkadot/util-crypto';

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

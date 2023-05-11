// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { hexToU8a } from '@polkadot/util';

import { rlpEncode } from '@zcloak/crypto';
import { VerifiableCredential } from '@zcloak/vc/types';

import { makeMerkleTree } from './rootHash';

// Indexes represent which leaf need to be parsed, and calculate in the VM
// Here, [1,2,3,4,5] means 5 leaves need to be parsed.
// const indexes = [2];
// const result = toMidenInput(data, indexes);

// console.log('The parsing result is :', result);

/**
 * @name toMidenInput
 * @description
 * parse [[VerifiableCredential]] to miden input param
 */
export function toMidenInput(data: VerifiableCredential<false>, leaves: number[]): string {
  const hashType = data.hasher[0];
  const contents = data.credentialSubject;

  const claimNonceMap = data.credentialSubjectNonceMap;
  const nonces = Object.values(claimNonceMap);
  const contentsData = Object.values(contents);

  const contentData = contentsData.map((c) => {
    const encoded = Array.from(rlpEncode(c));

    if (encoded.length < 8 || encoded.length % 4 !== 0) {
      encoded.push(1);
    }

    while (encoded.length < 8 || encoded.length % 4 !== 0) {
      encoded.push(0);
    }

    return encoded;
  }); // ContentData - RLP code

  const merkleTree = makeMerkleTree(data.credentialSubjectHashes, hashType);

  // First input，the rlp code of the element
  // Sec input, the uuid of the element
  const rootHash = merkleTree.getRoot();

  let finaResult = new BigUint64Array(rootHash.buffer).toString();

  for (let i = 0; i < leaves.length; i++) {
    const k = leaves[i];

    finaResult = finaResult.concat(',', contentData[k].toString());
    const nonce = new BigUint64Array(hexToU8a(nonces[k]).buffer);

    finaResult = finaResult.concat(',', nonce.toString());

    // and the corresponding authpath
    const authPath = merkleTree.getProof(data.credentialSubjectHashes[k]);

    if (!authPath) throw new Error(`Can not find proof: ${nonces[k]}`);

    for (const element of authPath) {
      const perAuthNodeU64vec = new BigUint64Array(element.data.buffer);

      finaResult = finaResult.concat(',', perAuthNodeU64vec.toString());
    }
  }

  return finaResult;
}

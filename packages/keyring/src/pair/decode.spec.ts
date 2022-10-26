// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  ed25519PairFromSeed,
  randomAsU8a,
  secp256k1PairFromSeed,
  x25519PairFromSeed
} from '@zcloak/crypto';

import { decodePair } from './decode';
import { encodePair } from './encode';

describe('decode', (): void => {
  describe('decode with pass', (): void => {
    it('encode secp256k1Pair and decode without error', (): void => {
      const keypair = secp256k1PairFromSeed(randomAsU8a(32));
      const PASS = 'password';

      const encoded = encodePair(keypair, PASS);
      const decoded = decodePair(encoded, PASS);

      expect(decoded.secretKey).toEqual(keypair.secretKey);
      expect(decoded.publicKey).toEqual(keypair.publicKey);
    });

    it('encode ed25519Pair and decode without error', (): void => {
      const keypair = ed25519PairFromSeed(randomAsU8a(32));
      const PASS = 'password';

      const encoded = encodePair(keypair, PASS);
      const decoded = decodePair(encoded, PASS);

      expect(decoded.secretKey).toEqual(keypair.secretKey);
      expect(decoded.publicKey).toEqual(keypair.publicKey);
    });

    it('encode x25519Pair and decode without error', (): void => {
      const keypair = x25519PairFromSeed(randomAsU8a(32));
      const PASS = 'password';

      const encoded = encodePair(keypair, PASS);
      const decoded = decodePair(encoded, PASS);

      expect(decoded.secretKey).toEqual(keypair.secretKey);
      expect(decoded.publicKey).toEqual(keypair.publicKey);
    });
  });

  describe('decode without pass', (): void => {
    it('encode secp256k1Pair and decode without error', (): void => {
      const keypair = secp256k1PairFromSeed(randomAsU8a(32));

      const encoded = encodePair(keypair);
      const decoded = decodePair(encoded);

      expect(decoded.secretKey).toEqual(keypair.secretKey);
      expect(decoded.publicKey).toEqual(keypair.publicKey);
    });

    it('encode ed25519Pair and decode without error', (): void => {
      const keypair = ed25519PairFromSeed(randomAsU8a(32));

      const encoded = encodePair(keypair);
      const decoded = decodePair(encoded);

      expect(decoded.secretKey).toEqual(keypair.secretKey);
      expect(decoded.publicKey).toEqual(keypair.publicKey);
    });

    it('encode x25519Pair and decode without error', (): void => {
      const keypair = x25519PairFromSeed(randomAsU8a(32));

      const encoded = encodePair(keypair);
      const decoded = decodePair(encoded);

      expect(decoded.secretKey).toEqual(keypair.secretKey);
      expect(decoded.publicKey).toEqual(keypair.publicKey);
    });
  });
});

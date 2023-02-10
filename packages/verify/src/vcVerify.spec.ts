// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DidDocument } from '@zcloak/did-resolver/types';
import type { AnyJson, VerifiableCredential } from '@zcloak/vc/types';

import { initCrypto } from '@zcloak/crypto';
import { calcRoothash } from '@zcloak/vc';

import { vcVerify, vcVerifyDigest } from './vcVerify';

const document1: DidDocument = {
  '@context': ['https://www.w3.org/ns/did/v1'],
  id: 'did:zk:0xf02AC70b695b3211813a207d937719D22BeC04a7',
  controller: ['did:zk:0xf02AC70b695b3211813a207d937719D22BeC04a7'],
  verificationMethod: [
    {
      id: 'did:zk:0xf02AC70b695b3211813a207d937719D22BeC04a7#key-0',
      controller: ['did:zk:0xf02AC70b695b3211813a207d937719D22BeC04a7'],
      type: 'EcdsaSecp256k1VerificationKey2019',
      publicKeyMultibase: 'zsRU9M9TJWfn7bEKTCYANQsAeiYbNtHG5S4HXVvRGuecv'
    },
    {
      id: 'did:zk:0xf02AC70b695b3211813a207d937719D22BeC04a7#key-1',
      controller: ['did:zk:0xf02AC70b695b3211813a207d937719D22BeC04a7'],
      type: 'X25519KeyAgreementKey2019',
      publicKeyMultibase: 'z4NyBpo8njhmogon8uZTtPEihYSp2nLndNQbdUPYtFA9w'
    }
  ],
  authentication: ['did:zk:0xf02AC70b695b3211813a207d937719D22BeC04a7#key-0'],
  assertionMethod: ['did:zk:0xf02AC70b695b3211813a207d937719D22BeC04a7#key-0'],
  keyAgreement: ['did:zk:0xf02AC70b695b3211813a207d937719D22BeC04a7#key-1'],
  capabilityInvocation: ['did:zk:0xf02AC70b695b3211813a207d937719D22BeC04a7#key-0'],
  capabilityDelegation: ['did:zk:0xf02AC70b695b3211813a207d937719D22BeC04a7#key-0'],
  service: []
};

const document2: DidDocument = {
  '@context': ['https://www.w3.org/ns/did/v1'],
  id: 'did:zk:0x565ee4a279Ad611010DF17082220987CcaD381fb',
  controller: ['did:zk:0x565ee4a279Ad611010DF17082220987CcaD381fb'],
  verificationMethod: [
    {
      id: 'did:zk:0x565ee4a279Ad611010DF17082220987CcaD381fb#key-0',
      controller: ['did:zk:0x565ee4a279Ad611010DF17082220987CcaD381fb'],
      type: 'EcdsaSecp256k1VerificationKey2019',
      publicKeyMultibase: 'zykFaxPidYRS6FgXXu3VQRN9ZEHz91NjqKbSzF3Pz5yV6'
    },
    {
      id: 'did:zk:0x565ee4a279Ad611010DF17082220987CcaD381fb#key-1',
      controller: ['did:zk:0x565ee4a279Ad611010DF17082220987CcaD381fb'],
      type: 'X25519KeyAgreementKey2019',
      publicKeyMultibase: 'zBjVjVTTTMWyi1MHxcaAQM2oVGV5rMSQMemgDXCWbjnQs'
    }
  ],
  authentication: ['did:zk:0x565ee4a279Ad611010DF17082220987CcaD381fb#key-0'],
  assertionMethod: ['did:zk:0x565ee4a279Ad611010DF17082220987CcaD381fb#key-0'],
  keyAgreement: ['did:zk:0x565ee4a279Ad611010DF17082220987CcaD381fb#key-1'],
  capabilityInvocation: ['did:zk:0x565ee4a279Ad611010DF17082220987CcaD381fb#key-0'],
  capabilityDelegation: ['did:zk:0x565ee4a279Ad611010DF17082220987CcaD381fb#key-0'],
  service: []
};

const fullVC: VerifiableCredential<false> = {
  '@context': ['https://www.w3.org/2018/credentials/v1'],
  version: '0',
  ctype: '0xc79824e312467b9d38f5448aef37791ac9d45e5c66267eb19f327005a45fb3d4',
  issuanceDate: 1668362860149,
  credentialSubject: {
    name: 'zCloak',
    age: 1,
    birthday: 1668362860149,
    links: ['https://zcloak.network', 'https://zkid.app']
  },
  credentialSubjectNonceMap: {
    '0x88af5a7ba28c1de54ebd589dea81d30caa3f467646f6d714c0d2604599d63e1e':
      '0xb5c9ca01565bb3b0a81b846a0cd32095e48e61fa13ae0bf5ef68666d2b39fb52',
    '0x6bc2ebdc9345c21f804ef735209993cb8e5b3755af0650c41aa164a9faf674bd':
      '0x70c2201247382a5896533e4df4b62e90ef1c56def63ad927e81266b6d5365817',
    '0x95287a551283a931614166c5698c28e437f1e0c734b2a31d652aca0d4d8a7bc1':
      '0x1aec028b67166967b9f8341376671f6d197ba9f7e34b07df904b5947dfd21b1a',
    '0x116ad0bc048d66633b9f5be46d715f32978a31dd83935a13f1a859b82099f9d4':
      '0xb06bd71a7e17fb019d2eed7f3f0c81f8c16f7098215250bd8f2f2832b2ad53ce'
  },
  credentialSubjectHashes: [
    '0x7c50940e02707b8ec244379dbdb5ca9de0dc725ce71a9325dd4a81d7f3cc0e0b',
    '0x928901c5e6ce37f97184299089c446dd5fa2817bf1cbd7237cb4449ead9986dd',
    '0x35dc57dfbb72ce0ff49c2dff190ad49156bd37b97a84c81791518522cf311caf',
    '0xcbdfd21263dcc1739b42aedf703fbb3038bb06b4afd8e3dd8872c05d7f663e9e'
  ],
  issuer: 'did:zk:0xf02AC70b695b3211813a207d937719D22BeC04a7',
  holder: 'did:zk:0xC68B9B2250Cbb10e08CABCaDEF2383e76b4e4b59',
  hasher: ['RescuePrime', 'Keccak256'],
  digest: '0x01f28d1bc9860880ab068bf10d2fb389f2080b6ba9a37bea693051027ef9525f',
  proof: [
    {
      type: 'EcdsaSecp256k1Signature2019',
      created: 1668362860153,
      verificationMethod: 'did:zk:0xf02AC70b695b3211813a207d937719D22BeC04a7#key-0',
      proofPurpose: 'assertionMethod',
      proofValue:
        'z27SZMWaWxSrVC3GCB4YNMy63TkdFjUUeJ2aKsQGorK9Btt4v4yDU3HRZySGUL9rCP2r3DBa3nDNQyxW2L1pyYy13W'
    }
  ]
};

const vcWithExpiration: VerifiableCredential<false> = {
  '@context': ['https://www.w3.org/2018/credentials/v1'],
  version: '0',
  ctype: '0xa69ef32aabc84331421bc553ec5b85b6bee54789985b66c679ad68db5d69bb6a',
  issuanceDate: 1668362768974,
  credentialSubject: {
    name: 'zCloak',
    age: 1,
    birthday: 1668362768974,
    links: ['https://zcloak.network', 'https://zkid.app']
  },
  credentialSubjectNonceMap: {
    '0x88af5a7ba28c1de54ebd589dea81d30caa3f467646f6d714c0d2604599d63e1e':
      '0xbc578bedb386eb9967ebc757f1b41623232d392f3ffb77bec5f5c20d90932111',
    '0x6bc2ebdc9345c21f804ef735209993cb8e5b3755af0650c41aa164a9faf674bd':
      '0x3c79951e8af409db8e716c4ae9ef2de24fb1d53b4e3a3eff15c1a8a20066f1e2',
    '0x788b6723ee6570f774188c4e7765c425a82e83439b690e009fc8cacc06790e05':
      '0xb2fd6f3580b2283a7d7cf9277b4adef087beff23815d783bded8cf9276eab14c',
    '0x116ad0bc048d66633b9f5be46d715f32978a31dd83935a13f1a859b82099f9d4':
      '0x8c584d0a3e05740257dbf4a5d008283e6438f291382f706d24ab7f23a6d73504'
  },
  credentialSubjectHashes: [
    '0x3599f44bce81f54bb5fdfcf8292bf36ce8e94e002fe5a2d7323129fe50b7879a',
    '0xcb680c9cb52bae0abb440861dc9ab9687fc966dba9b02f5f37c612f9b99113b9',
    '0x12a2896d4d2541bc1ed3d3aa9a4f223d9f2a77a6a62bd7c409d0d2fc590f84e8',
    '0x52db0b0477d1f654349df3e35bb6bd92f8f5cb05f3cedf27ae3bc4063ad7e6fd'
  ],
  issuer: 'did:zk:0x565ee4a279Ad611010DF17082220987CcaD381fb',
  holder: 'did:zk:0xbBf6b56C5606Ce2D24dec5BbbD11442c6E03ca3F',
  hasher: ['RescuePrime', 'Keccak256'],
  digest: '0x523fa24c9e82018b19ae004ebb5b07a66b762bf05ddc4a35177f56635d35eb44',
  proof: [
    {
      type: 'EcdsaSecp256k1Signature2019',
      created: 1668362768979,
      verificationMethod: 'did:zk:0x565ee4a279Ad611010DF17082220987CcaD381fb#key-0',
      proofPurpose: 'assertionMethod',
      proofValue:
        'zx4yCEGm6tbZ7bDVLkZor5UrmSDjbLdL1YCVbYfteA4bwi5ZsdpW5CZHtFgvMiukWSpfQpXyjvrfaa9wZ7k2k1tHd'
    }
  ],
  expirationDate: 1668362768974
};

describe('vc verify', (): void => {
  beforeAll(async (): Promise<void> => {
    await initCrypto();
  });

  describe('verify vc with full text presentation', (): void => {
    it('vc verify without expiration', async (): Promise<void> => {
      expect(await vcVerify(fullVC, document1)).toBe(true);
    });

    it('vc verify with expiration', async (): Promise<void> => {
      // it is expirate
      expect(await vcVerify(vcWithExpiration, document2)).toBe(false);
    });

    it('vc verify with expiration and falsify expirationDate', async (): Promise<void> => {
      expect(
        await vcVerify({ ...vcWithExpiration, expirationDate: Date.now() + 1000000000 }, document2)
      ).toBe(false);
    });

    it('vc verify without expiration and falsify subject', async (): Promise<void> => {
      const result = await vcVerify(
        {
          ...fullVC,
          credentialSubject: {
            ...(fullVC.credentialSubject as any),
            age: 2
          }
        },
        document1
      );

      expect(result).toBe(false);
    });

    it('vc verify without expiration and falsify subject and nonceMap', async (): Promise<void> => {
      const result = await vcVerify(
        {
          ...fullVC,
          credentialSubject: {
            ...(fullVC.credentialSubject as any),
            age: 2
          },
          credentialSubjectNonceMap: {
            ...fullVC.credentialSubjectNonceMap,
            '0xc5b86cb506f55de9f74165340d5cd7dc3ee82639f7e2cb100dfc39d4dc78d8b4':
              '0x70c2201247382a5896533e4df4b62e90ef1c56def63ad927e81266b6d5365817'
          }
        },
        document1
      );

      expect(result).toBe(false);
    });

    it('vc verify without expiration and falsify hashes', async (): Promise<void> => {
      const result = await vcVerify(
        {
          ...fullVC,
          credentialSubjectHashes: vcWithExpiration.credentialSubjectHashes
        },
        document1
      );

      expect(result).toBe(false);
    });

    it('vc verify without expiration and falsify hashes and nonceMap', async (): Promise<void> => {
      const result = await vcVerify(
        {
          ...fullVC,
          credentialSubjectHashes: vcWithExpiration.credentialSubjectHashes,
          credentialSubjectNonceMap: vcWithExpiration.credentialSubjectNonceMap
        },
        document1
      );

      expect(result).toBe(false);
    });
  });

  describe('verify vc with selective disclosure', (): void => {
    it('vc verify without expiration', async (): Promise<void> => {
      expect(
        await vcVerify(
          {
            ...fullVC,
            credentialSubject: {
              name: 'zCloak',
              birthday: 1668362860149
            },
            credentialSubjectNonceMap: {
              '0x88af5a7ba28c1de54ebd589dea81d30caa3f467646f6d714c0d2604599d63e1e':
                '0xb5c9ca01565bb3b0a81b846a0cd32095e48e61fa13ae0bf5ef68666d2b39fb52',
              '0x95287a551283a931614166c5698c28e437f1e0c734b2a31d652aca0d4d8a7bc1':
                '0x1aec028b67166967b9f8341376671f6d197ba9f7e34b07df904b5947dfd21b1a'
            }
          },
          document1
        )
      ).toBe(true);
    });
  });

  describe('verify vc with digest', (): void => {
    it('vc verify without expiration', async (): Promise<void> => {
      expect(
        await vcVerifyDigest(
          {
            ...fullVC,
            credentialSubject: calcRoothash(
              fullVC.credentialSubject as AnyJson,
              fullVC.hasher[0],
              fullVC.credentialSubjectNonceMap || {}
            ).rootHash,
            credentialSubjectNonceMap: {},
            credentialSubjectHashes: []
          },
          document1
        )
      ).toBe(true);
    });
  });
});

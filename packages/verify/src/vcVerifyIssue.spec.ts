// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DidDocument } from '@zcloak/did-resolver/types';
import type { VerifiableCredential } from '@zcloak/vc/types';
import { alice } from 'test-support';

import { initCrypto } from '@zcloak/crypto';

import { addProof } from './vcVerifyIssue';
import { vcVerify } from './vcVerify';

const document3: DidDocument = {
    '@context': ['https://www.w3.org/ns/did/v1'],
    version: '0',
    id: 'did:zk:0x57E7b664aaa7C895878DdCa5790526B9659350Ec',
    controller: ['did:zk:0x57E7b664aaa7C895878DdCa5790526B9659350Ec'],
    verificationMethod: [
        {
            id: 'did:zk:0x57E7b664aaa7C895878DdCa5790526B9659350Ec#key-0',
            controller: ['did:zk:0x57E7b664aaa7C895878DdCa5790526B9659350Ec'],
            type: 'EcdsaSecp256k1VerificationKey2019',
            publicKeyMultibase: 'zupS5XUoHqKsBUHMAYqFNtUdzwNw7X3ML77Sh4CGUHNpx'
        },
        {
            id: 'did:zk:0x57E7b664aaa7C895878DdCa5790526B9659350Ec#key-1',
            controller: ['did:zk:0x57E7b664aaa7C895878DdCa5790526B9659350Ec'],
            type: 'X25519KeyAgreementKey2019',
            publicKeyMultibase: 'zCGHvcFKtP4pDzoTXWG7wLvT6fNRKMUUbmW8QuX8EQCVh'
        }
    ],
    authentication: ['did:zk:0x57E7b664aaa7C895878DdCa5790526B9659350Ec#key-0'],
    assertionMethod: ['did:zk:0x57E7b664aaa7C895878DdCa5790526B9659350Ec#key-0'],
    keyAgreement: ['did:zk:0x57E7b664aaa7C895878DdCa5790526B9659350Ec#key-1'],
    capabilityInvocation: ['did:zk:0x57E7b664aaa7C895878DdCa5790526B9659350Ec#key-0'],
    capabilityDelegation: ['did:zk:0x57E7b664aaa7C895878DdCa5790526B9659350Ec#key-0'],
    service: []
};

const fullVC2: VerifiableCredential<false> = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    version: '2',
    ctype: '0xc08734bbd035fe0880ba6e469e40b160601a2389d0284f6255a5f0b395d2336c',
    issuanceDate: 1693299183644,
    credentialSubject: { name: 'zCloak', age: 19, birthday: '2022.10.31', isUser: true },
    issuer: ['did:zk:0x57E7b664aaa7C895878DdCa5790526B9659350Ec'],
    holder: 'did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1',
    hasher: ['RescuePrime', 'Keccak256'],
    digest: '0x115ab0958eca52ee2ef511a67079b419b8d57224f6457ded3ad117a2354e207a',
    proof: [
        {
            type: 'EcdsaSecp256k1SignatureEip191',
            created: 1693299183648,
            verificationMethod: 'did:zk:0x57E7b664aaa7C895878DdCa5790526B9659350Ec#key-0',
            proofPurpose: 'assertionMethod',
            proofValue: 'zJDsreYR36X2T1WggKwhRebve3PrzLpbSFmTCYz5mCV1DXbcQeDKqeE7eVxDKErAMe7GCuvpqxbpR6gdAb3F2d4hsu'
        }
    ],
    credentialSubjectHashes: [
        '0xe2cc46a455caf6b78393d6b3a2fdf455f5542266f29fb3042a1e840cc2b86427',
        '0xa0ea71dfa268c4277e455acd6a8a0b086c907f3caad43678e62ce9c0cf7bc0e8',
        '0xb129e4db1e188ba554c295e5aa93ab0d0ade297e5cb4b710cee3ce1af4dc1c4a',
        '0x6fe5621dc7ebaf818c6dae3afdada35a74676be85cbde5b4f9b074c76490a92d'
    ],
    credentialSubjectNonceMap: {
        '0x88af5a7ba28c1de54ebd589dea81d30caa3f467646f6d714c0d2604599d63e1e': '0x385e28cb8bcf5fdbd9011da8338d8a8852dabe5e441ab90676db5c4bf6957642',
        '0x9ad57aefa90d9473f855c14221f330fe959a554b3d86c9d701db11c7559ce107': '0x8f2924d768a2769bd65db828baa15a806627d808d379a16cd209de97736a6e10',
        '0x2d2367a578506f669cfd4a744c08fd45315ad4ea3d248733957947cf00723662': '0x85320040fcd44f06281535081364b4c5674ca946ae23e6a155ea0231e0cd1c39',
        '0x6bc2ebdc9345c21f804ef735209993cb8e5b3755af0650c41aa164a9faf674bd': '0x7450de9f08aca5030b3ddfd91de2416592951d4f2d3b76c7277b6d0c5debb236'
    }
};

const fullVC3: VerifiableCredential<false> = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    version: '2',
    ctype: '0xc08734bbd035fe0880ba6e469e40b160601a2389d0284f6255a5f0b395d2336c',
    issuanceDate: 1693299329782,
    credentialSubject: { name: 'zCloak', age: 19, birthday: '2022.10.31', isUser: true },
    issuer: ['did:zk:0x57E7b664aaa7C895878DdCa5790526B9659350Ec'],
    holder: 'did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1',
    hasher: ['Keccak256', 'Keccak256'],
    digest: '0x63c8827f7d7e7446772799ccfbc0ae0a57199b679a4ea3682951ccc5c418060d',
    proof: [
        {
            type: 'EcdsaSecp256k1SignatureEip191',
            created: 1693299329786,
            verificationMethod: 'did:zk:0x57E7b664aaa7C895878DdCa5790526B9659350Ec#key-0',
            proofPurpose: 'assertionMethod',
            proofValue: 'zJaNmsWPNQoJ1Gt58AotgQRoBvSoEibuAL6GBKvZ8fV5gbNCrXxBZkMyZFK6fUwUoFkZi2WZNNdMicwGzTPbzdH1Ep'
        }
    ],
    credentialSubjectHashes: [
        '0x1537556bb6125c231e6e76ec1457b80bf43647fdd0de3f57c2bc3189da55617b',
        '0x418070cd733fcab053b572eb37f4aea5686ec3485296eb2e517b622c9b59a112',
        '0xd4be7b980fc8f5d53f99b5cfcfce5633827baff0be83f16f5290190864708f4b',
        '0x4ddccf029950fee195bcd67df5a46986fea14ff00d47b5d3b9d1929c623c1f32'
    ],
    credentialSubjectNonceMap: {
        '0x28cb5b00333a3266fa3d92f3426ad4ef1d20018b44dd64913578d43438b4051a': '0xc9444e4d54f98aaa9076736432913113f0d6491321cc575ec751208d7f17fb7f',
        '0x66de8ffda797e3de9c05e8fc57b3bf0ec28a930d40b0d285d93c06501cf6a090': '0x596e356de2ec14369f127afcba1c84441c658687ea9cff7a084af5f1490b8a50',
        '0x7320ea69771c4eb8c89284d19ce63eb7a788f605b1f3509c17c6f47cc06cc404': '0x8c3e7322bb5fa1421684356dfaa32625e849334fcc34122551b5f8440573c9a2',
        '0x5fe7f977e71dba2ea1a68e21057beebb9be2ac30c6410aa38d4f3fbe41dcffd2': '0xdc2737abd5c3a6bd9f10ec1211f6d6f973ff671d38f25c1003cd17efe5b44d70'
    }
};


describe('vc verify', (): void => {
    beforeAll(async (): Promise<void> => {
        await initCrypto();
    });

    describe('verify vc with full text presentation', (): void => {
        it('vc verify with version 2, without keccak256', async (): Promise<void> => {
            expect(await vcVerify(fullVC2, document3)).toBe(true);
        });

        it('vc verify with version 2, with keccak256', async (): Promise<void> => {
            expect(await vcVerify(fullVC3, document3)).toBe(true);
        });

        it('vc verify with version 2, without keccak256, add Proof', async (): Promise<void> => {
            const addProofVC = await addProof(alice, fullVC2);
            expect(addProofVC.issuer).toEqual(['did:zk:0x57E7b664aaa7C895878DdCa5790526B9659350Ec', 'did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1']);
            expect(addProofVC.proof[1].verificationMethod).toEqual('did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0');
            expect(await vcVerify(addProofVC)).toBe(true);

        });

        it('vc verify with version 2, with keccak256, add Proof', async (): Promise<void> => {
            const addProofVC = await addProof(alice, fullVC3);
            expect(addProofVC.issuer).toEqual(['did:zk:0x57E7b664aaa7C895878DdCa5790526B9659350Ec', 'did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1']);
            expect(addProofVC.proof[1].verificationMethod).toEqual('did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1#key-0');
            expect(await vcVerify(addProofVC)).toBe(true);
        });
    });
});

// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { VerifiableCredential } from './types';

import { initCrypto } from '@zcloak/crypto';
import { executeZkProgram, generateProgramHash, initMidenWasm, verifyZkProgram } from '@zcloak/miden';

import { toMidenInput } from './parser';

const program1 = `proc.number_add.4
dup.0 loc_store.0 push.0 eq
push.0 loc_store.3
if.true
    dup.0 push.128 lt
    if.true
        dup.0
    else
        push.0
    end
else
    push.1.1 loc_store.1
    while.true
        loc_load.1 dup.0
        add.1 loc_store.1 sub.1 dup.0 push.0 gt
        if.true
            push.1
            while.true
                push.256 swap sub.1 dup.0 push.0 gt
            end
            drop
        else
            drop
        end
        loc_load.1 dup.0 loc_store.1 sub.1 dup.0 loc_store.2 push.1 gt
        while.true
            mul loc_load.2 sub.1 dup.0 loc_store.2 push.1 gt
        end
        loc_load.3 add loc_store.3
        loc_load.1 dup.0 loc_store.1
        loc_load.0 dup.0 loc_store.0 lte
    end
    loc_load.3
end
swap drop
end

proc.read_and_copy.60
mem_load.99 dup.0 mem_store.99 dup.0 push.0 eq
if.true
    drop drop dup.0 adv_push.7
else
    swap dup.1 sub loc_store.0 adv_push.1 swap dup.0 sub.1 push.0 gt
    while.true
        adv_push.1 swap sub.1 dup.0 push.1 gt
    end
    drop mem_load.99 dup.0 mem_store.99 add.1
    dup.0 u32checked_mod.4 loc_store.1 u32checked_div.4 add.50
    loc_store.2 mem_storew.50 dropw push.51 loc_load.2 dup.0 loc_store.2 push.50 gt
    while.true
        dup.0 movdn.5 mem_storew dropw dup.0 add.1
        swap loc_load.2 dup.0 loc_store.2 lt
    end
    drop loc_load.2 dup.0 loc_store.2 dup.0 dup.0 dup.0 dup.0 mem_loadw
    push.4 loc_load.1 dup.0 loc_store.1 sub dup.0 push.4 eq
    if.true
        drop
    else
        dup.0 loc_store.3 push.1
        while.true
            movup.4 swap sub.1 dup.0 push.0 gt
        end
        drop loc_load.3 dup.0 push.0 gt
        while.true
            swap drop sub.1 dup.0 push.0 gt
        end
        drop
    end
    loc_load.2 dup.0 loc_store.2 sub.1 dup.0 sub.49 push.1 gte
    while.true
        dup.0 dup.0 dup.0 dup.0 dup.0 push.50 eq
        if.true
            mem_loadw.50
        else
            mem_loadw
        end
        movup.4 sub.1 dup.0 sub.49 push.1 gte
    end
    drop loc_load.2 dup.0 loc_store.2 dup.0 dup.0 dup.0 dup.0 mem_loadw
    push.4 loc_load.1 dup.0 loc_store.1 sub dup.0 push.4 eq
    if.true
        drop
    else
        dup.0 loc_store.3 push.1
        while.true
            movup.4 swap sub.1 dup.0 push.0 gt
        end
        drop loc_load.3 dup.0 push.0 gt
        while.true
            swap drop sub.1 dup.0 push.0 gt
        end
        drop
    end
    loc_load.2 dup.0 loc_store.2 sub.1 dup.0 sub.49 push.1 gte
    while.true
        dup.0 dup.0 dup.0 dup.0 dup.0 push.50 eq
        if.true
            mem_loadw.50
        else
            mem_loadw
        end
        movup.4 sub.1 dup.0 sub.49 push.1 gte
    end
    drop loc_load.0 dup.0 push.0 eq
    if.true
        drop
    else
        adv_push.1 swap dup.0 sub.1 push.0 gt
        while.true
            adv_push.1 swap sub.1 dup.0 push.1 gt
        end
        drop
    end
end
end

proc.read_new_leaf
adv_push.1 dup.0 dup.0 push.0 gt swap push.129 lt and
if.true
    push.7 push.0 mem_store.99  push.1 mem_store.200
else
    dup.0 push.128 gt push.1
    assert_eq dup.0 sub.128 dup.0 dup.0
    mem_store.99 push.8 lt
    if.true
        drop push.7
        push.1 mem_store.200
    else
        u32checked_div.4 dup.0 mem_store.200 mul.4 add.3
    end
end
end

proc.multi_rphash
mem_load.200 dup.0 push.1 eq
if.true
    drop hmerge
else
    push.1
    while.true
        sub.1
        movdn.8 hmerge
        movup.4 dup.0 push.1 gte
    end
    drop
end
end

begin
mem_store.102
push.1 mem_store.101 adv_push.4 mem_storew.100 dropw
exec.read_new_leaf exec.read_and_copy exec.multi_rphash dupw mem_storew.40 dropw adv_push.4 hmerge
adv_push.4 swapw hmerge adv_push.4 hmerge
padw mem_loadw.100 dupw mem_storew.100 dropw movup.4 eq swap movup.4 eq movup.2 movup.4
eq movup.3 movup.4 eq and and and not
if.true
    padw mem_storew.100 dropw
end
mem_load.99 exec.number_add mul.1 mem_load.102 lt mem_load.101 and mem_store.101
mem_load.101 padw mem_loadw.100
end
`;
const program2 = `proc.number_add.4
dup.0 loc_store.0 push.0 eq
push.0 loc_store.3
if.true
    dup.0 push.128 lt
    if.true
        dup.0
    else
        push.0
    end
else
    push.1.1 loc_store.1
    while.true
        loc_load.1 dup.0
        add.1 loc_store.1 sub.1 dup.0 push.0 gt
        if.true
            push.1
            while.true
                push.256 swap sub.1 dup.0 push.0 gt
            end
            drop
        else
            drop
        end
        loc_load.1 dup.0 loc_store.1 sub.1 dup.0 loc_store.2 push.1 gt
        while.true
            mul loc_load.2 sub.1 dup.0 loc_store.2 push.1 gt
        end
        loc_load.3 add loc_store.3
        loc_load.1 dup.0 loc_store.1
        loc_load.0 dup.0 loc_store.0 lte
    end
    loc_load.3
end
swap drop
end

proc.read_and_copy.60
mem_load.99 dup.0 mem_store.99 dup.0 push.0 eq
if.true
    drop drop dup.0 adv_push.7
else
    swap dup.1 sub loc_store.0 adv_push.1 swap dup.0 sub.1 push.0 gt
    while.true
        adv_push.1 swap sub.1 dup.0 push.1 gt
    end
    drop mem_load.99 dup.0 mem_store.99 add.1
    dup.0 u32checked_mod.4 loc_store.1 u32checked_div.4 add.50
    loc_store.2 mem_storew.50 dropw push.51 loc_load.2 dup.0 loc_store.2 push.50 gt
    while.true
        dup.0 movdn.5 mem_storew dropw dup.0 add.1
        swap loc_load.2 dup.0 loc_store.2 lt
    end
    drop loc_load.2 dup.0 loc_store.2 dup.0 dup.0 dup.0 dup.0 mem_loadw
    push.4 loc_load.1 dup.0 loc_store.1 sub dup.0 push.4 eq
    if.true
        drop
    else
        dup.0 loc_store.3 push.1
        while.true
            movup.4 swap sub.1 dup.0 push.0 gt
        end
        drop loc_load.3 dup.0 push.0 gt
        while.true
            swap drop sub.1 dup.0 push.0 gt
        end
        drop
    end
    loc_load.2 dup.0 loc_store.2 sub.1 dup.0 sub.49 push.1 gte
    while.true
        dup.0 dup.0 dup.0 dup.0 dup.0 push.50 eq
        if.true
            mem_loadw.50
        else
            mem_loadw
        end
        movup.4 sub.1 dup.0 sub.49 push.1 gte
    end
    drop loc_load.2 dup.0 loc_store.2 dup.0 dup.0 dup.0 dup.0 mem_loadw
    push.4 loc_load.1 dup.0 loc_store.1 sub dup.0 push.4 eq
    if.true
        drop
    else
        dup.0 loc_store.3 push.1
        while.true
            movup.4 swap sub.1 dup.0 push.0 gt
        end
        drop loc_load.3 dup.0 push.0 gt
        while.true
            swap drop sub.1 dup.0 push.0 gt
        end
        drop
    end
    loc_load.2 dup.0 loc_store.2 sub.1 dup.0 sub.49 push.1 gte
    while.true
        dup.0 dup.0 dup.0 dup.0 dup.0 push.50 eq
        if.true
            mem_loadw.50
        else
            mem_loadw
        end
        movup.4 sub.1 dup.0 sub.49 push.1 gte
    end
    drop loc_load.0 dup.0 push.0 eq
    if.true
        drop
    else
        adv_push.1 swap dup.0 sub.1 push.0 gt
        while.true
            adv_push.1 swap sub.1 dup.0 push.1 gt
        end
        drop
    end
end
end

proc.read_new_leaf
adv_push.1 dup.0 dup.0 push.0 gt swap push.129 lt and
if.true
    push.7 push.0 mem_store.99  push.1 mem_store.200
else
    dup.0 push.128 gt push.1
    assert_eq dup.0 sub.128 dup.0 dup.0
    mem_store.99 push.8 lt
    if.true
        drop push.7
        push.1 mem_store.200
    else
        u32checked_div.4 dup.0 mem_store.200 mul.4 add.3
    end
end
end

proc.multi_rphash
mem_load.200 dup.0 push.1 eq
if.true
    drop hmerge
else
    push.1
    while.true
        sub.1
        movdn.8 hmerge
        movup.4 dup.0 push.1 gte
    end
    drop
end
end

begin
mem_store.103

push.1 mem_store.101 push.1 mem_store.102 adv_push.4 mem_storew.100 dropw
exec.read_new_leaf exec.read_and_copy exec.multi_rphash dupw mem_storew.40 dropw adv_push.4 hmerge
adv_push.4 swapw hmerge adv_push.4 hmerge
padw mem_loadw.100 dupw mem_storew.100 dropw movup.4 eq swap movup.4 eq movup.2 movup.4
eq movup.3 movup.4 eq and and and not
if.true
    padw mem_storew.100 dropw
end
mem_load.99 exec.number_add mul.1 mem_load.103 lt mem_load.102 and mem_store.102
exec.read_new_leaf exec.read_and_copy exec.multi_rphash dupw mem_storew.40 dropw adv_push.4 hmerge
adv_push.4 hmerge adv_push.4 swapw hmerge
padw mem_loadw.100 dupw mem_storew.100 dropw movup.4 eq swap movup.4 eq movup.2 movup.4
eq movup.3 movup.4 eq and and and not
if.true
    padw mem_storew.100 dropw
end  mem_load.99 exec.number_add  mem_store.107 push.1 mem_store.108

push.4.51.31.48.50.64.96.116.156.268.344.356.360 push.364.368.376.392.400.398.414.417.418.422.446.458 push.462.496.104.524.408.512.586.275 push.608.634.682.702.410.144.760.158 push.762.764.626.792.795.784.860.704.887
  repeat.50
    mem_load.107 eq
    if.true
        push.1 mem_store.101 push.0 mem_store.108
    end
  end

mem_load.108 push.1 eq
if.true
  push.660.28.533.44.52.84.60.92.124.136.188.192.531.212.214.222 push.304.308.312.320.332.340.388.474.484.500.558 push.591.630.652.659.662.663.666.670.534.780.796.840.850
repeat.40
  mem_load.107 eq
  if.true
    push.3 mem_store.101 push.0 mem_store.108
  end
end

  mem_load.108 push.1 eq
  if.true
    push.8.20.40.112.56.70.100.191.196.203.208.233.234 push.246.250.276.292.300.831.348.352.372.833.380.832.428 push.438.440.442.470.498.492.499.528.807 push.578.616.620.642.643.674.688.703.705.724.752.756.804.826.336
    repeat.50
        mem_load.107 eq
        if.true
          push.2 mem_store.101 push.0 mem_store.108
        end
    end

    mem_load.108 push.1 eq
    if.true
      push.32.68.76.152.170.218.238.254.328.600.604.740.858.862
      repeat.14
          mem_load.107 eq
          if.true
            push.5 mem_store.101 push.0 mem_store.108
          end
      end

      mem_load.108 push.1 eq
      if.true
        push.16.36.184.242.258.316.296.584.583.520.540 push.554.570.580.585.598.882.90.772.776.798.548.876
        repeat.23
          mem_load.107 eq
            if.true
              push.4 mem_store.101 push.0 mem_store.108
            end
        end

        mem_load.108 push.1 eq
        if.true
          push.12.24.204.72.854.108.120.132.140.148.174 push.262.180.818.226.232.748.231.266.270.288.324 push.624.384.404.426.430.434.450.454.466 push.478.480.175.504.508.516.562.566.178 push.638.646.678.686.690.694.706 push.710.728.729.834.768.788.800.732.894.716

          repeat.57
          mem_load.107 eq
            if.true
                push.0 mem_store.101 push.0
            end
          end
        end
      end
    end
  end
end
mem_load.101 mul.2 mem_load.102 add padw mem_loadw.100
end`;

const credential: VerifiableCredential<false> = {
  '@context': ['https://www.w3.org/2018/credentials/v1'],
  version: '1',
  ctype: '0x1209c3865ae4631cceacfbb3d4a946fec4ff97d3c7454a0383cb7e26b0bb8189',
  issuanceDate: 1683718402209,
  credentialSubject: {
    name: 'zCloak',
    birth: 655660800,
    nation: 156,
    risklevel: 2
  },
  issuer: 'did:zk:0x57E7b664aaa7C895878DdCa5790526B9659350Ec',
  holder: 'did:zk:0x11f8b77F34FCF14B7095BF5228Ac0606324E82D1',
  hasher: ['RescuePrimeOptimized', 'Keccak256'],
  digest: '0xbd14425c336375acc386f91c6240e5504c9553194da7133df5059bd31d217ae3',
  proof: [
    {
      type: 'EcdsaSecp256k1SignatureEip191',
      created: 1683718402236,
      verificationMethod: 'did:zk:0x57E7b664aaa7C895878DdCa5790526B9659350Ec#key-0',
      proofPurpose: 'assertionMethod',
      proofValue: 'zL2U7S8MpWhyHoZVZ7CAX2Qa2K1MuL34JeWqSoNNXj7fWcHRYgv79ej6wTGwTJMzEgihA5XN19kUha14jKi5EPZyhJ'
    }
  ],
  credentialSubjectHashes: [
    '0x3bc94c3cbb379170211c638732d6b6c0c502b14b608dd3360fae3e1584290c17',
    '0x9049518831c2e080e83a6503ab9dbb00fe23c56de653e2ea66a180b89f1173ac',
    '0x050cc39d59661fbd8439a441a6d5a2e1f2ba3d23ea9a11167ca386871dc25296',
    '0xcc9cd567c75cf0846d95d734eb5c86b1deb43549e0168fc2e37e38fdd05dbb7a'
  ],
  credentialSubjectNonceMap: {
    '0x231908b8ae5383c36692acf228bab264e4d9aedb54346cf4a945857a0a115ce0':
      '0x50a0a09e297c049196edbf7fd47cd80ad2c4c5426b0ea2d9c6cdadaea3c2ed87',
    '0xa35fcb7b2f25123f34d7a00321081d2be1e6aa59bc38c5a1fb67b0b627ed716d':
      '0x9fb6d2dbbe7a6565bf7702db629418d2f60d65016416d758c1e0f81667133492',
    '0x747e81e49d695483a90dc5193bfbce117649f242c629937926ce312ad8586561':
      '0xc78ccc2907b8c42bbfaccfb759eb64bb6a25f64df1f547aea70228f793f35831',
    '0xfd51749625f476ad424f2f7a3298be8abfb3528acd9d5f6f6960e211fbed091f':
      '0x36320a331e33918cbf004a4b794cb3932d5a573f2d77485f0b0d7d9a4b3edd1c'
  }
};

describe('execute miden', (): void => {
  beforeAll(async (): Promise<void> => {
    await initCrypto();
    await initMidenWasm();
  });

  it('parse single leave and run miden', (): void => {
    const currentDate = new Date();
    const compareDate = currentDate.setFullYear(currentDate.getFullYear() - 18);

    const stackInputs = `${Math.floor(new Date(compareDate).getTime() / 1000)}`;

    const result = executeZkProgram(program1, stackInputs, toMidenInput(credential, [1]));

    expect(verifyZkProgram(generateProgramHash(program1), stackInputs, result)).toBe(96);
  });

  it('parse multiple leaves and run miden', (): void => {
    const currentDate = new Date();
    const compareDate = currentDate.setFullYear(currentDate.getFullYear() - 18);

    const stackInputs = `${Math.floor(new Date(compareDate).getTime() / 1000)}`;

    const result = executeZkProgram(program2, stackInputs, toMidenInput(credential, [1, 2]));

    expect(verifyZkProgram(generateProgramHash(program2), stackInputs, result)).toBe(96);
  });
});

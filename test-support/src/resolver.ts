// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { MockDidResolver } from '@zcloak/did-resolver';

import { alice, bob, charlie, dave, eve, ferdie } from './dids';

export const testResolver = new MockDidResolver();

testResolver.addDocument(alice.getDocument());
testResolver.addDocument(bob.getDocument());
testResolver.addDocument(charlie.getDocument());
testResolver.addDocument(dave.getDocument());
testResolver.addDocument(eve.getDocument());
testResolver.addDocument(ferdie.getDocument());

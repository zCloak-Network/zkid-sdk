// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

const config = require('@zcloak/dev/config/jest.cjs');

module.exports = Object.assign({}, config, {
  moduleNameMapper: {
    '@zcloak/crypto(.*)$': '<rootDir>/packages/crypto/src/$1',
    '@zcloak/ctype(.*)$': '<rootDir>/packages/ctype/src/$1',
    '@zcloak/did-resolver(.*)$': '<rootDir>/packages/did-resolver/src/$1',
    '@zcloak/did(.*)$': '<rootDir>/packages/did/src/$1',
    '@zcloak/keyring(.*)$': '<rootDir>/packages/keyring/src/$1',
    '@zcloak/message(.*)$': '<rootDir>/packages/message/src/$1',
    '@zcloak/vc(.*)$': '<rootDir>/packages/vc/src/$1',
    '@zcloak/verify(.*)$': '<rootDir>/packages/verify/src/$1',
    '@zcloak/wasm(.*)$': '<rootDir>/packages/wasm/src/$1'
  },
  testTimeout: 30000
});

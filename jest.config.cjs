// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

const config = require('@zcloak/dev/config/jest.cjs');

module.exports = Object.assign({}, config, {
  moduleNameMapper: {
    '@zcloak/cross(.*)$': '<rootDir>/utility/cross/src/node',
    '@zcloak/crypto(.*)$': '<rootDir>/utility/crypto/src/$1',
    '@zcloak/keyring(.*)$': '<rootDir>/utility/keyring/src/$1',
    '@zcloak/wasm-asm(.*)$': '<rootDir>/utility/wasm-asm/src/$1',
    '@zcloak/wasm-bridge(.*)$': '<rootDir>/utility/wasm-bridge/src/$1',
    '@zcloak/wasm(.*)$': '<rootDir>/utility/wasm/src/$1',
    '@zcloak/ctype(.*)$': '<rootDir>/protocol/ctype/src/$1',
    '@zcloak/did-resolver(.*)$': '<rootDir>/protocol/did-resolver/src/$1',
    '@zcloak/did(.*)$': '<rootDir>/protocol/did/src/$1',
    '@zcloak/vc(.*)$': '<rootDir>/protocol/vc/src/$1',
    '@zcloak/message(.*)$': '<rootDir>/packages/message/src/$1',
    '@zcloak/verify(.*)$': '<rootDir>/packages/verify/src/$1',
    'test-support(.*)$': '<rootDir>/test-support/src/$1'
  },
  testTimeout: 30000
});

// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

const base = require('@zcloak/dev/config/eslint.cjs');

module.exports = {
  ...base,
  ignorePatterns: [
    ...base.ignorePatterns,
    'scripts/**/*',
    'packages/wasm-asm/src/index.js',
    'packages/wasm/src/index.js'
  ],
  parserOptions: {
    ...base.parserOptions,
    project: [
      './tsconfig.eslint.json'
    ]
  },
  rules: {
    ...base.rules
  }
};

// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

const { execSync } = require('child_process');
const fs = require('fs');

const { u8aToHex } = require('@polkadot/util');

const COPYRIGHT = `// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0
`;

process.chdir('packages/wasm');

execSync('wasm-pack build --target web', { stdio: 'inherit' });

const wasm = fs.readFileSync('pkg/wasm_bg.wasm');

const bytes = Uint8Array.from(wasm);

const hex = u8aToHex(bytes);

console.log('Write wasm bytes');
fs.writeFileSync(
  'src/bytes.js',
  `// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

export const bytes =
  '${hex}';
`
);

const wasmTs = fs.readFileSync('pkg/wasm.d.ts', { encoding: 'utf-8' }).toString();
const wasmJs = fs.readFileSync('pkg/wasm.js', { encoding: 'utf-8' }).toString();

fs.writeFileSync(
  'src/wasm.d.ts',
  `${COPYRIGHT}
${wasmTs}
`
);
fs.writeFileSync(
  'src/wasm.js',
  `${COPYRIGHT}
/* tslint:disable */
/* eslint-disable */
${wasmJs}
`
);

fs.rmdirSync('pkg', { recursive: true });

process.chdir('../..');

execSync('yarn zcloak-dev-run-lint', { stdio: 'inherit' });

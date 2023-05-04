// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { u8aToHex } from '@polkadot/util';
import { execSync } from 'child_process';
import fs from 'fs-extra';

const COPYRIGHT = `// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0
`;

process.chdir('utility/wasm');

console.log('### Build Rust sources');
execSync('cargo build --target wasm32-unknown-unknown --release', { stdio: 'inherit' });

console.log('### Converting to WASM');
execSync(
  '../../bindgen/wasm-bindgen target/wasm32-unknown-unknown/release/wasm.wasm --out-dir build-wasm --target web',
  { stdio: 'inherit' }
);

// optimise
console.log('Optimising WASM output');
execSync('../../binaryen/bin/wasm-opt build-wasm/wasm_bg.wasm -Oz -o build-wasm/wasm_opt.wasm', {
  stdio: 'inherit'
});

// build asmjs version from the input (optimised) WASM
console.log('### Building asm.js version');
fs.createFileSync('build-asm/asm.js');
execSync('../../binaryen/bin/wasm2js -Oz --output build-asm/asm.js build-wasm/wasm_opt.wasm', {
  stdio: 'inherit'
});

const wasm = fs.readFileSync('build-wasm/wasm_opt.wasm');

const bytes = Uint8Array.from(wasm);

const hex = u8aToHex(bytes);

console.log('Write wasm bytes');
fs.writeFileSync(
  'src/index.js',
  `${COPYRIGHT}
export const bytes =
  '${hex}';
`
);

console.log('Write asm file');
fs.writeFileSync(
  '../wasm-asm/src/index.js',
  `${COPYRIGHT}
/* tslint:disable */
/* eslint-disable */

${fs.readFileSync('build-asm/asm.js', 'utf-8').toString()}
`
);

process.chdir('../miden');

// miden wasm
console.log('### Build Rust miden wasm sources');
execSync('cargo build --target wasm32-unknown-unknown --release', { stdio: 'inherit' });

console.log('### Converting to WASM');
execSync(
  '../../bindgen/wasm-bindgen target/wasm32-unknown-unknown/release/wasm_miden.wasm --out-dir build-wasm --target web',
  { stdio: 'inherit' }
);

// optimise
console.log('Optimising WASM output');
execSync('../../binaryen/bin/wasm-opt build-wasm/wasm_miden_bg.wasm -Oz -o build-wasm/wasm_opt.wasm', {
  stdio: 'inherit'
});

const midenWasm = fs.readFileSync('build-wasm/wasm_opt.wasm');

const midenBytes = Uint8Array.from(midenWasm);

const midenHex = u8aToHex(midenBytes);

console.log('Write wasm bytes');
fs.writeFileSync(
  'src/bytes.js',
  `${COPYRIGHT}
export const bytes =
  '${midenHex}';
`
);

process.chdir('../..');

execSync('yarn zcloak-dev-run-lint', { stdio: 'inherit' });

// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { execSync } from 'child_process';
import fs from 'fs-extra';

const BINDGEN_REPO = 'https://github.com/rustwasm/wasm-bindgen';
const BINDGEN_VER = '0.2.84';

const BINARYEN_REPO = 'https://github.com/WebAssembly/binaryen';
const BINARYEN_VER = 'version_112';

let bindgen_zip;
let binaryen_zip;
if (process.platform === 'darwin') {
  console.log('### Detected Mac');
  bindgen_zip = `wasm-bindgen-${BINDGEN_VER}-x86_64-apple-darwin`;
  binaryen_zip = `binaryen-${BINARYEN_VER}-x86_64-macos`;
} else if (process.platform === 'linux') {
  bindgen_zip = `wasm-bindgen-${BINDGEN_VER}-x86_64-unknown-linux-musl`;
  binaryen_zip = `binaryen-${BINARYEN_VER}-x86_64-linux`;
  console.log('### Detected Linux');
} else {
  console.log(`*** Unknown platform ${process.platform}, unable to install wasm helper binaries`);
  process.exit(-1);
}

if (!fs.existsSync('binaryen')) {
  console.log('### Downloading binaryen');
  execSync(
    `curl -L ${BINARYEN_REPO}/releases/download/${BINARYEN_VER}/${binaryen_zip}.tar.gz | tar xz`,
    { stdio: 'inherit' }
  );
  fs.moveSync(`binaryen-${BINARYEN_VER}`, 'binaryen');
}

if (!fs.existsSync('bindgen')) {
  console.log('### Downloading bindgen');
  execSync(
    `curl -L ${BINDGEN_REPO}/releases/download/${BINDGEN_VER}/${bindgen_zip}.tar.gz | tar xz`,
    { stdio: 'inherit' }
  );
  fs.moveSync(`${bindgen_zip}`, 'bindgen');
}

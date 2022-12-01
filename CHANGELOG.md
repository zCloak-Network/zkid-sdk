# CHANGELOG

## [0.4.0](https://github.com/zCloak-Network/zkid-sdk/compare/v0.3.0...v0.4.0) (2022-12-01)


### Features

* **release:** release-please ([42c3cfc](https://github.com/zCloak-Network/zkid-sdk/commit/42c3cfcd8065e3ed44106e2df5221d65d01ed967))

## 0.3.0 Nov 30, 2022

The @ethereum/rlp is incorrect for handling hex strings, we fix it and support `rlpEncode` function in @zcloak/crypto


## 0.2.1 Nov 29, 2022

- ctype improve
  1. add object type for ctype schema (#23)
  2. enum type
- add `resolverOrDidDocument` arg on function `vpVerify`

## 0.2.0 Nov 24, 2022

❗️❗️❗️ The `hashType` using `Rescue` in previous versions of vp and vc needs to be updated to `RescuePrime` ❗️❗️❗️

Changes:

- Rename `Rescue` in `HashType` to `RescuePrime`

## 0.1.0 Nov 23, 2022

Changes:

- message version upgrade to v2, add signature and signer field.
- import cross-fetch on ArweaveDidResolver.
- Import asm.js for some device don't support wasm, such as service worder on extension.
- Install build-wasm dependencies, [bindgen](https://github.com/rustwasm/wasm-bindgen), [binaryen](https://github.com/WebAssembly/binaryen).


## 0.0.3 Nov 18, 2022

Changes:

- fix esm build js files without .js extensions.

## 0.0.2 Nov 17, 2022

Changes:

- bump versions.
- fix will not includes .js and .jsx files when build

## 0.0.1 Nov 16, 2022

Changes:

Initial stable version, includes below packages:
- [@zcloak/crypto](https://www.npmjs.com/package/@zcloak/crypto), some crypto utilities.
- [@zcloak/ctype](https://www.npmjs.com/package/@zcloak/ctype), validation for subject.
- [@zcloak/did](https://www.npmjs.com/package/@zcloak/did), zkID DID implements.
- [@zcloak/did-resolver](https://www.npmjs.com/package/@zcloak/did), Resolve DID and fetch document.
- [@zcloak/keyring](https://www.npmjs.com/package/@zcloak/keyring), manage keypair for user.
- [@zcloak/message](https://www.npmjs.com/package/@zcloak/message), peer-to-peer message transport.
- [@zcloak/vc](https://www.npmjs.com/package/@zcloak/vc), zkID VV implements.
- [@zcloak/verify](https://www.npmjs.com/package/@zcloak/verify), verifies utilities functions.
- [@zcloak/wasm](https://www.npmjs.com/package/@zcloak/wasm), RUST crates WASM.

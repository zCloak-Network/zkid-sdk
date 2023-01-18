# CHANGELOG

## [0.7.2](https://github.com/zCloak-Network/zkid-sdk/compare/v0.7.1...v0.7.2) (2023-01-18)


### Bug Fixes

* **verify:** didVerify will always return false when hash multiple signer keys and not sign with the first ([#34](https://github.com/zCloak-Network/zkid-sdk/issues/34)) ([53a8e4e](https://github.com/zCloak-Network/zkid-sdk/commit/53a8e4ea15ed3a1c2b3cc183d21ed77af33addf5))


## [0.7.1](https://github.com/zCloak-Network/zkid-sdk/compare/v0.7.0...v0.7.1) (2023-01-17)


### Bug Fixes

* **verify:** vpVerify will always failed when VPType: VP_Digest, VP_SelectiveDisclosure ([#30](https://github.com/zCloak-Network/zkid-sdk/issues/30)) ([6b5eb85](https://github.com/zCloak-Network/zkid-sdk/commit/6b5eb855ba913d215b2967b9a77dec1f42dc599d))
* **vp:** vp proof without challenge ([#29](https://github.com/zCloak-Network/zkid-sdk/issues/29)) ([c98cde4](https://github.com/zCloak-Network/zkid-sdk/commit/c98cde4d0b2dd32c65be7d8f2ebc3599d5012979))


## [0.7.0](https://github.com/zCloak-Network/zkid-sdk/compare/v0.6.1...v0.7.0) (2022-12-21)


### Features

* **did:** Did Keyring extends Did Details, and rewrites the return value of the sign method as Promise ([#28](https://github.com/zCloak-Network/zkid-sdk/issues/28)) ([b211f07](https://github.com/zCloak-Network/zkid-sdk/commit/b211f07e92be1b42d6f725cb5346a85426694b66))


## [0.6.1](https://github.com/zCloak-Network/zkid-sdk/compare/v0.6.0...v0.6.1) (2022-12-08)


### Bug Fixes

* **wasm:** webpack build dynamic import could not use in service worker, remove the dynamic import in wasm-bridge. ([9babafd](https://github.com/zCloak-Network/zkid-sdk/commit/9babafd3d5c82ade064bc54f6ceac248deebc192))


# [0.6.0](https://github.com/zCloak-Network/zkid-sdk/compare/v0.5.0...v0.6.0) (2022-12-05)


### Features

* **crypto, wasm:** build the wasm from rust and tiny the crypto package ([d794a99](https://github.com/zCloak-Network/zkid-sdk/commit/d794a9935c6b060353822c0a73efb226ef95a6f9))


# [0.5.0](https://github.com/zCloak-Network/zkid-sdk/compare/v0.4.1...v0.5.0) (2022-12-03)


### Features

* **did:** parse identifier from document id. ([b1289b3](https://github.com/zCloak-Network/zkid-sdk/commit/b1289b394531f7fc85854ae7d96266c288e3117a))


## [0.4.1](https://github.com/zCloak-Network/zkid-sdk/compare/v0.4.0...v0.4.1) (2022-12-01)


### Bug Fixes

* release ci error ([084bd0b](https://github.com/zCloak-Network/zkid-sdk/commit/084bd0b335757b0b6421c5b6971891d8e12a2c4e))


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

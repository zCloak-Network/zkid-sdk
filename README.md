[![zkid-sdk](https://img.shields.io/badge/zkid-sdk-lightgrey?style=flat-square)](.)
![license](https://img.shields.io/badge/License-Apache%202.0-blue?logo=apache&style=flat-square)

# zkid-sdk

This repo implements zkID protocol such as: did protocol, vc protocol, and some utilities.

For more information about DID and VC, please visit [DID-official W3C specification](https://www.w3.org/TR/did-core/), [VC-official W3C specification](https://www.w3.org/TR/vc-data-model/)

## overview

This repository is split up into a number of internal packages.

### protocol implement of DID and VC.

| Package | Stable | Beta | Size |
|---------|--------|------|------|
|  [`@zcloak/ctype`](protocol/ctype) | [![npm](https://img.shields.io/npm/v/@zcloak/ctype)](https://www.npmjs.com/package/@zcloak/ctype) | [![beta](https://img.shields.io/npm/v/@zcloak/ctype/beta)](https://www.npmjs.com/package/@zcloak/ctype) | [![minzip](https://img.shields.io/bundlephobia/minzip/@zcloak/ctype)](https://bundlephobia.com/result?p=@zcloak/ctype) |
|  [`@zcloak/did`](protocol/did) | [![npm](https://img.shields.io/npm/v/@zcloak/did)](https://www.npmjs.com/package/@zcloak/did) | [![beta](https://img.shields.io/npm/v/@zcloak/did/beta)](https://www.npmjs.com/package/@zcloak/did) | [![minzip](https://img.shields.io/bundlephobia/minzip/@zcloak/did)](https://bundlephobia.com/result?p=@zcloak/did) |
|  [`@zcloak/did-resolver`](protocol/did-resolver) | [![npm](https://img.shields.io/npm/v/@zcloak/did-resolver)](https://www.npmjs.com/package/@zcloak/did-resolver) | [![beta](https://img.shields.io/npm/v/@zcloak/did-resolver/beta)](https://www.npmjs.com/package/@zcloak/did-resolver) | [![minzip](https://img.shields.io/bundlephobia/minzip/@zcloak/did-resolver)](https://bundlephobia.com/result?p=@zcloak/did-resolver) |
|  [`@zcloak/vc`](protocol/vc) | [![npm](https://img.shields.io/npm/v/@zcloak/vc)](https://www.npmjs.com/package/@zcloak/vc) | [![beta](https://img.shields.io/npm/v/@zcloak/vc/beta)](https://www.npmjs.com/package/@zcloak/vc) | [![minzip](https://img.shields.io/bundlephobia/minzip/@zcloak/vc)](https://bundlephobia.com/result?p=@zcloak/vc) |

### wasm utility, crypto utility, and the keyring of manage keys.

| Package | Stable | Beta | Size |
|---------|--------|------|------|
|  [`@zcloak/crypto`](utility/crypto) | [![npm](https://img.shields.io/npm/v/@zcloak/crypto)](https://www.npmjs.com/package/@zcloak/crypto) | [![beta](https://img.shields.io/npm/v/@zcloak/crypto/beta)](https://www.npmjs.com/package/@zcloak/crypto) | [![minzip](https://img.shields.io/bundlephobia/minzip/@zcloak/crypto)](https://bundlephobia.com/result?p=@zcloak/crypto) |
|  [`@zcloak/keyring`](utility/keyring) | [![npm](https://img.shields.io/npm/v/@zcloak/keyring)](https://www.npmjs.com/package/@zcloak/keyring) | [![beta](https://img.shields.io/npm/v/@zcloak/keyring/beta)](https://www.npmjs.com/package/@zcloak/keyring) | [![minzip](https://img.shields.io/bundlephobia/minzip/@zcloak/keyring)](https://bundlephobia.com/result?p=@zcloak/keyring) |
|  [`@zcloak/wasm`](utility/wasm) | [![npm](https://img.shields.io/npm/v/@zcloak/wasm)](https://www.npmjs.com/package/@zcloak/wasm) | [![beta](https://img.shields.io/npm/v/@zcloak/wasm/beta)](https://www.npmjs.com/package/@zcloak/wasm) | [![minzip](https://img.shields.io/bundlephobia/minzip/@zcloak/wasm)](https://bundlephobia.com/result?p=@zcloak/wasm) |
|  [`@zcloak/wasm-asm`](utility/wasm-asm) | [![npm](https://img.shields.io/npm/v/@zcloak/wasm-asm)](https://www.npmjs.com/package/@zcloak/wasm-asm) | [![beta](https://img.shields.io/npm/v/@zcloak/wasm-asm/beta)](https://www.npmjs.com/package/@zcloak/wasm-asm) | [![minzip](https://img.shields.io/bundlephobia/minzip/@zcloak/wasm-asm)](https://bundlephobia.com/result?p=@zcloak/wasm-asm) |
|  [`@zcloak/wasm-bridge`](utility/wasm-bridge) | [![npm](https://img.shields.io/npm/v/@zcloak/wasm-bridge)](https://www.npmjs.com/package/@zcloak/wasm-bridge) | [![beta](https://img.shields.io/npm/v/@zcloak/wasm-bridge/beta)](https://www.npmjs.com/package/@zcloak/wasm-bridge) | [![minzip](https://img.shields.io/bundlephobia/minzip/@zcloak/wasm-bridge)](https://bundlephobia.com/result?p=@zcloak/wasm-bridge) |

### some packages of the protocol

| Package | Stable | Beta | Size |
|---------|--------|------|------|
|  [`@zcloak/message`](packages/message) | [![npm](https://img.shields.io/npm/v/@zcloak/message)](https://www.npmjs.com/package/@zcloak/message) | [![beta](https://img.shields.io/npm/v/@zcloak/message/beta)](https://www.npmjs.com/package/@zcloak/message) | [![minzip](https://img.shields.io/bundlephobia/minzip/@zcloak/message)](https://bundlephobia.com/result?p=@zcloak/message) |
|  [`@zcloak/verify`](packages/verify) | [![npm](https://img.shields.io/npm/v/@zcloak/verify)](https://www.npmjs.com/package/@zcloak/verify) | [![beta](https://img.shields.io/npm/v/@zcloak/verify/beta)](https://www.npmjs.com/package/@zcloak/verify) | [![minzip](https://img.shields.io/bundlephobia/minzip/@zcloak/verify)](https://bundlephobia.com/result?p=@zcloak/verify) |

## zkid-login protocol

This library exposes methods for dapps to interact with wallets for @zcloak/login, provides providers and verify. For complete documentation around the verify, providers and their use, visit the [documentation portal](https://docs.zkid.app/).


| Package | Stable | Beta | Size |
|---------|--------|------|------|
|  [`@zcloak/login-rpc`](login/rpc) | [![npm](https://img.shields.io/npm/v/@zcloak/login-rpc)](https://www.npmjs.com/package/@zcloak/login-rpc) | [![beta](https://img.shields.io/npm/v/@zcloak/login-rpc/beta)](https://www.npmjs.com/package/@zcloak/login-rpc) | [![minzip](https://img.shields.io/bundlephobia/minzip/@zcloak/login-rpc)](https://bundlephobia.com/result?p=@zcloak/login-rpc) |
|  [`@zcloak/login-rpc-defines`](login/rpc-defines) | [![npm](https://img.shields.io/npm/v/@zcloak/login-rpc-defines)](https://www.npmjs.com/package/@zcloak/login-rpc-defines) | [![beta](https://img.shields.io/npm/v/@zcloak/login-rpc-defines/beta)](https://www.npmjs.com/package/@zcloak/login-rpc-defines) | [![minzip](https://img.shields.io/bundlephobia/minzip/@zcloak/login-rpc-defines)](https://bundlephobia.com/result?p=@zcloak/login-rpc-defines) |
|  [`@zcloak/login-providers`](login/providers) | [![npm](https://img.shields.io/npm/v/@zcloak/login-providers)](https://www.npmjs.com/package/@zcloak/login-providers) | [![beta](https://img.shields.io/npm/v/@zcloak/login-providers/beta)](https://www.npmjs.com/package/@zcloak/login-providers) | [![minzip](https://img.shields.io/bundlephobia/minzip/@zcloak/login-providers)](https://bundlephobia.com/result?p=@zcloak/login-providers) |
|  [`@zcloak/login-did`](login/did) | [![npm](https://img.shields.io/npm/v/@zcloak/login-did)](https://www.npmjs.com/package/@zcloak/login-did) | [![beta](https://img.shields.io/npm/v/@zcloak/login-did/beta)](https://www.npmjs.com/package/@zcloak/login-did) | [![minzip](https://img.shields.io/bundlephobia/minzip/@zcloak/login-did)](https://bundlephobia.com/result?p=@zcloak/login-did) |
|  [`@zcloak/login-verify`](login/verify) | [![npm](https://img.shields.io/npm/v/@zcloak/login-verify)](https://www.npmjs.com/package/@zcloak/login-verify) | [![beta](https://img.shields.io/npm/v/@zcloak/login-verify/beta)](https://www.npmjs.com/package/@zcloak/login-verify) | [![minzip](https://img.shields.io/bundlephobia/minzip/@zcloak/login-verify)](https://bundlephobia.com/result?p=@zcloak/login-verify) |

## CONTRIBUTING

See [CONTRIBUTING.md](./CONTRIBUTING.md)

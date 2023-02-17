[![zkid-sdk](https://img.shields.io/badge/zkid-sdk-lightgrey?style=flat-square)](.)
![license](https://img.shields.io/badge/License-Apache%202.0-blue?logo=apache&style=flat-square)

# zkid-sdk

This repo implements zkID protocol such as: did protocol, vc protocol, and some utilities.

For more information about DID and VC, please visit [DID-official W3C specification](https://www.w3.org/TR/did-core/), [VC-official W3C specification](https://www.w3.org/TR/vc-data-model/)

## overview

This repository is split up into a number of internal packages

| Package | Stable | Beta | Size |
|---------|--------|------|------|
|  [`@zcloak/crypto`](packages/crypto) | [![npm](https://img.shields.io/npm/v/@zcloak/crypto)](https://www.npmjs.com/package/@zcloak/crypto) | [![beta](https://img.shields.io/npm/v/@zcloak/crypto/beta)](https://www.npmjs.com/package/@zcloak/crypto) | [![minzip](https://img.shields.io/bundlephobia/minzip/@zcloak/crypto)](https://bundlephobia.com/result?p=@zcloak/crypto) |
|  [`@zcloak/ctype`](packages/ctype) | [![npm](https://img.shields.io/npm/v/@zcloak/ctype)](https://www.npmjs.com/package/@zcloak/ctype) | [![beta](https://img.shields.io/npm/v/@zcloak/ctype/beta)](https://www.npmjs.com/package/@zcloak/ctype) | [![minzip](https://img.shields.io/bundlephobia/minzip/@zcloak/ctype)](https://bundlephobia.com/result?p=@zcloak/ctype) |
|  [`@zcloak/did`](packages/did) | [![npm](https://img.shields.io/npm/v/@zcloak/did)](https://www.npmjs.com/package/@zcloak/did) | [![beta](https://img.shields.io/npm/v/@zcloak/did/beta)](https://www.npmjs.com/package/@zcloak/did) | [![minzip](https://img.shields.io/bundlephobia/minzip/@zcloak/did)](https://bundlephobia.com/result?p=@zcloak/did) |
|  [`@zcloak/did-resolver`](packages/did-resolver) | [![npm](https://img.shields.io/npm/v/@zcloak/did-resolver)](https://www.npmjs.com/package/@zcloak/did-resolver) | [![beta](https://img.shields.io/npm/v/@zcloak/did-resolver/beta)](https://www.npmjs.com/package/@zcloak/did-resolver) | [![minzip](https://img.shields.io/bundlephobia/minzip/@zcloak/did-resolver)](https://bundlephobia.com/result?p=@zcloak/did-resolver) |
|  [`@zcloak/keyring`](packages/keyring) | [![npm](https://img.shields.io/npm/v/@zcloak/keyring)](https://www.npmjs.com/package/@zcloak/keyring) | [![beta](https://img.shields.io/npm/v/@zcloak/keyring/beta)](https://www.npmjs.com/package/@zcloak/keyring) | [![minzip](https://img.shields.io/bundlephobia/minzip/@zcloak/keyring)](https://bundlephobia.com/result?p=@zcloak/keyring) |
|  [`@zcloak/message`](packages/message) | [![npm](https://img.shields.io/npm/v/@zcloak/message)](https://www.npmjs.com/package/@zcloak/message) | [![beta](https://img.shields.io/npm/v/@zcloak/message/beta)](https://www.npmjs.com/package/@zcloak/message) | [![minzip](https://img.shields.io/bundlephobia/minzip/@zcloak/message)](https://bundlephobia.com/result?p=@zcloak/message) |
|  [`@zcloak/vc`](packages/vc) | [![npm](https://img.shields.io/npm/v/@zcloak/vc)](https://www.npmjs.com/package/@zcloak/vc) | [![beta](https://img.shields.io/npm/v/@zcloak/vc/beta)](https://www.npmjs.com/package/@zcloak/vc) | [![minzip](https://img.shields.io/bundlephobia/minzip/@zcloak/vc)](https://bundlephobia.com/result?p=@zcloak/vc) |
|  [`@zcloak/verify`](packages/verify) | [![npm](https://img.shields.io/npm/v/@zcloak/verify)](https://www.npmjs.com/package/@zcloak/verify) | [![beta](https://img.shields.io/npm/v/@zcloak/verify/beta)](https://www.npmjs.com/package/@zcloak/verify) | [![minzip](https://img.shields.io/bundlephobia/minzip/@zcloak/verify)](https://bundlephobia.com/result?p=@zcloak/verify) |
|  [`@zcloak/wasm`](packages/wasm) | [![npm](https://img.shields.io/npm/v/@zcloak/wasm)](https://www.npmjs.com/package/@zcloak/wasm) | [![beta](https://img.shields.io/npm/v/@zcloak/wasm/beta)](https://www.npmjs.com/package/@zcloak/wasm) | [![minzip](https://img.shields.io/bundlephobia/minzip/@zcloak/wasm)](https://bundlephobia.com/result?p=@zcloak/wasm) |
|  [`@zcloak/wasm-asm`](packages/wasm-asm) | [![npm](https://img.shields.io/npm/v/@zcloak/wasm-asm)](https://www.npmjs.com/package/@zcloak/wasm-asm) | [![beta](https://img.shields.io/npm/v/@zcloak/wasm-asm/beta)](https://www.npmjs.com/package/@zcloak/wasm-asm) | [![minzip](https://img.shields.io/bundlephobia/minzip/@zcloak/wasm-asm)](https://bundlephobia.com/result?p=@zcloak/wasm-asm) |
|  [`@zcloak/wasm-bridge`](packages/wasm-bridge) | [![npm](https://img.shields.io/npm/v/@zcloak/wasm-bridge)](https://www.npmjs.com/package/@zcloak/wasm-bridge) | [![beta](https://img.shields.io/npm/v/@zcloak/wasm-bridge/beta)](https://www.npmjs.com/package/@zcloak/wasm-bridge) | [![minzip](https://img.shields.io/bundlephobia/minzip/@zcloak/wasm-bridge)](https://bundlephobia.com/result?p=@zcloak/wasm-bridge) |

## CONTRIBUTING

See [CONTRIBUTING.md](./CONTRIBUTING.md)

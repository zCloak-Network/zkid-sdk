# @zcloak/vc

## 1.0.0-beta.1

### Minor Changes

- [#44](https://github.com/zCloak-Network/zkid-sdk/pull/44) [`e953dfb`](https://github.com/zCloak-Network/zkid-sdk/commit/e953dfb95b427bc94315600657c5c706b8211d50) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - upgrade vc version to v1

  1. add issuance date param whencalc digest.
  2. When there are multiple versions of vc, there are different build logics. The difference between v1 and v2 is that the digest is constructed differently
  3. vcVerify function can pass `version`(VerifiableCredentialVersion) for verification.

- [#42](https://github.com/zCloak-Network/zkid-sdk/pull/42) [`ddaa837`](https://github.com/zCloak-Network/zkid-sdk/commit/ddaa837bb71bf1558eed2e85621cf9d83fe07d83) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - - The param `nonceMap` of `calcRoothash` function is optional.

  - Add `PublicVerifiableCredential`, `VerifiableCredentialBuilder.build` allow `isPublic` param, `true` build `PublicVerifiableCredential`, `false` build `PrivateVerifiableCredential`.
  - vcVerify support verify `PublicVerifiableCredential`.

- [#45](https://github.com/zCloak-Network/zkid-sdk/pull/45) [`872ed45`](https://github.com/zCloak-Network/zkid-sdk/commit/872ed4500aeefb8d5d68cca7b94b2248092b23cb) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - Data signing.

  - add [eip712](https://eips.ethereum.org/EIPS/eip-712) typed struct data hashing.
  - add signTypedData for DidKeyring.
  - vc, vp, ctype, did-document supports signTypedData.
  - verify functions support TypedData.

### Patch Changes

- Updated dependencies [[`872ed45`](https://github.com/zCloak-Network/zkid-sdk/commit/872ed4500aeefb8d5d68cca7b94b2248092b23cb)]:
  - @zcloak/crypto@1.0.0-beta.1
  - @zcloak/ctype@1.0.0-beta.1
  - @zcloak/did@1.0.0-beta.1

## 1.0.0-beta.0

### Major Changes

- [#39](https://github.com/zCloak-Network/zkid-sdk/pull/39) [`71a0f07`](https://github.com/zCloak-Network/zkid-sdk/commit/71a0f077b1b4629fc44c351307333ae196e2ad58) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - Config changeset and prepare to coding v1.

### Patch Changes

- Updated dependencies [[`71a0f07`](https://github.com/zCloak-Network/zkid-sdk/commit/71a0f077b1b4629fc44c351307333ae196e2ad58)]:
  - @zcloak/crypto@1.0.0-beta.0
  - @zcloak/ctype@1.0.0-beta.0
  - @zcloak/did@1.0.0-beta.0
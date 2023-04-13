# @zcloak/did-resolver

## 1.1.0

### Minor Changes

- [#54](https://github.com/zCloak-Network/zkid-sdk/pull/54) [`e259185`](https://github.com/zCloak-Network/zkid-sdk/commit/e259185927d3c10a3e899493cfaf6e02c045bd6b) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - Sining Data change, replace eip712 to eip191.

  - use eip191 to sign data when use `EcdsaSecp256k1VerificationKey2019` VerificationMethodType.
  - upgrade vp version to `1`.
  - verify functions support eip191 message.
  - ctype, document add version field, default to set `0`.

## 1.0.0

### Major Changes

- [#39](https://github.com/zCloak-Network/zkid-sdk/pull/39) [`71a0f07`](https://github.com/zCloak-Network/zkid-sdk/commit/71a0f077b1b4629fc44c351307333ae196e2ad58) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - Config changeset and prepare to coding v1.

### Minor Changes

- [#45](https://github.com/zCloak-Network/zkid-sdk/pull/45) [`872ed45`](https://github.com/zCloak-Network/zkid-sdk/commit/872ed4500aeefb8d5d68cca7b94b2248092b23cb) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - Data signing.

  - add [eip712](https://eips.ethereum.org/EIPS/eip-712) typed struct data hashing.
  - add signTypedData for DidKeyring.
  - vc, vp, ctype, did-document supports signTypedData.
  - verify functions support TypedData.

## 1.0.0-beta.1

### Minor Changes

- [#45](https://github.com/zCloak-Network/zkid-sdk/pull/45) [`872ed45`](https://github.com/zCloak-Network/zkid-sdk/commit/872ed4500aeefb8d5d68cca7b94b2248092b23cb) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - Data signing.

  - add [eip712](https://eips.ethereum.org/EIPS/eip-712) typed struct data hashing.
  - add signTypedData for DidKeyring.
  - vc, vp, ctype, did-document supports signTypedData.
  - verify functions support TypedData.

## 1.0.0-beta.0

### Major Changes

- [#39](https://github.com/zCloak-Network/zkid-sdk/pull/39) [`71a0f07`](https://github.com/zCloak-Network/zkid-sdk/commit/71a0f077b1b4629fc44c351307333ae196e2ad58) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - Config changeset and prepare to coding v1.

# @zcloak/ctype

## 1.2.1

### Patch Changes

- Updated dependencies [[`2687ad9`](https://github.com/zCloak-Network/zkid-sdk/commit/2687ad9b3633a1b5ac10de5890c0c1be19cbbc37)]:
  - @zcloak/did@1.2.1

## 1.2.0

### Minor Changes

- [#58](https://github.com/zCloak-Network/zkid-sdk/pull/58) [`c3ad20f`](https://github.com/zCloak-Network/zkid-sdk/commit/c3ad20feaf1d5487d439667162e93c22493c417b) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - add controller sign key for did keyring

  1. publish did document default to use controller key
  2. vp presentation default to use controller key
  3. publish ctype default to use controller key
  4. try to use assertionMethod, if it not exist, use controller to sign vc

### Patch Changes

- Updated dependencies [[`c3ad20f`](https://github.com/zCloak-Network/zkid-sdk/commit/c3ad20feaf1d5487d439667162e93c22493c417b)]:
  - @zcloak/crypto@1.2.0
  - @zcloak/did@1.2.0

## 1.1.0

### Minor Changes

- [#54](https://github.com/zCloak-Network/zkid-sdk/pull/54) [`e259185`](https://github.com/zCloak-Network/zkid-sdk/commit/e259185927d3c10a3e899493cfaf6e02c045bd6b) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - Sining Data change, replace eip712 to eip191.

  - use eip191 to sign data when use `EcdsaSecp256k1VerificationKey2019` VerificationMethodType.
  - upgrade vp version to `1`.
  - verify functions support eip191 message.
  - ctype, document add version field, default to set `0`.

### Patch Changes

- Updated dependencies [[`e259185`](https://github.com/zCloak-Network/zkid-sdk/commit/e259185927d3c10a3e899493cfaf6e02c045bd6b), [`579c000`](https://github.com/zCloak-Network/zkid-sdk/commit/579c00075c4e52e2bdc6bfe920ed905035663772), [`7a4b2e3`](https://github.com/zCloak-Network/zkid-sdk/commit/7a4b2e37d5d35101cde6a3c531972f0949f2df67)]:
  - @zcloak/did-resolver@1.1.0
  - @zcloak/crypto@1.1.0
  - @zcloak/did@1.1.0

## 1.0.0

### Major Changes

- [#39](https://github.com/zCloak-Network/zkid-sdk/pull/39) [`71a0f07`](https://github.com/zCloak-Network/zkid-sdk/commit/71a0f077b1b4629fc44c351307333ae196e2ad58) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - Config changeset and prepare to coding v1.

### Minor Changes

- [#45](https://github.com/zCloak-Network/zkid-sdk/pull/45) [`872ed45`](https://github.com/zCloak-Network/zkid-sdk/commit/872ed4500aeefb8d5d68cca7b94b2248092b23cb) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - Data signing.

  - add [eip712](https://eips.ethereum.org/EIPS/eip-712) typed struct data hashing.
  - add signTypedData for DidKeyring.
  - vc, vp, ctype, did-document supports signTypedData.
  - verify functions support TypedData.

### Patch Changes

- Updated dependencies [[`71a0f07`](https://github.com/zCloak-Network/zkid-sdk/commit/71a0f077b1b4629fc44c351307333ae196e2ad58), [`872ed45`](https://github.com/zCloak-Network/zkid-sdk/commit/872ed4500aeefb8d5d68cca7b94b2248092b23cb), [`f52b7a7`](https://github.com/zCloak-Network/zkid-sdk/commit/f52b7a774c48222cf861426467442f530c0783a4)]:
  - @zcloak/did-resolver@1.0.0
  - @zcloak/crypto@1.0.0
  - @zcloak/did@1.0.0

## 1.0.0-beta.2

### Patch Changes

- Updated dependencies [[`f52b7a7`](https://github.com/zCloak-Network/zkid-sdk/commit/f52b7a774c48222cf861426467442f530c0783a4)]:
  - @zcloak/crypto@1.0.0-beta.2
  - @zcloak/did@1.0.0-beta.2

## 1.0.0-beta.1

### Minor Changes

- [#45](https://github.com/zCloak-Network/zkid-sdk/pull/45) [`872ed45`](https://github.com/zCloak-Network/zkid-sdk/commit/872ed4500aeefb8d5d68cca7b94b2248092b23cb) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - Data signing.

  - add [eip712](https://eips.ethereum.org/EIPS/eip-712) typed struct data hashing.
  - add signTypedData for DidKeyring.
  - vc, vp, ctype, did-document supports signTypedData.
  - verify functions support TypedData.

### Patch Changes

- Updated dependencies [[`872ed45`](https://github.com/zCloak-Network/zkid-sdk/commit/872ed4500aeefb8d5d68cca7b94b2248092b23cb)]:
  - @zcloak/did-resolver@1.0.0-beta.1
  - @zcloak/crypto@1.0.0-beta.1
  - @zcloak/did@1.0.0-beta.1

## 1.0.0-beta.0

### Major Changes

- [#39](https://github.com/zCloak-Network/zkid-sdk/pull/39) [`71a0f07`](https://github.com/zCloak-Network/zkid-sdk/commit/71a0f077b1b4629fc44c351307333ae196e2ad58) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - Config changeset and prepare to coding v1.

### Patch Changes

- Updated dependencies [[`71a0f07`](https://github.com/zCloak-Network/zkid-sdk/commit/71a0f077b1b4629fc44c351307333ae196e2ad58)]:
  - @zcloak/did-resolver@1.0.0-beta.0
  - @zcloak/crypto@1.0.0-beta.0
  - @zcloak/did@1.0.0-beta.0

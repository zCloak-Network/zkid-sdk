# @zcloak/message

## 1.0.8

### Patch Changes

- [`f4497d8`](https://github.com/zCloak-Network/zkid-sdk/commit/f4497d8b04383507ac068e28f67f6c9539e4b2b7) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - fix esm build assets

- Updated dependencies [[`f4497d8`](https://github.com/zCloak-Network/zkid-sdk/commit/f4497d8b04383507ac068e28f67f6c9539e4b2b7)]:
  - @zcloak/did@1.3.3
  - @zcloak/did-resolver@1.1.2
  - @zcloak/vc@1.2.6
  - @zcloak/crypto@1.2.3

## 1.0.7

### Patch Changes

- [#67](https://github.com/zCloak-Network/zkid-sdk/pull/67) [`1636328`](https://github.com/zCloak-Network/zkid-sdk/commit/1636328030fc894ed68186e01113211cdf73c5da) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - import zkid-login to repo

- Updated dependencies [[`1636328`](https://github.com/zCloak-Network/zkid-sdk/commit/1636328030fc894ed68186e01113211cdf73c5da)]:
  - @zcloak/did@1.3.2
  - @zcloak/did-resolver@1.1.1
  - @zcloak/vc@1.2.5
  - @zcloak/crypto@1.2.2

## 1.0.6

### Patch Changes

- Updated dependencies [[`dee583c`](https://github.com/zCloak-Network/zkid-sdk/commit/dee583c310db267baa744eece9802f3ccc384d1d)]:
  - @zcloak/crypto@1.2.1
  - @zcloak/did@1.3.1
  - @zcloak/vc@1.2.4

## 1.0.5

### Patch Changes

- Updated dependencies [[`fe54b0c`](https://github.com/zCloak-Network/zkid-sdk/commit/fe54b0cbcfd99d409c7b8708f2f74cea9405d98b)]:
  - @zcloak/did@1.3.0
  - @zcloak/vc@1.2.3

## 1.0.4

### Patch Changes

- Updated dependencies [[`2687ad9`](https://github.com/zCloak-Network/zkid-sdk/commit/2687ad9b3633a1b5ac10de5890c0c1be19cbbc37)]:
  - @zcloak/did@1.2.1
  - @zcloak/vc@1.2.2

## 1.0.3

### Patch Changes

- Updated dependencies [[`a3a14b8`](https://github.com/zCloak-Network/zkid-sdk/commit/a3a14b8c1bce5728ee70f1fc55fd3bcc88961dbd)]:
  - @zcloak/vc@1.2.1

## 1.0.2

### Patch Changes

- Updated dependencies [[`c3ad20f`](https://github.com/zCloak-Network/zkid-sdk/commit/c3ad20feaf1d5487d439667162e93c22493c417b)]:
  - @zcloak/crypto@1.2.0
  - @zcloak/did@1.2.0
  - @zcloak/vc@1.2.0

## 1.0.1

### Patch Changes

- Updated dependencies [[`7a4b2e3`](https://github.com/zCloak-Network/zkid-sdk/commit/7a4b2e37d5d35101cde6a3c531972f0949f2df67), [`e259185`](https://github.com/zCloak-Network/zkid-sdk/commit/e259185927d3c10a3e899493cfaf6e02c045bd6b), [`579c000`](https://github.com/zCloak-Network/zkid-sdk/commit/579c00075c4e52e2bdc6bfe920ed905035663772), [`7a4b2e3`](https://github.com/zCloak-Network/zkid-sdk/commit/7a4b2e37d5d35101cde6a3c531972f0949f2df67)]:
  - @zcloak/vc@1.1.0
  - @zcloak/did-resolver@1.1.0
  - @zcloak/crypto@1.1.0
  - @zcloak/did@1.1.0

## 1.0.0

### Major Changes

- [#39](https://github.com/zCloak-Network/zkid-sdk/pull/39) [`71a0f07`](https://github.com/zCloak-Network/zkid-sdk/commit/71a0f077b1b4629fc44c351307333ae196e2ad58) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - Config changeset and prepare to coding v1.

### Minor Changes

- [#42](https://github.com/zCloak-Network/zkid-sdk/pull/42) [`ddaa837`](https://github.com/zCloak-Network/zkid-sdk/commit/ddaa837bb71bf1558eed2e85621cf9d83fe07d83) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - - The param `nonceMap` of `calcRoothash` function is optional.

  - Add `PublicVerifiableCredential`, `VerifiableCredentialBuilder.build` allow `isPublic` param, `true` build `PublicVerifiableCredential`, `false` build `PrivateVerifiableCredential`.
  - vcVerify support verify `PublicVerifiableCredential`.

- [#45](https://github.com/zCloak-Network/zkid-sdk/pull/45) [`872ed45`](https://github.com/zCloak-Network/zkid-sdk/commit/872ed4500aeefb8d5d68cca7b94b2248092b23cb) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - Data signing.

  - add [eip712](https://eips.ethereum.org/EIPS/eip-712) typed struct data hashing.
  - add signTypedData for DidKeyring.
  - vc, vp, ctype, did-document supports signTypedData.
  - verify functions support TypedData.

### Patch Changes

- Updated dependencies [[`e953dfb`](https://github.com/zCloak-Network/zkid-sdk/commit/e953dfb95b427bc94315600657c5c706b8211d50), [`258e259`](https://github.com/zCloak-Network/zkid-sdk/commit/258e25907ca5d5a2954bc174173f41c668dab4ff), [`ddaa837`](https://github.com/zCloak-Network/zkid-sdk/commit/ddaa837bb71bf1558eed2e85621cf9d83fe07d83), [`71a0f07`](https://github.com/zCloak-Network/zkid-sdk/commit/71a0f077b1b4629fc44c351307333ae196e2ad58), [`872ed45`](https://github.com/zCloak-Network/zkid-sdk/commit/872ed4500aeefb8d5d68cca7b94b2248092b23cb), [`f52b7a7`](https://github.com/zCloak-Network/zkid-sdk/commit/f52b7a774c48222cf861426467442f530c0783a4), [`66c7c43`](https://github.com/zCloak-Network/zkid-sdk/commit/66c7c4388adc6f34cace0c00902e70512b090a3e)]:
  - @zcloak/vc@1.0.0
  - @zcloak/did-resolver@1.0.0
  - @zcloak/crypto@1.0.0
  - @zcloak/did@1.0.0

## 1.0.0-beta.4

### Patch Changes

- Updated dependencies [[`258e259`](https://github.com/zCloak-Network/zkid-sdk/commit/258e25907ca5d5a2954bc174173f41c668dab4ff)]:
  - @zcloak/vc@1.0.0-beta.4

## 1.0.0-beta.3

### Patch Changes

- Updated dependencies [[`f52b7a7`](https://github.com/zCloak-Network/zkid-sdk/commit/f52b7a774c48222cf861426467442f530c0783a4)]:
  - @zcloak/crypto@1.0.0-beta.2
  - @zcloak/did@1.0.0-beta.2
  - @zcloak/vc@1.0.0-beta.3

## 1.0.0-beta.2

### Patch Changes

- Updated dependencies [[`66c7c43`](https://github.com/zCloak-Network/zkid-sdk/commit/66c7c4388adc6f34cace0c00902e70512b090a3e)]:
  - @zcloak/vc@1.0.0-beta.2

## 1.0.0-beta.1

### Minor Changes

- [#42](https://github.com/zCloak-Network/zkid-sdk/pull/42) [`ddaa837`](https://github.com/zCloak-Network/zkid-sdk/commit/ddaa837bb71bf1558eed2e85621cf9d83fe07d83) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - - The param `nonceMap` of `calcRoothash` function is optional.

  - Add `PublicVerifiableCredential`, `VerifiableCredentialBuilder.build` allow `isPublic` param, `true` build `PublicVerifiableCredential`, `false` build `PrivateVerifiableCredential`.
  - vcVerify support verify `PublicVerifiableCredential`.

- [#45](https://github.com/zCloak-Network/zkid-sdk/pull/45) [`872ed45`](https://github.com/zCloak-Network/zkid-sdk/commit/872ed4500aeefb8d5d68cca7b94b2248092b23cb) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - Data signing.

  - add [eip712](https://eips.ethereum.org/EIPS/eip-712) typed struct data hashing.
  - add signTypedData for DidKeyring.
  - vc, vp, ctype, did-document supports signTypedData.
  - verify functions support TypedData.

### Patch Changes

- Updated dependencies [[`e953dfb`](https://github.com/zCloak-Network/zkid-sdk/commit/e953dfb95b427bc94315600657c5c706b8211d50), [`ddaa837`](https://github.com/zCloak-Network/zkid-sdk/commit/ddaa837bb71bf1558eed2e85621cf9d83fe07d83), [`872ed45`](https://github.com/zCloak-Network/zkid-sdk/commit/872ed4500aeefb8d5d68cca7b94b2248092b23cb)]:
  - @zcloak/vc@1.0.0-beta.1
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
  - @zcloak/verify@1.0.0-beta.0
  - @zcloak/did@1.0.0-beta.0
  - @zcloak/vc@1.0.0-beta.0

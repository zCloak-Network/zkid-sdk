# @zcloak/did

## 1.3.4

### Patch Changes

- Updated dependencies [[`b7987d7`](https://github.com/zCloak-Network/zkid-sdk/commit/b7987d7ce3923226f607d8fe1bf7e5529730e8e3)]:
  - @zcloak/crypto@1.2.4
  - @zcloak/keyring@1.1.4

## 1.3.3

### Patch Changes

- [`f4497d8`](https://github.com/zCloak-Network/zkid-sdk/commit/f4497d8b04383507ac068e28f67f6c9539e4b2b7) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - fix esm build assets

- Updated dependencies [[`f4497d8`](https://github.com/zCloak-Network/zkid-sdk/commit/f4497d8b04383507ac068e28f67f6c9539e4b2b7)]:
  - @zcloak/did-resolver@1.1.2
  - @zcloak/crypto@1.2.3
  - @zcloak/keyring@1.1.3

## 1.3.2

### Patch Changes

- [#67](https://github.com/zCloak-Network/zkid-sdk/pull/67) [`1636328`](https://github.com/zCloak-Network/zkid-sdk/commit/1636328030fc894ed68186e01113211cdf73c5da) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - import zkid-login to repo

- Updated dependencies [[`1636328`](https://github.com/zCloak-Network/zkid-sdk/commit/1636328030fc894ed68186e01113211cdf73c5da)]:
  - @zcloak/did-resolver@1.1.1
  - @zcloak/crypto@1.2.2
  - @zcloak/keyring@1.1.2

## 1.3.1

### Patch Changes

- Updated dependencies [[`dee583c`](https://github.com/zCloak-Network/zkid-sdk/commit/dee583c310db267baa744eece9802f3ccc384d1d)]:
  - @zcloak/crypto@1.2.1
  - @zcloak/keyring@1.1.1

## 1.3.0

### Minor Changes

- [#62](https://github.com/zCloak-Network/zkid-sdk/pull/62) [`fe54b0c`](https://github.com/zCloak-Network/zkid-sdk/commit/fe54b0cbcfd99d409c7b8708f2f74cea9405d98b) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - change fromDid function: if not query did document, use no document did.

## 1.2.1

### Patch Changes

- [`2687ad9`](https://github.com/zCloak-Network/zkid-sdk/commit/2687ad9b3633a1b5ac10de5890c0c1be19cbbc37) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - add pair after unlock

## 1.2.0

### Minor Changes

- [#58](https://github.com/zCloak-Network/zkid-sdk/pull/58) [`c3ad20f`](https://github.com/zCloak-Network/zkid-sdk/commit/c3ad20feaf1d5487d439667162e93c22493c417b) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - add controller sign key for did keyring

  1. publish did document default to use controller key
  2. vp presentation default to use controller key
  3. publish ctype default to use controller key
  4. try to use assertionMethod, if it not exist, use controller to sign vc

### Patch Changes

- Updated dependencies [[`c3ad20f`](https://github.com/zCloak-Network/zkid-sdk/commit/c3ad20feaf1d5487d439667162e93c22493c417b), [`c3ad20f`](https://github.com/zCloak-Network/zkid-sdk/commit/c3ad20feaf1d5487d439667162e93c22493c417b)]:
  - @zcloak/crypto@1.2.0
  - @zcloak/keyring@1.1.0

## 1.1.0

### Minor Changes

- [#54](https://github.com/zCloak-Network/zkid-sdk/pull/54) [`e259185`](https://github.com/zCloak-Network/zkid-sdk/commit/e259185927d3c10a3e899493cfaf6e02c045bd6b) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - Sining Data change, replace eip712 to eip191.

  - use eip191 to sign data when use `EcdsaSecp256k1VerificationKey2019` VerificationMethodType.
  - upgrade vp version to `1`.
  - verify functions support eip191 message.
  - ctype, document add version field, default to set `0`.

- [#57](https://github.com/zCloak-Network/zkid-sdk/pull/57) [`579c000`](https://github.com/zCloak-Network/zkid-sdk/commit/579c00075c4e52e2bdc6bfe920ed905035663772) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - remove helper.createEcdsaFromMnemonic function, instead to use keys.fromMnemonic.

- [#56](https://github.com/zCloak-Network/zkid-sdk/pull/56) [`7a4b2e3`](https://github.com/zCloak-Network/zkid-sdk/commit/7a4b2e37d5d35101cde6a3c531972f0949f2df67) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - encodeDidUrl: the identifier as HexString, and prefix is `did:zk`.

### Patch Changes

- Updated dependencies [[`e259185`](https://github.com/zCloak-Network/zkid-sdk/commit/e259185927d3c10a3e899493cfaf6e02c045bd6b)]:
  - @zcloak/did-resolver@1.1.0
  - @zcloak/crypto@1.1.0
  - @zcloak/keyring@1.0.1

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
  - @zcloak/keyring@1.0.0
  - @zcloak/crypto@1.0.0

## 1.0.0-beta.2

### Patch Changes

- Updated dependencies [[`f52b7a7`](https://github.com/zCloak-Network/zkid-sdk/commit/f52b7a774c48222cf861426467442f530c0783a4)]:
  - @zcloak/keyring@1.0.0-beta.2
  - @zcloak/crypto@1.0.0-beta.2

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
  - @zcloak/keyring@1.0.0-beta.1
  - @zcloak/crypto@1.0.0-beta.1

## 1.0.0-beta.0

### Major Changes

- [#39](https://github.com/zCloak-Network/zkid-sdk/pull/39) [`71a0f07`](https://github.com/zCloak-Network/zkid-sdk/commit/71a0f077b1b4629fc44c351307333ae196e2ad58) Thanks [@zzcwoshizz](https://github.com/zzcwoshizz)! - Config changeset and prepare to coding v1.

### Patch Changes

- Updated dependencies [[`71a0f07`](https://github.com/zCloak-Network/zkid-sdk/commit/71a0f077b1b4629fc44c351307333ae196e2ad58)]:
  - @zcloak/did-resolver@1.0.0-beta.0
  - @zcloak/keyring@1.0.0-beta.0
  - @zcloak/crypto@1.0.0-beta.0

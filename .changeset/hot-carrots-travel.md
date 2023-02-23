---
'@zcloak/did-resolver': minor
'@zcloak/crypto': minor
'@zcloak/verify': minor
'@zcloak/ctype': minor
'@zcloak/did': minor
'@zcloak/vc': minor
---

Sining Data change, replace eip712 to eip191.

- use eip191 to sign data when use `EcdsaSecp256k1VerificationKey2019` VerificationMethodType.
- upgrade vp version to `1`.
- verify functions support eip191 message.
- ctype, document add version field, default to set `0`.

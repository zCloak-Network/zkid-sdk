---
'@zcloak/verify': minor
'@zcloak/vc': minor
---

upgrade vc version to v1

1. add issuance date param whencalc digest.
2. When there are multiple versions of vc, there are different build logics. The difference between v1 and v2 is that the digest is constructed differently
3. vcVerify function can pass `version`(VerifiableCredentialVersion) for verification.

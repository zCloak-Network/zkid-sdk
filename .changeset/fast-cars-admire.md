---
'@zcloak/message': minor
'@zcloak/verify': minor
'@zcloak/vc': minor
---

- The param `nonceMap` of `calcRoothash` function is optional.
- Add `PublicVerifiableCredential`, `VerifiableCredentialBuilder.build` allow `isPublic` param, `true` build `PublicVerifiableCredential`, `false` build `PrivateVerifiableCredential`.
- vcVerify support verify `PublicVerifiableCredential`.

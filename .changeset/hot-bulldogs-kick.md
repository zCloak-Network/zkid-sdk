---
'@zcloak/crypto': minor
'@zcloak/verify': minor
'@zcloak/ctype': minor
'@zcloak/did': minor
'@zcloak/vc': minor
---

add controller sign key for did keyring

1. publish did document default to use controller key
2. vp presentation default to use controller key
3. publish ctype default to use controller key
4. try to use assertionMethod, if it not exist, use controller to sign vc

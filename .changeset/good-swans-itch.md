---
"@zcloak/vc": patch
---

fix if there are multiple same subject values in `vc`, the nonces will be empty when parse `vc` to `miden_input`.

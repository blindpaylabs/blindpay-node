---
"blindpay": patch
---

Remove stale `signed_agreement_id` from `CreateVirtualAccountRequest`. The field was moved to an internal compliance flow and is not part of the public virtual account creation API.

---
"@blindpay/node": major
---

More fields the API can return or accept as `null` are typed that way: the spec marks them nullable through a reference or an `anyOf`, which the type sync used to miss.

**Breaking:**

- `Payable.bank_account`, and `cnae_condition` and `virtual_account_preapproval` on every customer type, can now be `null`.

**Additive:**

- `date_of_birth` on `CreateAchInput`, `CreateWireInput`, `CreateRtpInput` and `CreateInternationalSwiftInput`, and `date_of_birth`/`formation_date` on `UpdateCustomerInput`, accept `null`.

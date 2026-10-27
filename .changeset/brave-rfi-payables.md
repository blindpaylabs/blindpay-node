---
"@blindpay/node": minor
---

Cover the current BlindPay public API:

- `blindpay.payables`: `list`, `create`, `get` and `delete`.
- `blindpay.instances.rfi` and `blindpay.customers.rfi`: `get` the open request for information and `submit` a response. `KycStatus` gains `"approved_rfi"`.
- `blindpay.instances.get()` and `blindpay.instances.onboarding`: `getBusinessDetails`, `getBusinessProfile` and `getOwnershipDocuments`.
- `blindpay.wallets.custodial.getDeposits()`, and `yield_status` on custodial wallets.
- `blindpay.upload.presign()` and `blindpay.upload.analyze()`.
- `blindpay.customers.bankAccounts.createPlaid()`.
- Customer `virtual_account_preapproval` and `cnae_condition`, and multiple `supporting_documents` on limit-increase requests.
- `CreateQuoteInput` now only requires `network` and `token`, so a quote can be created for a `payable_id` instead of a bank account.

Endpoints the API marks `x-sdk: false` (yield, simulated SPEI/Bre-B deposits, card payments, ToS passthrough and `upload/extract`) stay out of the SDK.

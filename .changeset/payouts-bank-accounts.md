---
"@blindpay/node": major
---

Bank account and payout types now match the API.

**Breaking:**

- `bankAccounts.get` returns the same bank account shape as `bankAccounts.list` (new exported type `BankAccount`). The old `GetBankAccountResponse` fields the API never returned (`customer_id`, `account_holder_name`, `bank_name`, `swift_code`, `iban`, `is_primary`, `updated_at`) are gone.
- `bankAccounts.delete` and `payouts.submitDocuments` now resolve to `{ success: boolean }` (`SuccessResponse`). `SubmitPayoutDocumentsResponse` no longer has an `id`.
- `ListBankAccountsInput.status` only accepts a `BankAccountStatus` (`verifying`, `approved`, `rejected`, `deprecated`) instead of any string.
- `ListBankAccountsResponse[].swift_intermediary_bank_swift_code_bic` can be `null`.
- `createTed` requires `account_number` and `account_type`, which the API needs to create a TED account.
- On the payout tracking objects (`PayoutTrackingTransaction`, `PayoutTrackingPayment`, `PayoutTrackingLiquidity`, `PayoutTrackingComplete`, `PayoutTrackingPartnerFee`) only `step` is always present; every other key is now optional, since the API can leave it out.

**Additive:**

- New `bankAccounts.createFasterPayments` creates a UK Faster Payments bank account.
- `ListBankAccountsResponse` items carry the SEPA fields (`sepa_iban`, `sepa_beneficiary_legal_name`, beneficiary address, city, region, postal code and country).
- `CreateTedResponse` includes `account_number` and `account_type`.
- `payouts.list` accepts the `status`, `customer_name`, `bank_account_id`, `country`, `payment_method`, `network` and `token` filters.
- `payouts.createEvm`, `createStellar`, `createSolana` and `authorizeStellarToken` no longer require `sender_wallet_address`: pass it or a BlindPay-managed `wallet_id`. `createSolana`'s `signed_transaction` is optional.

---
"@blindpay/node": major
---

Aligned payins, virtual accounts, wallets, transfers, payables, billing fees and partner fees with the API.

**Breaking:**

- `VirtualAccount.us` can now be `null` or absent: Bre-B and SPEI virtual accounts return no US bank details. Inside it, only `wire` is always present; `ach`, `rtp`, `beneficiary`, `receiving_bank`, `swift_bic_code` and `account_type` can be `null` or absent, and `receiving_bank.address_line_2` can be `null`. `account_type` is now typed as `"Personal checking" | "Business checking"`. `blockchain_wallet.address` can be `null` or absent.
- `CreatePayinQuoteInput.blockchain_wallet_id`, `cover_fees` and `partner_fee_id` are now optional.
- Removed the unused `CreatePayinInput` type. Use `payins.createEvm(payin_quote_id)` to create a payin.
- `MintUsdbStellarInput.signedXdr` is now optional.
- `PrepareSolanaDelegationTransactionInput.token_address` and `amount` are now optional.
- `MintUsdbSolanaResponse.signature` and `error` are now optional.
- `WalletTokenBalance.earning_amount` and `total_amount` are now always present.
- `GetFeesResponse.faster_payments` is now a `FeeOptions` object instead of a string, and `sepa` is always present. `ted` can now be `null` or absent.
- Removed `evm_wallet_address` and `stellar_wallet_address` from `CreatePartnerFeeInput` and from the partner fee list, create and get responses. The API never accepted or returned them.
- `Payable.from`, `Payable.to`, `CreatePayableInput.from` and `CreatePayableInput.to` can now be `null`.
- `wallets.blockchain.delete`, `virtualAccounts.update`, `partnerFees.delete` and `wallets.blockchain.mintUsdbStellar` now resolve to `{ success: boolean }` (`SuccessResponse`) instead of `void`.
- `wallets.blockchain.mintUsdbSolana` now resolves to `MintUsdbSolanaResponse` instead of `void`.

**Added:**

- `payins.list` accepts the `customer_name`, `bank_account_id`, `country`, `payment_method`, `network` and `token` filters.
- `transfers.list` accepts the `customer_id`, `wallet_id`, `status`, `network` and `token` filters.
- `PrepareSolanaDelegationTransactionInput.quote_id`, the recommended way to prepare a delegation.
- `VirtualAccount.us.swift_intermediary_bank`.
- `wallets.custodial.delete` now uses the shared `SuccessResponse` type; its shape is unchanged.

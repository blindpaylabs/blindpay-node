---
"@blindpay/node": major
---

Types now match the OpenAPI spec's nullability and enums.

**Breaking:**

- 313 response fields the API can return as `null` are now typed `| null` (e.g. `VirtualAccount.kyc_status`, `Payout.tracking_liquidity`, `CreateQuoteResponse.expires_at`). Code that reads them without a null check stops compiling. This includes the shared `PaginationMetadata.next_page` and `.prev_page`, so every paginated `list` response is affected, and `PayoutTrackingTransaction.status`.
- Response fields that were a bare `string` now use the union the API guarantees: `GetRailsResponse[].country` (`Country`), `ListBankAccountsResponse[].spei_protocol` (`SpeiProtocol`), `.business_industry` (`BusinessIndustry`), `.status` (new `BankAccountStatus`), `IndividualWithEnhancedKYC.source_of_funds_doc_type` (`SourceOfFundsDocType`), and `Payout.ach_cop_document_type` (`AchCopDocument`).

- `BankingPartner` no longer includes `"ssb"`: the API stopped returning it.

**Additive:**

- 141 input fields the API accepts as `null` now allow `| null`.
- New enum members: 25 `BankDetailKey` values (SEPA, PIX Safe, TED and more), 9 `LimitIncreaseRequestSupportingDocumentType` values, `BusinessIndustry` `"446120"`, and `EstimatedTimeOfArrival` `"5_30_min"`.
- New exported type `BankAccountStatus`.

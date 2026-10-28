# @blindpay/node

## 6.0.0

### Major Changes

- [#83](https://github.com/blindpaylabs/blindpay-node/pull/83) [`a3cae97`](https://github.com/blindpaylabs/blindpay-node/commit/a3cae97451bdcfce5b4d2394a8f27e8907bb091f) Thanks [@rafa-thayto](https://github.com/rafa-thayto)! - Customers, terms of service, upload and instances now match the API.
  
  **Breaking:**
  
  - `customers.update` requires `email` and `country`, as the API does.
  - `UpdateCustomerInput.owners` is now `UpdateCustomerOwnerInput[]`: each owner needs the `id` of an existing owner, and every other field is optional. Before, the type had no way to send `id`, and the API rejects owners without one.
  - `CreateBusinessWithStandardKYBInput.owners` is now `CreateCustomerOwnerInput[]`, which requires the fields the API requires (`tax_id` and `id_doc_front_file` can't be `null`) and makes `title`, `ownership_percentage`, `address_line_2`, `id_doc_back_file` and the proof of address fields optional.
  - `GetCustomerResponse` and `ListCustomersResponse` now include `IndividualWithLightKYC` and `BusinessWithLightKYB`, the legacy `light` tier that migrated customers still carry. Code that narrows on `kyc_type` has to handle `"light"`.
  - `date_of_birth` on individual customers and `formation_date` on business customers are now optional and can be `null`.
  - Removed `aiprise_validation_key` from customer responses and `individual_holding_doc_front_file` from `IndividualWithEnhancedKYC`: the API never returns them.
  - `BusinessIndustry` no longer includes `"336111"`, `"517110"`, `"523110"`, `"523920"` or the instance onboarding categories (`"dapp"`, `"exchange"`, `"gambling"`, `"gaming"`, `"infra"`, `"marketplace"`, `"neo_bank"`, `"other"`, `"saas"`, `"social"`, `"wallet"`). The API rejects them for customers and bank accounts. The onboarding categories stay in `InstanceBusinessIndustry`.
  - `ListCustomersInput.status` is now `KycStatus` instead of `string`.
  - `customers.update`, `customers.delete`, `instances.update`, `instances.delete`, `instances.deleteMember` and `instances.updateMemberRole` now resolve to `SuccessResponse` (`{ success: boolean }`) instead of `void`.
  
  **Additive:**
  
  - `upload.upload`, `upload.analyze` and `upload.presign` send the client's instance id when you don't pass `instance_id`. The API needs it for API key requests, and `PresignInput.instance_id` is now optional.
  - `instances.tos.initiate` only requires `idempotency_key`; `customer_id` and `redirect_url` are optional.
  - The create customer responses include `customer_id`.
  - `BusinessWithStandardKYB` has `publicly_traded`.
  - New exported types `CreateCustomerOwnerInput`, `UpdateCustomerOwnerInput`, `IndividualWithLightKYC`, `BusinessWithLightKYB` and `Customer` (the union of every customer variant).
  - `MigrateInstanceOwnershipResponse` is now an alias of `SuccessResponse`.

- [#83](https://github.com/blindpaylabs/blindpay-node/pull/83) [`a80038c`](https://github.com/blindpaylabs/blindpay-node/commit/a80038cc422b103744b1f33455f06bd78a063d28) Thanks [@rafa-thayto](https://github.com/rafa-thayto)! - More fields the API can return or accept as `null` are typed that way: the spec marks them nullable through a reference or an `anyOf`, which the type sync used to miss.
  
  **Breaking:**
  
  - `Payable.bank_account`, and `cnae_condition` and `virtual_account_preapproval` on every customer type, can now be `null`.
  
  **Additive:**
  
  - `date_of_birth` on `CreateAchInput`, `CreateWireInput`, `CreateRtpInput` and `CreateInternationalSwiftInput`, and `date_of_birth`/`formation_date` on `UpdateCustomerInput`, accept `null`.

- [#83](https://github.com/blindpaylabs/blindpay-node/pull/83) [`fc569d5`](https://github.com/blindpaylabs/blindpay-node/commit/fc569d5cb98e607669fad27c7a214487b4a6bac9) Thanks [@rafa-thayto](https://github.com/rafa-thayto)! - Aligned payins, virtual accounts, wallets, transfers, payables, billing fees and partner fees with the API.
  
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

- [#83](https://github.com/blindpaylabs/blindpay-node/pull/83) [`2b4a782`](https://github.com/blindpaylabs/blindpay-node/commit/2b4a78298ae8404121abea3cab6a9f4edde39d97) Thanks [@rafa-thayto](https://github.com/rafa-thayto)! - Bank account and payout types now match the API.
  
  **Breaking:**
  
  - `bankAccounts.get` returns the same bank account shape as `bankAccounts.list` (new exported type `BankAccount`). The old `GetBankAccountResponse` fields the API never returned (`customer_id`, `account_holder_name`, `bank_name`, `swift_code`, `iban`, `is_primary`, `updated_at`) are gone.
  - `bankAccounts.delete` and `payouts.submitDocuments` now resolve to `{ success: boolean }` (`SuccessResponse`). `SubmitPayoutDocumentsResponse` no longer has an `id`.
  - `ListBankAccountsInput.status` only accepts a `BankAccountStatus` (`verifying`, `approved`, `rejected`, `deprecated`) instead of any string.
  - `ListBankAccountsResponse[].swift_intermediary_bank_swift_code_bic` can be `null`.
  - `ListBankAccountsResponse[].offramp_wallets[]` matches the API: `network` is any `OfframpWalletNetwork` (not only `"tron"`), `external_id` is optional and can be `null`, and `circle_wallet_id` is added.
  - `createTed` requires `account_number` and `account_type`, which the API needs to create a TED account.
  - On the payout tracking objects (`PayoutTrackingTransaction`, `PayoutTrackingPayment`, `PayoutTrackingLiquidity`, `PayoutTrackingComplete`, `PayoutTrackingPartnerFee`) only `step` is always present; every other key is now optional, since the API can leave it out.
  
  **Additive:**
  
  - New `bankAccounts.createFasterPayments` creates a UK Faster Payments bank account.
  - `ListBankAccountsResponse` items carry the SEPA fields (`sepa_iban`, `sepa_beneficiary_legal_name`, beneficiary address, city, region, postal code and country).
  - `CreateTedResponse` includes `account_number` and `account_type`.
  - `payouts.list` accepts the `status`, `customer_name`, `bank_account_id`, `country`, `payment_method`, `network` and `token` filters.
  - `payouts.createEvm`, `createStellar`, `createSolana` and `authorizeStellarToken` no longer require `sender_wallet_address`: pass it or a BlindPay-managed `wallet_id`. `createSolana`'s `signed_transaction` is optional.

- [#83](https://github.com/blindpaylabs/blindpay-node/pull/83) [`25b0f45`](https://github.com/blindpaylabs/blindpay-node/commit/25b0f453e87975e320b2695dec968192ab71f5d5) Thanks [@rafa-thayto](https://github.com/rafa-thayto)! - `payouts.list`, `customers.list` and `payables.list` responses are typed as either the paginated envelope or a plain array, like `payins.list` already was. The API returns every match as a plain array when no pagination parameter (`limit`, `starting_after`, `ending_before`) is passed, so code that reads `data.data` must first check `Array.isArray(data)`.

- [#83](https://github.com/blindpaylabs/blindpay-node/pull/83) [`310f377`](https://github.com/blindpaylabs/blindpay-node/commit/310f377a9ca1d188a5cfe1cbc4f18f73e8d051f0) Thanks [@rafa-thayto](https://github.com/rafa-thayto)! - Types now match the OpenAPI spec's nullability and enums.
  
  **Breaking:**
  
  - Response fields the API can return as `null` are now typed `| null` (e.g. `VirtualAccount.kyc_status`, `Payout.tracking_liquidity`, `CreateQuoteResponse.expires_at`). Code that reads them without a null check stops compiling. This includes the shared `PaginationMetadata.next_page` and `.prev_page`, so every paginated `list` response is affected, and `PayoutTrackingTransaction.status`.
  - Response fields that were a bare `string` now use the union the API guarantees: `GetRailsResponse[].country` (`Country`), `ListBankAccountsResponse[].spei_protocol` (`SpeiProtocol`), `.business_industry` (`BusinessIndustry`), `.status` (new `BankAccountStatus`), `IndividualWithEnhancedKYC.source_of_funds_doc_type` (`SourceOfFundsDocType`), and `Payout.ach_cop_document_type` (`AchCopDocument`).
  - `BankingPartner` no longer includes `"ssb"`: the API stopped returning it.
  
  **Additive:**
  
  - Input fields the API accepts as `null` now allow `| null`.
  - New enum members: 25 `BankDetailKey` values (SEPA, PIX Safe, TED and more), 9 `LimitIncreaseRequestSupportingDocumentType` values, `BusinessIndustry` `"446120"`, and `EstimatedTimeOfArrival` `"5_30_min"`.
  - New exported type `BankAccountStatus`.

- [#83](https://github.com/blindpaylabs/blindpay-node/pull/83) [`a91a628`](https://github.com/blindpaylabs/blindpay-node/commit/a91a628026894322e9b1cd84597395141cef7b16) Thanks [@rafa-thayto](https://github.com/rafa-thayto)! - **Breaking:**
  
  - `ListWebhookEndpointsResponse` items now type `last_event_at` as optional and `string | null`, matching the API: an endpoint that has not received an event yet has no `last_event_at`.
  - `instances.webhookEndpoints.delete` now resolves to `SuccessResponse` (`{ success: boolean }`) instead of `void`.
  
  **Additive:**
  
  - Added `constructWebhookEvent({ secret, headers, payload })` on the client. It verifies the webhook signature like `verifyWebhookSignature` and returns the payload typed as `WebhookEvent`, or throws a `BlindPayError` when verification fails. Its parameter type is exported as `WebhookVerificationInput`, which `verifyWebhookSignature` now uses too.
  - Added the `WebhookEvent` type, a union of every webhook payload discriminated by `webhook_event`, so a `switch` on `event.webhook_event` gives you that event's fields (for example `tos_id` on `tos.accept`). Each payload type is exported too, such as `TosAcceptWebhookEvent`, `CustomerDeleteWebhookEvent`, `WalletInboundWebhookEvent`, `PayinWebhookEvent` and `PayoutWebhookEvent`.

### Minor Changes

- [#83](https://github.com/blindpaylabs/blindpay-node/pull/83) [`9c4b377`](https://github.com/blindpaylabs/blindpay-node/commit/9c4b377c9899d5ecdeead3e83abfd7d89948e0dd) Thanks [@rafa-thayto](https://github.com/rafa-thayto)! - Sync SDK with API changes:
  
  - add enum member "111120" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "111219" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "111336" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "111421" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "112111" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "112210" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "112310" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "112410" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "112519" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "112990" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "113110" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "113210" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "114119" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "114210" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "115113" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "115210" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "115310" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "211130" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "212290" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "212390" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "213113" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "221122" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "221210" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "221320" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "236118" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "236210" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "237130" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "237210" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "237990" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "238191" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "238391" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "238991" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "311119" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "311212" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "311314" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "311422" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "311511" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "311612" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "311710" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "311811" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "311999" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "312111" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "312230" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "313240" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "313310" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "314120" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "314999" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "315120" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "315250" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "316110" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "316210" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "316990" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "321113" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "321211" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "321918" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "322120" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "322299" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "323120" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "324110" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "325180" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "325220" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "325320" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "325510" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "325611" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "325998" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "326111" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "326220" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "327120" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "327212" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "327310" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "327410" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "327999" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "331110" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "331210" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "331313" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "331410" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "331511" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "332111" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "332215" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "332311" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "332410" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "332510" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "332613" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "332710" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "332812" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "332999" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "333111" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "333248" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "333310" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "333413" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "333517" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "333611" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "333618" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "334310" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "334413" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "334511" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "334610" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "335131" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "335220" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "335311" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "335999" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "336211" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "336412" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "336510" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "336611" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "336999" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "337122" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "337214" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "337920" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "339999" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "423120" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "423220" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "423310" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "423490" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "423520" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "423620" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "423710" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "423990" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "424110" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "424310" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "424490" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "424590" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "424720" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "424820" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "425120" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "441110" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "441227" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "441330" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "444180" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "444240" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "445132" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "445298" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "449110" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "449129" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "454390" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "456120" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "458320" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "459310" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "459410" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "459510" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "459999" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "481211" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "482111" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "483112" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "483212" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "484110" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "484220" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "485119" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "485310" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "485410" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "485510" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "485999" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "486110" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "486210" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "486990" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "487110" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "487210" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "487990" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "488190" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "488210" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "488390" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "488490" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "488999" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "492110" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "492210" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "493190" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "512199" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "512290" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "513210" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "515210" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "517810" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "519290" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "521110" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "522130" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "522298" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "522390" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "523210" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "524128" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "524298" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "525190" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "525910" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "532289" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "532310" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "532490" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "533110" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "541199" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "541213" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "541219" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "541310" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "541490" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "541690" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "541720" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "551114" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "561110" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "561210" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "561599" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "561611" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "561790" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "561990" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "562211" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "562998" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "611210" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "611420" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "611519" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "611699" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "621498" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "621610" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "621999" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "622210" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "622310" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "623210" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "623311" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "623990" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "624190" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "624230" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "624310" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "711190" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "711219" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "711310" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "712120" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "713290" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "713990" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "721199" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "721211" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "721310" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "722310" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "722410" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "811198" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "811310" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "811411" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "812210" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "812320" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "812990" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "813319" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "813410" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "813930" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "814110" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "921140" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "922190" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "923130" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "924110" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "925120" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "926110" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "927110" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "928110" to types/index.d.ts:BusinessIndustry (UpdateCustomerIn.business_industry)
  - add enum member "ach_pull" to types/index.d.ts:PayinPaymentMethod (CreatePayinQuoteIn.payment_method)
  - add enum member "ach_pull" to types/index.d.ts:PaymentMethod (CreatePayinQuoteIn.payment_method)
  - add enum member "approved_rfi" to types/index.d.ts:KycStatus (CustomerOut.kyc_status)
  - add enum member "arc" to src/resources/wallets/offramp.ts:OfframpWalletNetwork (BankAccountWebhookOut.offramp_wallets.[].network)
  - add enum member "arc" to types/index.d.ts:Network (VirtualAccountOut.blockchain_wallet.network)
  - add enum member "arc_testnet" to src/resources/wallets/offramp.ts:OfframpWalletNetwork (BankAccountWebhookOut.offramp_wallets.[].network)
  - add enum member "arc_testnet" to types/index.d.ts:Network (VirtualAccountOut.blockchain_wallet.network)
  - add enum member "bre_b" to src/resources/virtual-accounts/index.ts:BankingPartner (VirtualAccountOut.banking_partner)
  - add enum member "bre_b" to types/index.d.ts:BankingPartner (VirtualAccountOut.banking_partner)
  - add enum member "card" to types/index.d.ts:PayinPaymentMethod (CreatePayinQuoteIn.payment_method)
  - add enum member "card" to types/index.d.ts:PaymentMethod (CreatePayinQuoteIn.payment_method)
  - add enum member "documents" to src/resources/upload/index.ts:UploadBucket (UploadIn.bucket)
  - add enum member "faster_payments" to types/index.d.ts:Rail (BankAccountWebhookOut.type)
  - add enum member "faster_payments_account_number" to src/resources/available/index.ts:BankDetailKey (AvailableBankDetails.[].key)
  - add enum member "faster_payments_beneficiary_address_line_1" to src/resources/available/index.ts:BankDetailKey (AvailableBankDetails.[].key)
  - add enum member "faster_payments_beneficiary_address_line_2" to src/resources/available/index.ts:BankDetailKey (AvailableBankDetails.[].key)
  - add enum member "faster_payments_beneficiary_city" to src/resources/available/index.ts:BankDetailKey (AvailableBankDetails.[].key)
  - add enum member "faster_payments_beneficiary_country" to src/resources/available/index.ts:BankDetailKey (AvailableBankDetails.[].key)
  - add enum member "faster_payments_beneficiary_legal_name" to src/resources/available/index.ts:BankDetailKey (AvailableBankDetails.[].key)
  - add enum member "faster_payments_beneficiary_postal_code" to src/resources/available/index.ts:BankDetailKey (AvailableBankDetails.[].key)
  - add enum member "faster_payments_beneficiary_state_province_region" to src/resources/available/index.ts:BankDetailKey (AvailableBankDetails.[].key)
  - add enum member "faster_payments_sort_code" to src/resources/available/index.ts:BankDetailKey (AvailableBankDetails.[].key)
  - add enum member "payable.complete" to src/resources/webhooks/index.ts:WebhookEvents (WebhookEndpointIn.events)
  - add enum member "payable.new" to src/resources/webhooks/index.ts:WebhookEvents (WebhookEndpointIn.events)
  - add enum member "payable.update" to src/resources/webhooks/index.ts:WebhookEvents (WebhookEndpointIn.events)
  - add enum member "pending_refund_review" to types/index.d.ts:TrackingStatus (PayoutOut.tracking_complete.step)
  - add enum member "portage_g" to src/resources/virtual-accounts/index.ts:BankingPartner (VirtualAccountOut.banking_partner)
  - add enum member "portage_g" to types/index.d.ts:BankingPartner (VirtualAccountOut.banking_partner)
  - add enum member "salary_or_wages" to types/index.d.ts:SourceOfWealth (UpdateCustomerIn.source_of_wealth)
  - add enum member "savings" to types/index.d.ts:SourceOfWealth (UpdateCustomerIn.source_of_wealth)
  - add enum member "spei" to src/resources/virtual-accounts/index.ts:BankingPartner (VirtualAccountOut.banking_partner)
  - add enum member "spei" to types/index.d.ts:BankingPartner (VirtualAccountOut.banking_partner)
  - add enum member "swift_intermediary_bank_routing_number" to src/resources/available/index.ts:BankDetailKey (AvailableBankDetails.[].key)
  - add enum member "tempo" to src/resources/wallets/offramp.ts:OfframpWalletNetwork (BankAccountWebhookOut.offramp_wallets.[].network)
  - add enum member "tempo" to types/index.d.ts:Network (VirtualAccountOut.blockchain_wallet.network)
  - add enum member "tempo_testnet" to src/resources/wallets/offramp.ts:OfframpWalletNetwork (BankAccountWebhookOut.offramp_wallets.[].network)
  - add enum member "tempo_testnet" to types/index.d.ts:Network (VirtualAccountOut.blockchain_wallet.network)
  - add enum member "wallet.update" to src/resources/webhooks/index.ts:WebhookEvents (WebhookEndpointIn.events)
  - add field "EURB?: WalletTokenBalance" to src/resources/wallets/custodial.ts:GetCustodialWalletBalanceResponse (WalletBalanceOut)
  - add field "EURC?: WalletTokenBalance" to src/resources/wallets/custodial.ts:GetCustodialWalletBalanceResponse (WalletBalanceOut)
  - add field "accent_color?: string | null" to src/resources/instances/index.ts:UpdateInstanceInput (UpdateInstanceIn)
  - add field "bank_account_id?: string | null" to src/resources/payouts/index.ts:Payout (PayoutOut)
  - add field "bre_b?: {
      gender: "male" | "female";
  } | null" to src/resources/virtual-accounts/index.ts:CreateVirtualAccountInput (CreateVirtualAccountIn)
  - add field "card_claim_at?: string | null" to types/index.d.ts:PayinTrackingTransaction (PayinOut.tracking_transaction)
  - add field "card_evidence?: {
      eci?: string | null;
      cavv?: string | null;
      avs_response?: string | null;
      cvv_response?: string | null;
      auth_code?: string | null;
      cardholder_name?: string | null;
      three_ds_version?: string | null;
  } | null" to types/index.d.ts:PayinTrackingTransaction (PayinOut.tracking_transaction)
  - add field "card_failed_attempts?: number | null" to types/index.d.ts:PayinTrackingTransaction (PayinOut.tracking_transaction)
  - add field "card_gates_failed_at?: string | null" to types/index.d.ts:PayinTrackingTransaction (PayinOut.tracking_transaction)
  - add field "card_instruction?: {
      provider: string;
      tokenization_key: string;
  } | null" to types/index.d.ts:PayinTrackingTransaction (PayinOut.tracking_transaction)
  - add field "co?: {
      bre_b: {
      key: string;
  };
      beneficiary?: {
      name: string;
  } | null;
  } | null" to src/resources/virtual-accounts/index.ts:VirtualAccount (VirtualAccountOut)
  - add field "earning_amount?: number" to src/resources/wallets/custodial.ts:WalletTokenBalance (WalletTokenOut)
  - add field "faster_payments?: string" to src/resources/fees/index.ts:GetFeesResponse (GetFeesOut)
  - add field "faster_payments_account_number?: string | null" to src/resources/bank-accounts/index.ts:CreateAchInput (CreateBankAccountIn)
  - add field "faster_payments_account_number?: string | null" to src/resources/bank-accounts/index.ts:CreateAchResponse (BankAccountOut)
  - add field "faster_payments_account_number?: string | null" to src/resources/bank-accounts/index.ts:CreateArgentinaTransfersInput (CreateBankAccountIn)
  - add field "faster_payments_account_number?: string | null" to src/resources/bank-accounts/index.ts:CreateArgentinaTransfersResponse (BankAccountOut)
  - add field "faster_payments_account_number?: string | null" to src/resources/bank-accounts/index.ts:CreateColombiaAchInput (CreateBankAccountIn)
  - add field "faster_payments_account_number?: string | null" to src/resources/bank-accounts/index.ts:CreateColombiaAchResponse (BankAccountOut)
  - add field "faster_payments_account_number?: string | null" to src/resources/bank-accounts/index.ts:CreateInternationalSwiftInput (CreateBankAccountIn)
  - add field "faster_payments_account_number?: string | null" to src/resources/bank-accounts/index.ts:CreateInternationalSwiftResponse (BankAccountOut)
  - add field "faster_payments_account_number?: string | null" to src/resources/bank-accounts/index.ts:CreatePixInput (CreateBankAccountIn)
  - add field "faster_payments_account_number?: string | null" to src/resources/bank-accounts/index.ts:CreatePixResponse (BankAccountOut)
  - add field "faster_payments_account_number?: string | null" to src/resources/bank-accounts/index.ts:CreatePixSafeInput (CreateBankAccountIn)
  - add field "faster_payments_account_number?: string | null" to src/resources/bank-accounts/index.ts:CreatePixSafeResponse (BankAccountOut)
  - add field "faster_payments_account_number?: string | null" to src/resources/bank-accounts/index.ts:CreateRtpInput (CreateBankAccountIn)
  - add field "faster_payments_account_number?: string | null" to src/resources/bank-accounts/index.ts:CreateRtpResponse (BankAccountOut)
  - add field "faster_payments_account_number?: string | null" to src/resources/bank-accounts/index.ts:CreateSepaInput (CreateBankAccountIn)
  - add field "faster_payments_account_number?: string | null" to src/resources/bank-accounts/index.ts:CreateSepaResponse (BankAccountOut)
  - add field "faster_payments_account_number?: string | null" to src/resources/bank-accounts/index.ts:CreateSpeiInput (CreateBankAccountIn)
  - add field "faster_payments_account_number?: string | null" to src/resources/bank-accounts/index.ts:CreateSpeiResponse (BankAccountOut)
  - add field "faster_payments_account_number?: string | null" to src/resources/bank-accounts/index.ts:CreateTedInput (CreateBankAccountIn)
  - add field "faster_payments_account_number?: string | null" to src/resources/bank-accounts/index.ts:CreateTedResponse (BankAccountOut)
  - add field "faster_payments_account_number?: string | null" to src/resources/bank-accounts/index.ts:CreateWireInput (CreateBankAccountIn)
  - add field "faster_payments_account_number?: string | null" to src/resources/bank-accounts/index.ts:CreateWireResponse (BankAccountOut)
  - add field "faster_payments_account_number?: string | null" to src/resources/bank-accounts/index.ts:GetBankAccountResponse (BankAccountOut)
  - add field "faster_payments_account_number?: string | null" to src/resources/bank-accounts/index.ts:ListBankAccountsResponse (BankAccountOut)
  - add field "faster_payments_account_number?: string | null" to src/resources/payouts/index.ts:Payout (PayoutOut)
  - add field "faster_payments_beneficiary_address_line_1?: string | null" to src/resources/bank-accounts/index.ts:CreateAchInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_address_line_1?: string | null" to src/resources/bank-accounts/index.ts:CreateAchResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_address_line_1?: string | null" to src/resources/bank-accounts/index.ts:CreateArgentinaTransfersInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_address_line_1?: string | null" to src/resources/bank-accounts/index.ts:CreateArgentinaTransfersResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_address_line_1?: string | null" to src/resources/bank-accounts/index.ts:CreateColombiaAchInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_address_line_1?: string | null" to src/resources/bank-accounts/index.ts:CreateColombiaAchResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_address_line_1?: string | null" to src/resources/bank-accounts/index.ts:CreateInternationalSwiftInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_address_line_1?: string | null" to src/resources/bank-accounts/index.ts:CreateInternationalSwiftResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_address_line_1?: string | null" to src/resources/bank-accounts/index.ts:CreatePixInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_address_line_1?: string | null" to src/resources/bank-accounts/index.ts:CreatePixResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_address_line_1?: string | null" to src/resources/bank-accounts/index.ts:CreatePixSafeInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_address_line_1?: string | null" to src/resources/bank-accounts/index.ts:CreatePixSafeResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_address_line_1?: string | null" to src/resources/bank-accounts/index.ts:CreateRtpInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_address_line_1?: string | null" to src/resources/bank-accounts/index.ts:CreateRtpResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_address_line_1?: string | null" to src/resources/bank-accounts/index.ts:CreateSepaInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_address_line_1?: string | null" to src/resources/bank-accounts/index.ts:CreateSepaResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_address_line_1?: string | null" to src/resources/bank-accounts/index.ts:CreateSpeiInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_address_line_1?: string | null" to src/resources/bank-accounts/index.ts:CreateSpeiResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_address_line_1?: string | null" to src/resources/bank-accounts/index.ts:CreateTedInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_address_line_1?: string | null" to src/resources/bank-accounts/index.ts:CreateTedResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_address_line_1?: string | null" to src/resources/bank-accounts/index.ts:CreateWireInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_address_line_1?: string | null" to src/resources/bank-accounts/index.ts:CreateWireResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_address_line_1?: string | null" to src/resources/bank-accounts/index.ts:GetBankAccountResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_address_line_1?: string | null" to src/resources/bank-accounts/index.ts:ListBankAccountsResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_address_line_1?: string | null" to src/resources/payouts/index.ts:Payout (PayoutOut)
  - add field "faster_payments_beneficiary_address_line_2?: string | null" to src/resources/bank-accounts/index.ts:CreateAchInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_address_line_2?: string | null" to src/resources/bank-accounts/index.ts:CreateAchResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_address_line_2?: string | null" to src/resources/bank-accounts/index.ts:CreateArgentinaTransfersInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_address_line_2?: string | null" to src/resources/bank-accounts/index.ts:CreateArgentinaTransfersResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_address_line_2?: string | null" to src/resources/bank-accounts/index.ts:CreateColombiaAchInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_address_line_2?: string | null" to src/resources/bank-accounts/index.ts:CreateColombiaAchResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_address_line_2?: string | null" to src/resources/bank-accounts/index.ts:CreateInternationalSwiftInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_address_line_2?: string | null" to src/resources/bank-accounts/index.ts:CreateInternationalSwiftResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_address_line_2?: string | null" to src/resources/bank-accounts/index.ts:CreatePixInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_address_line_2?: string | null" to src/resources/bank-accounts/index.ts:CreatePixResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_address_line_2?: string | null" to src/resources/bank-accounts/index.ts:CreatePixSafeInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_address_line_2?: string | null" to src/resources/bank-accounts/index.ts:CreatePixSafeResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_address_line_2?: string | null" to src/resources/bank-accounts/index.ts:CreateRtpInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_address_line_2?: string | null" to src/resources/bank-accounts/index.ts:CreateRtpResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_address_line_2?: string | null" to src/resources/bank-accounts/index.ts:CreateSepaInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_address_line_2?: string | null" to src/resources/bank-accounts/index.ts:CreateSepaResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_address_line_2?: string | null" to src/resources/bank-accounts/index.ts:CreateSpeiInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_address_line_2?: string | null" to src/resources/bank-accounts/index.ts:CreateSpeiResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_address_line_2?: string | null" to src/resources/bank-accounts/index.ts:CreateTedInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_address_line_2?: string | null" to src/resources/bank-accounts/index.ts:CreateTedResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_address_line_2?: string | null" to src/resources/bank-accounts/index.ts:CreateWireInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_address_line_2?: string | null" to src/resources/bank-accounts/index.ts:CreateWireResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_address_line_2?: string | null" to src/resources/bank-accounts/index.ts:GetBankAccountResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_address_line_2?: string | null" to src/resources/bank-accounts/index.ts:ListBankAccountsResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_city?: string | null" to src/resources/bank-accounts/index.ts:CreateAchInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_city?: string | null" to src/resources/bank-accounts/index.ts:CreateAchResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_city?: string | null" to src/resources/bank-accounts/index.ts:CreateArgentinaTransfersInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_city?: string | null" to src/resources/bank-accounts/index.ts:CreateArgentinaTransfersResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_city?: string | null" to src/resources/bank-accounts/index.ts:CreateColombiaAchInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_city?: string | null" to src/resources/bank-accounts/index.ts:CreateColombiaAchResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_city?: string | null" to src/resources/bank-accounts/index.ts:CreateInternationalSwiftInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_city?: string | null" to src/resources/bank-accounts/index.ts:CreateInternationalSwiftResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_city?: string | null" to src/resources/bank-accounts/index.ts:CreatePixInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_city?: string | null" to src/resources/bank-accounts/index.ts:CreatePixResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_city?: string | null" to src/resources/bank-accounts/index.ts:CreatePixSafeInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_city?: string | null" to src/resources/bank-accounts/index.ts:CreatePixSafeResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_city?: string | null" to src/resources/bank-accounts/index.ts:CreateRtpInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_city?: string | null" to src/resources/bank-accounts/index.ts:CreateRtpResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_city?: string | null" to src/resources/bank-accounts/index.ts:CreateSepaInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_city?: string | null" to src/resources/bank-accounts/index.ts:CreateSepaResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_city?: string | null" to src/resources/bank-accounts/index.ts:CreateSpeiInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_city?: string | null" to src/resources/bank-accounts/index.ts:CreateSpeiResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_city?: string | null" to src/resources/bank-accounts/index.ts:CreateTedInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_city?: string | null" to src/resources/bank-accounts/index.ts:CreateTedResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_city?: string | null" to src/resources/bank-accounts/index.ts:CreateWireInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_city?: string | null" to src/resources/bank-accounts/index.ts:CreateWireResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_city?: string | null" to src/resources/bank-accounts/index.ts:GetBankAccountResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_city?: string | null" to src/resources/bank-accounts/index.ts:ListBankAccountsResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_city?: string | null" to src/resources/payouts/index.ts:Payout (PayoutOut)
  - add field "faster_payments_beneficiary_country?: Country | null" to src/resources/bank-accounts/index.ts:CreateAchInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_country?: Country | null" to src/resources/bank-accounts/index.ts:CreateAchResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_country?: Country | null" to src/resources/bank-accounts/index.ts:CreateArgentinaTransfersInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_country?: Country | null" to src/resources/bank-accounts/index.ts:CreateArgentinaTransfersResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_country?: Country | null" to src/resources/bank-accounts/index.ts:CreateColombiaAchInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_country?: Country | null" to src/resources/bank-accounts/index.ts:CreateColombiaAchResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_country?: Country | null" to src/resources/bank-accounts/index.ts:CreateInternationalSwiftInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_country?: Country | null" to src/resources/bank-accounts/index.ts:CreateInternationalSwiftResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_country?: Country | null" to src/resources/bank-accounts/index.ts:CreatePixInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_country?: Country | null" to src/resources/bank-accounts/index.ts:CreatePixResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_country?: Country | null" to src/resources/bank-accounts/index.ts:CreatePixSafeInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_country?: Country | null" to src/resources/bank-accounts/index.ts:CreatePixSafeResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_country?: Country | null" to src/resources/bank-accounts/index.ts:CreateRtpInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_country?: Country | null" to src/resources/bank-accounts/index.ts:CreateRtpResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_country?: Country | null" to src/resources/bank-accounts/index.ts:CreateSepaInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_country?: Country | null" to src/resources/bank-accounts/index.ts:CreateSepaResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_country?: Country | null" to src/resources/bank-accounts/index.ts:CreateSpeiInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_country?: Country | null" to src/resources/bank-accounts/index.ts:CreateSpeiResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_country?: Country | null" to src/resources/bank-accounts/index.ts:CreateTedInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_country?: Country | null" to src/resources/bank-accounts/index.ts:CreateTedResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_country?: Country | null" to src/resources/bank-accounts/index.ts:CreateWireInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_country?: Country | null" to src/resources/bank-accounts/index.ts:CreateWireResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_country?: Country | null" to src/resources/bank-accounts/index.ts:GetBankAccountResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_country?: Country | null" to src/resources/bank-accounts/index.ts:ListBankAccountsResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_country?: Country | null" to src/resources/payouts/index.ts:Payout (PayoutOut)
  - add field "faster_payments_beneficiary_legal_name?: string | null" to src/resources/bank-accounts/index.ts:CreateAchInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_legal_name?: string | null" to src/resources/bank-accounts/index.ts:CreateAchResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_legal_name?: string | null" to src/resources/bank-accounts/index.ts:CreateArgentinaTransfersInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_legal_name?: string | null" to src/resources/bank-accounts/index.ts:CreateArgentinaTransfersResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_legal_name?: string | null" to src/resources/bank-accounts/index.ts:CreateColombiaAchInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_legal_name?: string | null" to src/resources/bank-accounts/index.ts:CreateColombiaAchResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_legal_name?: string | null" to src/resources/bank-accounts/index.ts:CreateInternationalSwiftInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_legal_name?: string | null" to src/resources/bank-accounts/index.ts:CreateInternationalSwiftResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_legal_name?: string | null" to src/resources/bank-accounts/index.ts:CreatePixInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_legal_name?: string | null" to src/resources/bank-accounts/index.ts:CreatePixResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_legal_name?: string | null" to src/resources/bank-accounts/index.ts:CreatePixSafeInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_legal_name?: string | null" to src/resources/bank-accounts/index.ts:CreatePixSafeResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_legal_name?: string | null" to src/resources/bank-accounts/index.ts:CreateRtpInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_legal_name?: string | null" to src/resources/bank-accounts/index.ts:CreateRtpResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_legal_name?: string | null" to src/resources/bank-accounts/index.ts:CreateSepaInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_legal_name?: string | null" to src/resources/bank-accounts/index.ts:CreateSepaResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_legal_name?: string | null" to src/resources/bank-accounts/index.ts:CreateSpeiInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_legal_name?: string | null" to src/resources/bank-accounts/index.ts:CreateSpeiResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_legal_name?: string | null" to src/resources/bank-accounts/index.ts:CreateTedInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_legal_name?: string | null" to src/resources/bank-accounts/index.ts:CreateTedResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_legal_name?: string | null" to src/resources/bank-accounts/index.ts:CreateWireInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_legal_name?: string | null" to src/resources/bank-accounts/index.ts:CreateWireResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_legal_name?: string | null" to src/resources/bank-accounts/index.ts:GetBankAccountResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_legal_name?: string | null" to src/resources/bank-accounts/index.ts:ListBankAccountsResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_legal_name?: string | null" to src/resources/payouts/index.ts:Payout (PayoutOut)
  - add field "faster_payments_beneficiary_postal_code?: string | null" to src/resources/bank-accounts/index.ts:CreateAchInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_postal_code?: string | null" to src/resources/bank-accounts/index.ts:CreateAchResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_postal_code?: string | null" to src/resources/bank-accounts/index.ts:CreateArgentinaTransfersInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_postal_code?: string | null" to src/resources/bank-accounts/index.ts:CreateArgentinaTransfersResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_postal_code?: string | null" to src/resources/bank-accounts/index.ts:CreateColombiaAchInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_postal_code?: string | null" to src/resources/bank-accounts/index.ts:CreateColombiaAchResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_postal_code?: string | null" to src/resources/bank-accounts/index.ts:CreateInternationalSwiftInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_postal_code?: string | null" to src/resources/bank-accounts/index.ts:CreateInternationalSwiftResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_postal_code?: string | null" to src/resources/bank-accounts/index.ts:CreatePixInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_postal_code?: string | null" to src/resources/bank-accounts/index.ts:CreatePixResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_postal_code?: string | null" to src/resources/bank-accounts/index.ts:CreatePixSafeInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_postal_code?: string | null" to src/resources/bank-accounts/index.ts:CreatePixSafeResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_postal_code?: string | null" to src/resources/bank-accounts/index.ts:CreateRtpInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_postal_code?: string | null" to src/resources/bank-accounts/index.ts:CreateRtpResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_postal_code?: string | null" to src/resources/bank-accounts/index.ts:CreateSepaInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_postal_code?: string | null" to src/resources/bank-accounts/index.ts:CreateSepaResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_postal_code?: string | null" to src/resources/bank-accounts/index.ts:CreateSpeiInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_postal_code?: string | null" to src/resources/bank-accounts/index.ts:CreateSpeiResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_postal_code?: string | null" to src/resources/bank-accounts/index.ts:CreateTedInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_postal_code?: string | null" to src/resources/bank-accounts/index.ts:CreateTedResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_postal_code?: string | null" to src/resources/bank-accounts/index.ts:CreateWireInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_postal_code?: string | null" to src/resources/bank-accounts/index.ts:CreateWireResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_postal_code?: string | null" to src/resources/bank-accounts/index.ts:GetBankAccountResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_postal_code?: string | null" to src/resources/bank-accounts/index.ts:ListBankAccountsResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_postal_code?: string | null" to src/resources/payouts/index.ts:Payout (PayoutOut)
  - add field "faster_payments_beneficiary_state_province_region?: string | null" to src/resources/bank-accounts/index.ts:CreateAchInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_state_province_region?: string | null" to src/resources/bank-accounts/index.ts:CreateAchResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_state_province_region?: string | null" to src/resources/bank-accounts/index.ts:CreateArgentinaTransfersInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_state_province_region?: string | null" to src/resources/bank-accounts/index.ts:CreateArgentinaTransfersResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_state_province_region?: string | null" to src/resources/bank-accounts/index.ts:CreateColombiaAchInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_state_province_region?: string | null" to src/resources/bank-accounts/index.ts:CreateColombiaAchResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_state_province_region?: string | null" to src/resources/bank-accounts/index.ts:CreateInternationalSwiftInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_state_province_region?: string | null" to src/resources/bank-accounts/index.ts:CreateInternationalSwiftResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_state_province_region?: string | null" to src/resources/bank-accounts/index.ts:CreatePixInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_state_province_region?: string | null" to src/resources/bank-accounts/index.ts:CreatePixResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_state_province_region?: string | null" to src/resources/bank-accounts/index.ts:CreatePixSafeInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_state_province_region?: string | null" to src/resources/bank-accounts/index.ts:CreatePixSafeResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_state_province_region?: string | null" to src/resources/bank-accounts/index.ts:CreateRtpInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_state_province_region?: string | null" to src/resources/bank-accounts/index.ts:CreateRtpResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_state_province_region?: string | null" to src/resources/bank-accounts/index.ts:CreateSepaInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_state_province_region?: string | null" to src/resources/bank-accounts/index.ts:CreateSepaResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_state_province_region?: string | null" to src/resources/bank-accounts/index.ts:CreateSpeiInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_state_province_region?: string | null" to src/resources/bank-accounts/index.ts:CreateSpeiResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_state_province_region?: string | null" to src/resources/bank-accounts/index.ts:CreateTedInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_state_province_region?: string | null" to src/resources/bank-accounts/index.ts:CreateTedResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_state_province_region?: string | null" to src/resources/bank-accounts/index.ts:CreateWireInput (CreateBankAccountIn)
  - add field "faster_payments_beneficiary_state_province_region?: string | null" to src/resources/bank-accounts/index.ts:CreateWireResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_state_province_region?: string | null" to src/resources/bank-accounts/index.ts:GetBankAccountResponse (BankAccountOut)
  - add field "faster_payments_beneficiary_state_province_region?: string | null" to src/resources/bank-accounts/index.ts:ListBankAccountsResponse (BankAccountOut)
  - add field "faster_payments_sort_code?: string | null" to src/resources/bank-accounts/index.ts:CreateAchInput (CreateBankAccountIn)
  - add field "faster_payments_sort_code?: string | null" to src/resources/bank-accounts/index.ts:CreateAchResponse (BankAccountOut)
  - add field "faster_payments_sort_code?: string | null" to src/resources/bank-accounts/index.ts:CreateArgentinaTransfersInput (CreateBankAccountIn)
  - add field "faster_payments_sort_code?: string | null" to src/resources/bank-accounts/index.ts:CreateArgentinaTransfersResponse (BankAccountOut)
  - add field "faster_payments_sort_code?: string | null" to src/resources/bank-accounts/index.ts:CreateColombiaAchInput (CreateBankAccountIn)
  - add field "faster_payments_sort_code?: string | null" to src/resources/bank-accounts/index.ts:CreateColombiaAchResponse (BankAccountOut)
  - add field "faster_payments_sort_code?: string | null" to src/resources/bank-accounts/index.ts:CreateInternationalSwiftInput (CreateBankAccountIn)
  - add field "faster_payments_sort_code?: string | null" to src/resources/bank-accounts/index.ts:CreateInternationalSwiftResponse (BankAccountOut)
  - add field "faster_payments_sort_code?: string | null" to src/resources/bank-accounts/index.ts:CreatePixInput (CreateBankAccountIn)
  - add field "faster_payments_sort_code?: string | null" to src/resources/bank-accounts/index.ts:CreatePixResponse (BankAccountOut)
  - add field "faster_payments_sort_code?: string | null" to src/resources/bank-accounts/index.ts:CreatePixSafeInput (CreateBankAccountIn)
  - add field "faster_payments_sort_code?: string | null" to src/resources/bank-accounts/index.ts:CreatePixSafeResponse (BankAccountOut)
  - add field "faster_payments_sort_code?: string | null" to src/resources/bank-accounts/index.ts:CreateRtpInput (CreateBankAccountIn)
  - add field "faster_payments_sort_code?: string | null" to src/resources/bank-accounts/index.ts:CreateRtpResponse (BankAccountOut)
  - add field "faster_payments_sort_code?: string | null" to src/resources/bank-accounts/index.ts:CreateSepaInput (CreateBankAccountIn)
  - add field "faster_payments_sort_code?: string | null" to src/resources/bank-accounts/index.ts:CreateSepaResponse (BankAccountOut)
  - add field "faster_payments_sort_code?: string | null" to src/resources/bank-accounts/index.ts:CreateSpeiInput (CreateBankAccountIn)
  - add field "faster_payments_sort_code?: string | null" to src/resources/bank-accounts/index.ts:CreateSpeiResponse (BankAccountOut)
  - add field "faster_payments_sort_code?: string | null" to src/resources/bank-accounts/index.ts:CreateTedInput (CreateBankAccountIn)
  - add field "faster_payments_sort_code?: string | null" to src/resources/bank-accounts/index.ts:CreateTedResponse (BankAccountOut)
  - add field "faster_payments_sort_code?: string | null" to src/resources/bank-accounts/index.ts:CreateWireInput (CreateBankAccountIn)
  - add field "faster_payments_sort_code?: string | null" to src/resources/bank-accounts/index.ts:CreateWireResponse (BankAccountOut)
  - add field "faster_payments_sort_code?: string | null" to src/resources/bank-accounts/index.ts:GetBankAccountResponse (BankAccountOut)
  - add field "faster_payments_sort_code?: string | null" to src/resources/bank-accounts/index.ts:ListBankAccountsResponse (BankAccountOut)
  - add field "faster_payments_sort_code?: string | null" to src/resources/payouts/index.ts:Payout (PayoutOut)
  - add field "forced_provider?: "zenus" | "veem" | null" to types/index.d.ts:PayoutTrackingPayment (PayoutOut.tracking_payment)
  - add field "funding_bank_account_id?: string | null" to src/resources/payins/quotes.ts:CreatePayinQuoteInput (CreatePayinQuoteIn)
  - add field "is_nested?: boolean | null" to src/resources/customers/index.ts:BusinessWithStandardKYB (CustomerOut)
  - add field "is_nested?: boolean | null" to src/resources/customers/index.ts:IndividualWithEnhancedKYC (CustomerOut)
  - add field "is_nested?: boolean | null" to src/resources/customers/index.ts:IndividualWithStandardKYC (CustomerOut)
  - add field "logo_url?: string | null" to src/resources/instances/index.ts:UpdateInstanceInput (UpdateInstanceIn)
  - add field "mx?: {
      spei: {
      clabe: string;
  };
      beneficiary?: {
      name: string;
  } | null;
  } | null" to src/resources/virtual-accounts/index.ts:VirtualAccount (VirtualAccountOut)
  - add field "partner_fee_id?: string | null" to src/resources/virtual-accounts/index.ts:CreateVirtualAccountInput (CreateVirtualAccountIn)
  - add field "partner_fee_id?: string | null" to src/resources/virtual-accounts/index.ts:UpdateVirtualAccountInput (UpdateVirtualAccountIn)
  - add field "partner_fee_id?: string | null" to src/resources/virtual-accounts/index.ts:VirtualAccount (VirtualAccountOut)
  - add field "partner_flat_fee?: number" to src/resources/transfers/index.ts:CreateTransferQuoteInput (CreateTransferQuoteIn)
  - add field "partner_flat_fee?: number" to src/resources/transfers/index.ts:CreateTransferQuoteResponse (CreateTransferQuoteOut)
  - add field "partner_flat_fee?: number" to src/resources/transfers/index.ts:Transfer (TransferOut)
  - add field "partner_percentage_fee?: number" to src/resources/transfers/index.ts:CreateTransferQuoteInput (CreateTransferQuoteIn)
  - add field "partner_percentage_fee?: number" to src/resources/transfers/index.ts:CreateTransferQuoteResponse (CreateTransferQuoteOut)
  - add field "partner_percentage_fee?: number" to src/resources/transfers/index.ts:Transfer (TransferOut)
  - add field "partner_tos_link?: string | null" to src/resources/instances/index.ts:UpdateInstanceInput (UpdateInstanceIn)
  - add field "partner_tos_screenshot?: string | null" to src/resources/instances/index.ts:UpdateInstanceInput (UpdateInstanceIn)
  - add field "partner_tos_terms_accepted?: boolean" to src/resources/instances/index.ts:UpdateInstanceInput (UpdateInstanceIn)
  - add field "payable_id?: string | null" to src/resources/payouts/index.ts:CreateEvmPayoutResponse (PayoutOnEvmOut)
  - add field "payable_id?: string | null" to src/resources/payouts/index.ts:CreateSolanaPayoutResponse (PayoutOnEvmOut)
  - add field "payable_id?: string | null" to src/resources/payouts/index.ts:CreateStellarPayoutResponse (PayoutOnEvmOut)
  - add field "payable_id?: string | null" to src/resources/payouts/index.ts:Payout (PayoutOut)
  - add field "payable_id?: string | null" to src/resources/quotes/index.ts:CreateQuoteInput (QuoteIn)
  - add field "plaid_connected_at?: string | null" to src/resources/bank-accounts/index.ts:CreateAchResponse (BankAccountOut)
  - add field "plaid_connected_at?: string | null" to src/resources/bank-accounts/index.ts:CreateArgentinaTransfersResponse (BankAccountOut)
  - add field "plaid_connected_at?: string | null" to src/resources/bank-accounts/index.ts:CreateColombiaAchResponse (BankAccountOut)
  - add field "plaid_connected_at?: string | null" to src/resources/bank-accounts/index.ts:CreateInternationalSwiftResponse (BankAccountOut)
  - add field "plaid_connected_at?: string | null" to src/resources/bank-accounts/index.ts:CreatePixResponse (BankAccountOut)
  - add field "plaid_connected_at?: string | null" to src/resources/bank-accounts/index.ts:CreatePixSafeResponse (BankAccountOut)
  - add field "plaid_connected_at?: string | null" to src/resources/bank-accounts/index.ts:CreateRtpResponse (BankAccountOut)
  - add field "plaid_connected_at?: string | null" to src/resources/bank-accounts/index.ts:CreateSepaResponse (BankAccountOut)
  - add field "plaid_connected_at?: string | null" to src/resources/bank-accounts/index.ts:CreateSpeiResponse (BankAccountOut)
  - add field "plaid_connected_at?: string | null" to src/resources/bank-accounts/index.ts:CreateTedResponse (BankAccountOut)
  - add field "plaid_connected_at?: string | null" to src/resources/bank-accounts/index.ts:CreateWireResponse (BankAccountOut)
  - add field "plaid_connected_at?: string | null" to src/resources/bank-accounts/index.ts:GetBankAccountResponse (BankAccountOut)
  - add field "plaid_connected_at?: string | null" to src/resources/bank-accounts/index.ts:ListBankAccountsResponse (BankAccountOut)
  - add field "refund_review_actioned_at?: string | null" to types/index.d.ts:PayoutTrackingPayment (PayoutOut.tracking_payment)
  - add field "refund_review_detected_at?: string | null" to types/index.d.ts:PayoutTrackingPayment (PayoutOut.tracking_payment)
  - add field "refund_review_reason?: "amount_threshold" | "time_window" | "late_cancellation_no_live_run" | "master_account_return" | "policy_always_review" | "operator_requested" | "partial_return" | null" to types/index.d.ts:PayoutTrackingPayment (PayoutOut.tracking_payment)
  - add field "returned_amount?: number | null" to types/index.d.ts:PayoutTrackingPayment (PayoutOut.tracking_payment)
  - add field "review_context?: Record<string, unknown> | null" to types/index.d.ts:PayoutTrackingPayment (PayoutOut.tracking_payment)
  - add field "review_source?: string | null" to types/index.d.ts:PayoutTrackingPayment (PayoutOut.tracking_payment)
  - add field "review_sources?: unknown[] | null" to types/index.d.ts:PayoutTrackingPayment (PayoutOut.tracking_payment)
  - add field "sepa_beneficiary_address_line_1?: string | null" to src/resources/payouts/index.ts:Payout (PayoutOut)
  - add field "sepa_beneficiary_city?: string | null" to src/resources/payouts/index.ts:Payout (PayoutOut)
  - add field "sepa_beneficiary_country?: Country | null" to src/resources/payouts/index.ts:Payout (PayoutOut)
  - add field "sepa_beneficiary_legal_name?: string | null" to src/resources/payouts/index.ts:Payout (PayoutOut)
  - add field "sepa_beneficiary_postal_code?: string | null" to src/resources/payouts/index.ts:Payout (PayoutOut)
  - add field "sepa_iban?: string | null" to src/resources/payouts/index.ts:Payout (PayoutOut)
  - add field "total_amount?: number" to src/resources/wallets/custodial.ts:WalletTokenBalance (WalletTokenOut)
  - add field "wallet_id?: string" to src/resources/payouts/index.ts:AuthorizeStellarTokenInput (PayoutOnStellarAuthorizeIn)
  - add field "wallet_id?: string" to src/resources/payouts/index.ts:CreateEvmPayoutInput (PayoutOnEvmIn)
  - add field "wallet_id?: string" to src/resources/payouts/index.ts:CreateSolanaPayoutInput (PayoutOnSolanaIn)
  - add field "wallet_id?: string" to src/resources/payouts/index.ts:CreateStellarPayoutInput (PayoutOnStellarIn)
  - add method "createPlaid" to src/resources/bank-accounts/index.ts:createBankAccountsResource (POST /v1/instances/{instance_id}/customers/{customer_id}/bank-accounts/plaid)

- [#83](https://github.com/blindpaylabs/blindpay-node/pull/83) [`58c522c`](https://github.com/blindpaylabs/blindpay-node/commit/58c522cd5c2b91b3426816883d5d496725944fa9) Thanks [@rafa-thayto](https://github.com/rafa-thayto)! - Sync SDK with API changes:
  
  - add enum member "bre_b" to types/index.d.ts:PayinPaymentMethod (PayinOut.payment_method)
  - add enum member "infinitus_portage" to types/index.d.ts:PayoutForcedProvider (PayoutOut.tracking_payment.forced_provider)
  - add field "additional_info?: AdditionalInfoItem[] | null" to src/resources/customers/index.ts:BusinessWithStandardKYB (CustomerOut)
  - add field "additional_info?: AdditionalInfoItem[] | null" to src/resources/customers/index.ts:CreateBusinessWithStandardKYBInput (CreateCustomerIn)
  - add field "additional_info?: AdditionalInfoItem[] | null" to src/resources/customers/index.ts:CreateIndividualWithEnhancedKYCInput (CreateCustomerIn)
  - add field "additional_info?: AdditionalInfoItem[] | null" to src/resources/customers/index.ts:CreateIndividualWithStandardKYCInput (CreateCustomerIn)
  - add field "additional_info?: AdditionalInfoItem[] | null" to src/resources/customers/index.ts:IndividualWithEnhancedKYC (CustomerOut)
  - add field "additional_info?: AdditionalInfoItem[] | null" to src/resources/customers/index.ts:IndividualWithStandardKYC (CustomerOut)
  - add field "additional_info?: AdditionalInfoItem[] | null" to src/resources/customers/index.ts:UpdateCustomerInput (UpdateCustomerIn)
  - add field "approved_risk_sources?: string[] | null" to types/index.d.ts:PayinTrackingPayment (PayinOut.tracking_payment)
  - add field "bank_account_id?: string | null" to src/resources/payouts/index.ts:CreateEvmPayoutResponse (PayoutOnEvmOut)
  - add field "bank_account_id?: string | null" to src/resources/payouts/index.ts:CreateSolanaPayoutResponse (PayoutOnEvmOut)
  - add field "bank_account_id?: string | null" to src/resources/payouts/index.ts:CreateStellarPayoutResponse (PayoutOnEvmOut)
  - add field "billing_fee_amount?: number | null" to src/resources/payins/index.ts:CreateEvmPayinResponse (CreatePayinOut)
  - add field "billing_fee_amount?: number | null" to src/resources/payins/quotes.ts:CreatePayinQuoteResponse (CreatePayinQuoteOut)
  - add field "billing_fee_amount?: number | null" to src/resources/payouts/index.ts:CreateEvmPayoutResponse (PayoutOnEvmOut)
  - add field "billing_fee_amount?: number | null" to src/resources/payouts/index.ts:CreateSolanaPayoutResponse (PayoutOnEvmOut)
  - add field "billing_fee_amount?: number | null" to src/resources/payouts/index.ts:CreateStellarPayoutResponse (PayoutOnEvmOut)
  - add field "billing_fee_amount?: number | null" to src/resources/quotes/index.ts:CreateQuoteResponse (QuoteOut)
  - add field "business_type?: BusinessType | null" to src/resources/customers/index.ts:BusinessWithStandardKYB (CustomerOut)
  - add field "business_type?: BusinessType | null" to src/resources/customers/index.ts:IndividualWithEnhancedKYC (CustomerOut)
  - add field "business_type?: BusinessType | null" to src/resources/customers/index.ts:IndividualWithStandardKYC (CustomerOut)
  - add field "coelsa_id?: string | null" to types/index.d.ts:PayoutTrackingPayment (PayoutOut.tracking_payment)
  - add field "compliance_emails?: string[] | null" to src/resources/instances/index.ts:UpdateInstanceInput (UpdateInstanceIn)
  - add field "customer_id?: string | null" to src/resources/virtual-accounts/index.ts:VirtualAccount (VirtualAccountOut)
  - add field "customer_id?: string" to src/resources/customers/index.ts:BusinessWithStandardKYB (CustomerOut)
  - add field "customer_id?: string" to src/resources/customers/index.ts:IndividualWithEnhancedKYC (CustomerOut)
  - add field "customer_id?: string" to src/resources/customers/index.ts:IndividualWithStandardKYC (CustomerOut)
  - add field "customer_rfi_emails_enabled?: boolean" to src/resources/instances/index.ts:UpdateInstanceInput (UpdateInstanceIn)
  - add field "end_to_end_id?: string | null" to types/index.d.ts:PayinTrackingTransaction (PayinOut.tracking_transaction)
  - add field "end_to_end_id?: string | null" to types/index.d.ts:PayoutTrackingPayment (PayoutOut.tracking_payment)
  - add field "external_id?: string | null" to src/resources/transfers/index.ts:Transfer (TransferOut)
  - add field "force_cpf_cnpj?: boolean | null" to src/resources/bank-accounts/index.ts:CreateAchInput (CreateBankAccountIn)
  - add field "force_cpf_cnpj?: boolean | null" to src/resources/bank-accounts/index.ts:CreateArgentinaTransfersInput (CreateBankAccountIn)
  - add field "force_cpf_cnpj?: boolean | null" to src/resources/bank-accounts/index.ts:CreateColombiaAchInput (CreateBankAccountIn)
  - add field "force_cpf_cnpj?: boolean | null" to src/resources/bank-accounts/index.ts:CreateInternationalSwiftInput (CreateBankAccountIn)
  - add field "force_cpf_cnpj?: boolean | null" to src/resources/bank-accounts/index.ts:CreatePixInput (CreateBankAccountIn)
  - add field "force_cpf_cnpj?: boolean | null" to src/resources/bank-accounts/index.ts:CreatePixSafeInput (CreateBankAccountIn)
  - add field "force_cpf_cnpj?: boolean | null" to src/resources/bank-accounts/index.ts:CreateRtpInput (CreateBankAccountIn)
  - add field "force_cpf_cnpj?: boolean | null" to src/resources/bank-accounts/index.ts:CreateSepaInput (CreateBankAccountIn)
  - add field "force_cpf_cnpj?: boolean | null" to src/resources/bank-accounts/index.ts:CreateSpeiInput (CreateBankAccountIn)
  - add field "force_cpf_cnpj?: boolean | null" to src/resources/bank-accounts/index.ts:CreateTedInput (CreateBankAccountIn)
  - add field "force_cpf_cnpj?: boolean | null" to src/resources/bank-accounts/index.ts:CreateWireInput (CreateBankAccountIn)
  - add field "has_passkey?: boolean | null" to src/resources/instances/index.ts:GetInstanceMembersResponse (get /v1/instances/{id}/members)
  - add field "latitude?: number | null" to src/resources/customers/index.ts:BusinessWithStandardKYB (CustomerOut)
  - add field "latitude?: number | null" to src/resources/customers/index.ts:CreateBusinessWithStandardKYBInput (CreateCustomerIn)
  - add field "latitude?: number | null" to src/resources/customers/index.ts:CreateIndividualWithEnhancedKYCInput (CreateCustomerIn)
  - add field "latitude?: number | null" to src/resources/customers/index.ts:CreateIndividualWithStandardKYCInput (CreateCustomerIn)
  - add field "latitude?: number | null" to src/resources/customers/index.ts:IndividualWithEnhancedKYC (CustomerOut)
  - add field "latitude?: number | null" to src/resources/customers/index.ts:IndividualWithStandardKYC (CustomerOut)
  - add field "latitude?: number | null" to src/resources/customers/index.ts:UpdateCustomerInput (UpdateCustomerIn)
  - add field "ledger_in_transaction_id?: string | null" to types/index.d.ts:PayoutTrackingTransaction (PayoutOut.tracking_transaction)
  - add field "ledger_out_transaction_id?: string | null" to types/index.d.ts:PayoutTrackingTransaction (PayoutOut.tracking_transaction)
  - add field "longitude?: number | null" to src/resources/customers/index.ts:BusinessWithStandardKYB (CustomerOut)
  - add field "longitude?: number | null" to src/resources/customers/index.ts:CreateBusinessWithStandardKYBInput (CreateCustomerIn)
  - add field "longitude?: number | null" to src/resources/customers/index.ts:CreateIndividualWithEnhancedKYCInput (CreateCustomerIn)
  - add field "longitude?: number | null" to src/resources/customers/index.ts:CreateIndividualWithStandardKYCInput (CreateCustomerIn)
  - add field "longitude?: number | null" to src/resources/customers/index.ts:IndividualWithEnhancedKYC (CustomerOut)
  - add field "longitude?: number | null" to src/resources/customers/index.ts:IndividualWithStandardKYC (CustomerOut)
  - add field "longitude?: number | null" to src/resources/customers/index.ts:UpdateCustomerInput (UpdateCustomerIn)
  - add field "manual_concluded_at?: string" to src/resources/payins/index.ts:Payin (PayinOut)
  - add field "manual_concluded_by?: string | null" to src/resources/payins/index.ts:Payin (PayinOut)
  - add field "manual_execution_status?: "pending" | "concluded" | "failed" | null" to src/resources/payins/index.ts:Payin (PayinOut)
  - add field "offramp_wallet_id?: string | null" to src/resources/payouts/index.ts:CreateEvmPayoutResponse (PayoutOnEvmOut)
  - add field "offramp_wallet_id?: string | null" to src/resources/payouts/index.ts:CreateSolanaPayoutResponse (PayoutOnEvmOut)
  - add field "offramp_wallet_id?: string | null" to src/resources/payouts/index.ts:CreateStellarPayoutResponse (PayoutOnEvmOut)
  - add field "partner_fee?: number" to src/resources/payins/index.ts:CreateEvmPayinResponse (CreatePayinOut)
  - add field "partner_fee?: number" to src/resources/payins/index.ts:Payin (PayinOut)
  - add field "partner_fee?: number" to src/resources/payouts/index.ts:CreateEvmPayoutResponse (PayoutOnEvmOut)
  - add field "partner_fee?: number" to src/resources/payouts/index.ts:CreateSolanaPayoutResponse (PayoutOnEvmOut)
  - add field "partner_fee?: number" to src/resources/payouts/index.ts:CreateStellarPayoutResponse (PayoutOnEvmOut)
  - add field "partner_fee?: number" to src/resources/payouts/index.ts:Payout (PayoutOut)
  - add field "pix_safe_bank_code?: string | null" to src/resources/payouts/index.ts:Payout (PayoutOut)
  - add field "pix_safe_branch_code?: string | null" to src/resources/payouts/index.ts:Payout (PayoutOut)
  - add field "pix_safe_cpf_cnpj?: string | null" to src/resources/payouts/index.ts:Payout (PayoutOut)
  - add field "provider_clearing_system?: string | null" to types/index.d.ts:PayoutTrackingPayment (PayoutOut.tracking_payment)
  - add field "provider_error_reason?: string | null" to types/index.d.ts:PayoutTrackingPayment (PayoutOut.tracking_payment)
  - add field "provider_error_reason?: string | null" to types/index.d.ts:PayoutTrackingTransaction (PayoutOut.tracking_transaction)
  - add field "provider_imad?: string | null" to types/index.d.ts:PayoutTrackingPayment (PayoutOut.tracking_payment)
  - add field "provider_integration?: PayoutProviderIntegration | null" to types/index.d.ts:PayoutTrackingPayment (PayoutOut.tracking_payment)
  - add field "provider_name?: string | null" to types/index.d.ts:PayinTrackingTransaction (PayinOut.tracking_transaction)
  - add field "provider_reference?: string | null" to types/index.d.ts:PayoutTrackingPayment (PayoutOut.tracking_payment)
  - add field "provider_transaction_id?: string | null" to types/index.d.ts:PayinTrackingTransaction (PayinOut.tracking_transaction)
  - add field "provider_transaction_id?: string | null" to types/index.d.ts:PayoutTrackingComplete (PayoutOut.tracking_complete)
  - add field "provider_transaction_id?: string | null" to types/index.d.ts:PayoutTrackingTransaction (PayoutOut.tracking_transaction)
  - add field "provider_uetr?: string | null" to types/index.d.ts:PayoutTrackingPayment (PayoutOut.tracking_payment)
  - add field "refund_reason?: string | null" to types/index.d.ts:PayoutTrackingComplete (PayoutOut.tracking_complete)
  - add field "requiredWhen?: {
      field: "type" | "name" | "status" | "recipient_relationship" | "swift_payment_code" | "pix_key" | "force_cpf_cnpj" | "beneficiary_name" | "routing_number" | "account_number" | "account_type" | "account_class" | "address_line_1" | "address_line_2" | "city" | "state_province_region" | "country" | "postal_code" | "checkbook_account_id" | "checkbook_user_key" | "onemoney_external_account_id" | "pix_safe_bank_code" | "pix_safe_branch_code" | "pix_safe_cpf_cnpj" | "ted_bank_code" | "ted_branch_code" | "ted_cpf_cnpj" | "spei_protocol" | "spei_institution_code" | "spei_clabe" | "transfers_type" | "transfers_account" | "ach_cop_beneficiary_first_name" | "ach_cop_beneficiary_last_name" | "ach_cop_document_id" | "ach_cop_document_type" | "ach_cop_email" | "ach_cop_bank_code" | "ach_cop_bank_account" | "swift_code_bic" | "swift_account_holder_name" | "swift_account_number_iban" | "swift_beneficiary_address_line_1" | "swift_beneficiary_address_line_2" | "swift_beneficiary_country" | "swift_beneficiary_city" | "swift_beneficiary_state_province_region" | "swift_beneficiary_postal_code" | "swift_bank_name" | "swift_bank_address_line_1" | "swift_bank_address_line_2" | "swift_bank_country" | "swift_bank_city" | "swift_bank_state_province_region" | "swift_bank_postal_code" | "swift_ifsc_branch_code" | "swift_intermediary_bank_swift_code_bic" | "swift_intermediary_bank_account_number_iban" | "swift_intermediary_bank_name" | "swift_intermediary_bank_country" | "swift_intermediary_bank_routing_number" | "sepa_iban" | "sepa_beneficiary_bic" | "sepa_beneficiary_legal_name" | "sepa_beneficiary_address_line_1" | "sepa_beneficiary_address_line_2" | "sepa_beneficiary_city" | "sepa_beneficiary_state_province_region" | "sepa_beneficiary_postal_code" | "sepa_beneficiary_country" | "faster_payments_sort_code" | "faster_payments_account_number" | "faster_payments_beneficiary_legal_name" | "faster_payments_beneficiary_address_line_1" | "faster_payments_beneficiary_address_line_2" | "faster_payments_beneficiary_city" | "faster_payments_beneficiary_state_province_region" | "faster_payments_beneficiary_postal_code" | "faster_payments_beneficiary_country" | "business_industry" | "phone_number" | "tax_id" | "date_of_birth";
      operator: "in" | "eq" | "notIn" | "notEq";
      values: string[];
  }" to src/resources/available/index.ts:GetBankDetailsResponse (AvailableBankDetails)
  - add field "review_context?: Record<string, unknown> | null" to types/index.d.ts:PayinTrackingPayment (PayinOut.tracking_payment)
  - add field "review_source?: string | null" to types/index.d.ts:PayinTrackingPayment (PayinOut.tracking_payment)
  - add field "sender_bank_name?: string | null" to types/index.d.ts:PayinTrackingTransaction (PayinOut.tracking_transaction)
  - add field "sender_legal_name?: string | null" to src/resources/payouts/index.ts:Payout (PayoutOut)
  - add field "sepa?: FeeOptions" to src/resources/fees/index.ts:GetFeesResponse (GetFeesOut)
  - add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateAchInput (CreateBankAccountIn)
  - add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateAchResponse (BankAccountOut)
  - add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateArgentinaTransfersInput (CreateBankAccountIn)
  - add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateArgentinaTransfersResponse (BankAccountOut)
  - add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateColombiaAchInput (CreateBankAccountIn)
  - add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateColombiaAchResponse (BankAccountOut)
  - add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateInternationalSwiftInput (CreateBankAccountIn)
  - add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateInternationalSwiftResponse (BankAccountOut)
  - add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreatePixInput (CreateBankAccountIn)
  - add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreatePixResponse (BankAccountOut)
  - add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreatePixSafeInput (CreateBankAccountIn)
  - add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreatePixSafeResponse (BankAccountOut)
  - add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateRtpInput (CreateBankAccountIn)
  - add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateRtpResponse (BankAccountOut)
  - add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateSepaInput (CreateBankAccountIn)
  - add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateSepaResponse (BankAccountOut)
  - add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateSpeiInput (CreateBankAccountIn)
  - add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateSpeiResponse (BankAccountOut)
  - add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateTedInput (CreateBankAccountIn)
  - add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateTedResponse (BankAccountOut)
  - add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateWireInput (CreateBankAccountIn)
  - add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:CreateWireResponse (BankAccountOut)
  - add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:GetBankAccountResponse (BankAccountOut)
  - add field "swift_ifsc_branch_code?: string | null" to src/resources/bank-accounts/index.ts:ListBankAccountsResponse (BankAccountOut)
  - add field "ted_instruction?: {
      beneficiary_name: string;
      tax_id: string;
      bank_code: string;
      bank_name: string;
      branch_code: string;
      account_number: string;
      account_type: string;
  } | null" to types/index.d.ts:PayinTrackingTransaction (PayinOut.tracking_transaction)
  - add field "tracking_documents?: {
      step: TrackingStatus;
      status?: "waiting_documents" | "compliance_reviewing" | null;
      reviewed_by?: string | null;
      completed_at?: string | null;
  } | null" to src/resources/payouts/index.ts:CreateEvmPayoutResponse (PayoutOnEvmOut)
  - add field "tracking_documents?: {
      step: TrackingStatus;
      status?: "waiting_documents" | "compliance_reviewing" | null;
      reviewed_by?: string | null;
      completed_at?: string | null;
  } | null" to src/resources/payouts/index.ts:CreateSolanaPayoutResponse (PayoutOnEvmOut)
  - add field "tracking_documents?: {
      step: TrackingStatus;
      status?: "waiting_documents" | "compliance_reviewing" | null;
      reviewed_by?: string | null;
      completed_at?: string | null;
  } | null" to src/resources/payouts/index.ts:CreateStellarPayoutResponse (PayoutOnEvmOut)
  - add field "tracking_documents?: {
      step: TrackingStatus;
      status?: "waiting_documents" | "compliance_reviewing" | null;
      reviewed_by?: string | null;
      completed_at?: string | null;
  } | null" to src/resources/payouts/index.ts:Payout (PayoutOut)
  - add field "transaction_fee_amount?: number | null" to src/resources/payins/index.ts:CreateEvmPayinResponse (CreatePayinOut)
  - add field "transaction_fee_amount?: number | null" to src/resources/payins/index.ts:Payin (PayinOut)
  - add field "transaction_fee_amount?: number | null" to src/resources/payouts/index.ts:CreateEvmPayoutResponse (PayoutOnEvmOut)
  - add field "transaction_fee_amount?: number | null" to src/resources/payouts/index.ts:CreateSolanaPayoutResponse (PayoutOnEvmOut)
  - add field "transaction_fee_amount?: number | null" to src/resources/payouts/index.ts:CreateStellarPayoutResponse (PayoutOnEvmOut)
  - add field "transaction_fee_amount?: number | null" to src/resources/payouts/index.ts:Payout (PayoutOut)
  - add field "transaction_hash?: string | null" to types/index.d.ts:PayinTrackingTransaction (PayinOut.tracking_transaction)
  - add field "yield?: {
      blindpay_share_bps: number;
      partner_share_bps: number;
      partner_wallet_address?: string | null;
  } | null" to src/resources/fees/index.ts:GetFeesResponse (GetFeesOut)

- [#83](https://github.com/blindpaylabs/blindpay-node/pull/83) [`9c4b377`](https://github.com/blindpaylabs/blindpay-node/commit/9c4b377c9899d5ecdeead3e83abfd7d89948e0dd) Thanks [@rafa-thayto](https://github.com/rafa-thayto)! - Cover the current BlindPay public API:
  
  - `blindpay.payables`: `list`, `create`, `get` and `delete`.
  - `blindpay.instances.rfi` and `blindpay.customers.rfi`: `get` the open request for information and `submit` a response. `KycStatus` gains `"approved_rfi"`.
  - `blindpay.instances.get()` and `blindpay.instances.onboarding`: `getBusinessDetails`, `getBusinessProfile` and `getOwnershipDocuments`.
  - `blindpay.wallets.custodial.getDeposits()`, and `yield_status` on custodial wallets.
  - `blindpay.upload.presign()` and `blindpay.upload.analyze()`.
  - `blindpay.customers.bankAccounts.createPlaid()`.
  - Customer `virtual_account_preapproval` and `cnae_condition`, and multiple `supporting_documents` on limit-increase requests.
  - `CreateQuoteInput` now only requires `network` and `token`, so a quote can be created for a `payable_id` instead of a bank account.
  
  Endpoints the API marks `x-sdk: false` (yield, simulated SPEI/Bre-B deposits, card payments, ToS passthrough and `upload/extract`) stay out of the SDK.

- [#83](https://github.com/blindpaylabs/blindpay-node/pull/83) [`42e3abb`](https://github.com/blindpaylabs/blindpay-node/commit/42e3abbdaa97bef9343195b5011d98f873abe254) Thanks [@rafa-thayto](https://github.com/rafa-thayto)! - Errors carry the API's full error envelope. Besides `message`, `error` now has `code` (a stable code such as `PAYOUTS_INSUFFICIENT_BALANCE`, preferred for programmatic handling), `description` (safe to show to end users), `errors`, and `trace_id` (include it when contacting support) whenever the API sends them.

- [#83](https://github.com/blindpaylabs/blindpay-node/pull/83) [`0b8db48`](https://github.com/blindpaylabs/blindpay-node/commit/0b8db48ed6679dff6b40c4884a21fd678c733494) Thanks [@rafa-thayto](https://github.com/rafa-thayto)! - Transfers and custodial wallet balances accept and report the EUR stablecoins.
  
  - New shared type `WalletToken` (`"USDC" | "USDT" | "USDB" | "EURC" | "EURB"`) for tokens a custodial wallet holds or moves; the wallet deposits methods use it too.
  - `CreateTransferQuoteInput.sender_token`/`customer_token`, `Transfer.sender_token`/`customer_token` and `WalletTokenBalance.symbol` now use `WalletToken`, so a transfer can convert between USDC and EURC (USDB and EURB on development instances).

- [#83](https://github.com/blindpaylabs/blindpay-node/pull/83) [`4735866`](https://github.com/blindpaylabs/blindpay-node/commit/4735866320562dfc86c5ad6a849a2d680356015d) Thanks [@rafa-thayto](https://github.com/rafa-thayto)! - Every method that creates, updates or deletes something takes an optional last argument, `{ idempotencyKey }`, sent as the `Idempotency-Key` header. Retrying with the same key and the same input replays the original response instead of acting twice (for example, a payout retried after a timeout is not created again). Keys are kept for 24 hours; file uploads and the unauthenticated terms-of-service route ignore them.

## 5.4.0

### Minor Changes

- [#78](https://github.com/blindpaylabs/blindpay-node/pull/78) [`2d0ece6`](https://github.com/blindpaylabs/blindpay-node/commit/2d0ece682e45811d34ceb520b52527cd27835076) Thanks [@juninhopo](https://github.com/juninhopo)! - Add self-custody support to external blockchain wallets. `is_self_custody` (`boolean | null`, null = never answered) is now returned on blockchain wallets and accepted as an optional input on `createWithAddress` and `createWithHash` (the API requires it for customers in Brazil). New `wallets.blockchain.setSelfCustody({ customer_id, id, is_self_custody })` records the answer once on an existing wallet. Adds the `blockchainWallet.update` webhook event.

- [#80](https://github.com/blindpaylabs/blindpay-node/pull/80) [`c8911d2`](https://github.com/blindpaylabs/blindpay-node/commit/c8911d26ce2e1e9b731e675bb175320d80e72074) Thanks [@rafa-thayto](https://github.com/rafa-thayto)! - Add GBP support to the shared currency type and payout and payin FX inputs.

- [#77](https://github.com/blindpaylabs/blindpay-node/pull/77) [`eb5f370`](https://github.com/blindpaylabs/blindpay-node/commit/eb5f370e8bb6e10188d52acf67061dabf35311c7) Thanks [@anshitraj](https://github.com/anshitraj)! - Add EUR support to the shared currency type and payout and payin FX inputs.

## 5.3.1

See the [v5.3.1 release notes](https://github.com/blindpaylabs/blindpay-node/releases/tag/v5.3.1).

## 5.3.0

See the [v5.3.0 release notes](https://github.com/blindpaylabs/blindpay-node/releases/tag/v5.3.0).

## 5.2.0

See the [v5.2.0 release notes](https://github.com/blindpaylabs/blindpay-node/releases/tag/v5.2.0).

## 5.1.0

See the [v5.1.0 release notes](https://github.com/blindpaylabs/blindpay-node/releases/tag/v5.1.0).

## 5.0.1

See the [v5.0.1 release notes](https://github.com/blindpaylabs/blindpay-node/releases/tag/v5.0.1).

## 5.0.0

See the [v5.0.0 release notes](https://github.com/blindpaylabs/blindpay-node/releases/tag/v5.0.0).

## 4.1.1

See the [v4.1.1 release notes](https://github.com/blindpaylabs/blindpay-node/releases/tag/v4.1.1).

## 4.1.0

See the [v4.1.0 release notes](https://github.com/blindpaylabs/blindpay-node/releases/tag/v4.1.0).

## 4.0.2

### Patch Changes

- baa9ef3: Remove stale `signed_agreement_id` from `CreateVirtualAccountRequest`. The field was moved to an internal compliance flow and is not part of the public virtual account creation API.

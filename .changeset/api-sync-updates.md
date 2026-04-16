---
"@blindpay/node": minor
---

API sync updates - Added missing enum values and receiver fields

- Added new enum types to shared types: BusinessIndustry, AccountPurpose, BusinessType, EstimatedAnnualRevenue, SourceOfWealth, BankingPartner, SoleProprietorDocType, RecipientRelationship, PurposeOfTransactions, SourceOfFundsDocType, PaymentMethod
- Added non-numeric BusinessIndustry values: dapp, exchange, gambling, gaming, infra, marketplace, neo_bank, other, saas, social, wallet
- Added recipient_relationship and sole_proprietor_doc_type fields to receiver types and input types
- Added require_passkey field to instance update input
- Refactored receivers to use shared enum types instead of local duplicates
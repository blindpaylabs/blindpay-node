---
"@blindpay/node": minor
---

Added new types and fields for receivers, bank accounts, offramp wallets, and virtual accounts:
- Added ReceiverKycStatus, AmlStatus, AmlHits, FraudWarning, and OwnerTaxType types to receivers
- Added fraud_warnings, aml_status, aml_hits, account_purpose_other, and occupation fields to receiver response types
- Added approved_per_transaction, approved_daily, approved_monthly fields to limit increase requests
- Expanded BusinessIndustry enum with all NAICS codes from the API spec
- Added business_industry, phone_number, tax_id, date_of_birth, status, recipient_relationship, and swift_payment_code fields to bank account list response
- Added solana network support for offramp wallets and circle_wallet_id field
- Added cfsb banking partner, SoleProprietorDocType, swift_account_number, and swift_receiving_bank to virtual accounts

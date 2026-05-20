---
"@blindpay/node": minor
---

Add support for RFI endpoints, SEPA bank accounts, EUR currency, and manual execution fields.

- Add RFI (Request for Information) sub-resource under receivers with get and submit methods
- Add SEPA bank account creation with comprehensive beneficiary and address field support  
- Add EUR currency support across payins, payouts, and FX quotes
- Add manual execution status fields to payins (manual_concluded_at, manual_concluded_by, manual_execution_status)
- Add new business industry code 446120 to shared enum
- Add new Hong Kong SWIFT payment codes for charitable donations, goods, personal, and services
- Add SEPA fee structure to billing fees response
- Add decision and receiver type enums with approved/rejected and business/individual values
- Add swift_ifsc_branch_code field to bank account types
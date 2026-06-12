---
"@blindpay/node": minor
---

Added new enum types and fields to match API updates:

- Added AipriseDocumentType enum with document type values
- Added ManualExecutionStatus enum with "failed" status
- Added WebhookEvent enum with "receiver.delete" event
- Fixed EstimatedAnnualRevenue enum value (250000000_plus)
- Added cpn_payment_id and sender_legal_name fields to Payin type
- Added sender_legal_name field to Payout type
- Fixed billing_fee_amount type in Payin (number instead of string)
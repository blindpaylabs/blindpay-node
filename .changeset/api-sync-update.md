---
"@blindpay/node": minor
---

Add new enum types, fields, and endpoints based on API changes:
- Added ManualExecutionStatus enum with "failed" value
- Added WebhookEvent enum with "receiver.delete" value  
- Added manual_execution_status field to Payin type
- Added billing_fee_amount and cpn_payment_id fields to Payout type
- Added sepa_beneficiary_bic field to bank account types
- Updated OfframpWalletNetwork enum with 9 new network values
- Added migrateOwnership method to instances resource
- Added ReceiverDeleteWebhookOut type for webhook responses
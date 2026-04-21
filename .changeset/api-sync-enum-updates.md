---
"@blindpay/node": minor
---

Added RTP as a supported payin payment method (`PayinPaymentMethod` and `PaymentMethod` enums), and exposed the `receiving_bank`, `swift_account_number`, and `swift_receiving_bank` fields on `BlindpayBankDetails` to match the payin response returned by the API.
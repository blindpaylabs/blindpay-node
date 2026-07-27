---
"@blindpay/node": patch
---

Revert `BlockchainWalletOut`, `OfframpWallet` and `GetLimitIncreaseRequestsResponse` back to declaring `customer_id`. A response-rewriting middleware already aliases `receiver_id` to `customer_id` on every customer route in production, so `customer_id` is present on the wire today, and it becomes the API's own field name once the server-side rename ships. The nested `Owner` type now declares both `receiver_id` and `customer_id` as optional: production sends neither on that nested object today, `receiver_id` will keep working, and `customer_id` will start arriving once the server-side rename ships.

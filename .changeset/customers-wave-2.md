---
"@blindpay/node": major
---

Complete the receiver -> customer rename now that blindpay-v2 #1799 has shipped: `receiver_id` -> `customer_id` (`Payout`, `Payin`, `Transfer`, `Owner`, terms-of-service initiate), `receiver_local_amount` -> `customer_local_amount` (quotes, payouts), `receiver_wallet_address`/`receiver_network`/`receiver_token` -> `customer_wallet_address`/`customer_network`/`customer_token` (transfers), `receiver_invite_redirect_url` -> `customer_invite_redirect_url` (instance settings). `receiver_amount` (singular, the receiving-side amount on quotes/payins/payouts/transfers) and `currency_type`'s `"sender" | "receiver"` values are unchanged.

Remove the deprecated `receiver.new`/`receiver.update`/`receiver.delete` webhook events from `WebhookEvents` — they stop firing at the same cutover.

Remove the `api-keys` resource (`blindpay.instances.apiKeys`) and its types; the API Keys surface is not part of the public API reference.

`Owner.receiver_id` is removed; only `Owner.customer_id` remains (optional, matching the spec).

Add a contract-check script (`bun run contract-check`) that fails CI when an SDK-declared field name doesn't exist anywhere in the committed OpenAPI snapshot, or when the spec's webhook event enum has a member the SDK doesn't model.

Held until blindpay-v2 #1799 reaches production; the deployed API does not accept these names until then.

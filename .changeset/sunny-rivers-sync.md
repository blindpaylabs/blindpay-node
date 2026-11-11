---
"@blindpay/node": minor
---

Synced with the API spec at blindpay-v2@66144f3b2; the SDK now covers all 94 public SDK operations.

- **New method `wallets.offramp.update({ customer_id, bank_account_id, id, partner_fee_id })`** (`PUT …/offramp-wallets/{id}`). Omit `partner_fee_id` to leave it unchanged, pass `null` to remove the partner fee.
- `payins.getTrack(id, { checkout_token })`: pass a card payin's signed checkout token to get its `card_instruction` back. The track methods (`payouts`, `payins`, `transfers`) are documented as what they are: public tracking endpoints for BlindPay's own apps, which return 401 to a server-side call in production; use `get(id)`.
- `partner_fee_id` on offramp wallets (create input, create response, `OfframpWallet`).
- `card_instruction` on the payin quote response, and `checkout_public_key`, `checkout_token` and `checkout_url` on the payin tracking `card_instruction`.
- `partner_wallets` (per-network EVM address) on the billing fees `yield` split.
- **Deprecated** (still typed as optional so your code compiles; the API no longer returns them): `PayoutTrackingPayment.forced_provider`, `PayoutTrackingPayment.provider_integration` (and the `PayoutForcedProvider` / `PayoutProviderIntegration` types), and the fees `yield.partner_wallet_address` (read `partner_wallets`).
- **Path ids are percent-encoded** (C9): `payouts.get("a/b")` now requests `/payouts/a%2Fb` instead of a different route. Well-formed BlindPay ids are unchanged on the wire.

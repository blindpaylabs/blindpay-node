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
- **Fixed:** `Payout.tracking_partner_fee` was typed as always present, but the API stopped returning it; it is now optional and `@deprecated` (read `partner_fee` for the amount).
- **Fixed:** `customer_id` on the payout create responses was typed as always present, but the create calls never return it (read it from `payouts.get` or the `payout.new` webhook); it is now optional.
- **Path ids are percent-encoded** (C9): `payouts.get("a/b")` now requests `/payouts/a%2Fb` instead of a different route. Well-formed BlindPay ids are unchanged on the wire.
- `console.log(client)` and `JSON.stringify(client)` show the configuration with the API key redacted; the key is no longer reachable as a property.
- Each rail's bank-account create response now also types `status`, `tax_id`, `phone_number`, `date_of_birth`, `business_industry` and `tron_wallet_hash` (optional; the API returns the whole bank account).
- `CreatePayoutInput` is deprecated: no method takes it.
- `limit` also accepts a number (`{ limit: 50 }`); it is sent as the same string. `offset` is deprecated: the API ignores it, page with `starting_after` or `listAutoPaging`.

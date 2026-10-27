---
"@blindpay/node": major
---

**Breaking:**

- `ListWebhookEndpointsResponse` items now type `last_event_at` as optional and `string | null`, matching the API: an endpoint that has not received an event yet has no `last_event_at`.
- `instances.webhookEndpoints.delete` now resolves to `SuccessResponse` (`{ success: boolean }`) instead of `void`.

Added `constructWebhookEvent({ secret, headers, payload })` on the client. It verifies the webhook signature like `verifyWebhookSignature` and returns the payload typed as `WebhookEvent`, or throws a `BlindPayError` when verification fails.

Added the `WebhookEvent` type, a union of every webhook payload discriminated by `webhook_event`, so a `switch` on `event.webhook_event` gives you that event's fields (for example `tos_id` on `tos.accept`). Each payload type is exported too, such as `TosAcceptWebhookEvent`, `CustomerDeleteWebhookEvent`, `WalletInboundWebhookEvent`, `PayinWebhookEvent` and `PayoutWebhookEvent`.

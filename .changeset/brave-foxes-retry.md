---
"@blindpay/node": minor
---

**Behaviour change: requests now time out after 60 seconds per attempt and are retried automatically (2 retries by default).** Pass `maxRetries: 0` to `new BlindPay(...)` to turn retries off and `timeoutMs` to change the timeout. Mutations are only retried under an `Idempotency-Key` (the SDK generates one when you don't pass one) and only when the API can't have acted: no response, 429, or a concurrent duplicate (409). A mutation that gets a 5xx is never resent automatically; its error has `retryable: true` and the `idempotency_key` to resend with after checking whether the resource was created.

- **Client options**: `baseUrl`, `timeoutMs`, `maxRetries` and an injectable `fetch`.
- **Per-call options on every method**, GETs included: `idempotencyKey`, `timeoutMs`, `headers` and `signal`. An empty `idempotencyKey`, or one longer than 255 characters, is now rejected before anything is sent (the API silently ignored an empty one).
- **Errors** carry `status` (0 when no response arrived), `request_id`, `idempotency_key`, `retryable` and `type` (`api_error`, `connection_error`, `timeout_error`, `aborted`, `invalid_request`, `invalid_response`). A non-JSON error body (for example an HTML 502) gives `HTTP 502 Bad Gateway` instead of a JSON parse message. `Content-Type` is only sent with a body.
- **Auto-pagination**: `listAutoPaging()` on payouts, payins, customers, payables and transfers, and `wallets.custodial.getDepositsAutoPaging()`, as async iterators (`for await (const payout of blindpay.payouts.listAutoPaging()) {}`). A failed page throws a `BlindPayError` whose new `error` property holds the `ErrorResponse`.
- **Webhooks without a client**: `verifyWebhook(payload, headers, secret)` and `constructWebhookEvent(payload, headers, secret)`; an event newer than the SDK comes back as an `UnknownWebhookEvent` (check `isUnknownWebhookEvent`). The client methods keep working as before.
- `instances.tos.initiate` and the upload methods also take the trailing options argument.

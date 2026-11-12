---
"@blindpay/node": minor
---

Typed error codes, an injectable webhook clock and package fixes:

- `ErrorCode` (every code in the API's error catalogue, generated from the spec; codes newer than the SDK still arrive as plain strings), `errorCodeInfo(code)` (typical status and retry class), and `RetryClass` / `ErrorCodeInfo` types. `ErrorResponse.code` is now typed `ErrorCode`, and every returned error carries `retry_class` (`retryable`, `terminal`, `actionable` or `unknown`). Automatic retries are unchanged.
- Webhook verification takes `now` (a `Date` or Unix seconds) in `WebhookVerifyOptions` and in the client's `verifyWebhookSignature` / `constructWebhookEvent` input.
- `EstimatedTimeOfArrival`, `BlindpaySuccessResponse` and `BlindpayErrorResponse` are exported from the package root.
- `package.json` `exports` gives ESM consumers `index.d.mts` (fixes the "masquerading as CJS" types under `node16`/`nodenext`) and exposes `@blindpay/node/package.json`.
- Transport error messages no longer include a URL query string (list filters can carry personal data).
- `CreateTransferQuoteInput.request_amount` documents the 100 USDC minimum for swaps between different tokens (`TRANSFERS_SWAP_AMOUNT_BELOW_MINIMUM`).

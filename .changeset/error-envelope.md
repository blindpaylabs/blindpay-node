---
"@blindpay/node": minor
---

Errors carry the API's full error envelope. Besides `message`, `error` now has `code` (a stable code such as `PAYOUTS_INSUFFICIENT_BALANCE`, preferred for programmatic handling), `description` (safe to show to end users), `errors`, and `trace_id` (include it when contacting support) whenever the API sends them.

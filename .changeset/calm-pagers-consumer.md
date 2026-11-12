---
"@blindpay/node": patch
---

Fixes from a consumer test of 6.2.0:

- `baseUrl` accepts the host with or without a trailing `/v1` or `/` (`http://localhost:4010/v1` used to request `/v1/v1/...` and get a 404).
- Aborting a call while the SDK waits to retry now resolves to an `aborted` error (status 0, with the `idempotency_key` to resume) instead of the earlier HTTP error.
- Optional client, per-call and webhook options accept an explicit `undefined` under `exactOptionalPropertyTypes` (e.g. `baseUrl: process.env.BLINDPAY_BASE_URL`).
- Auto-pagers throw a `BlindPayError` when the server repeats a `next_page` cursor or cycles back to an earlier one, instead of paging forever.
- Every README snippet compiles as pasted (no top-level `return`), and the published type declarations no longer reference internal documents.

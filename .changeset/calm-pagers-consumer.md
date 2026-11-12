---
"@blindpay/node": patch
---

Fixes from a consumer test of 6.2.0. Two behaviour changes:

- **A `baseUrl` ending in `/v1` is now normalized**: trailing slashes and a single trailing `/v1` are dropped, so `http://localhost:4010/v1` no longer requests `/v1/v1/...` (a 404). A proxy mounted at a path ending in `/v1` passes that path followed by `/v1` (e.g. `https://proxy.example.com/v1/v1`).
- **An abort during a retry wait now returns `type: "aborted"`** (status 0, no `code`, with the `idempotency_key` to resume) instead of the last HTTP error.

Also:

- Optional client, per-call and webhook options accept an explicit `undefined` under `exactOptionalPropertyTypes` (e.g. `baseUrl: process.env.BLINDPAY_BASE_URL`).
- Auto-pagers throw a `BlindPayError` when the server repeats a `next_page` cursor or cycles back to an earlier one, instead of paging forever.
- Every README snippet compiles as pasted (no top-level `return`), and the published type declarations no longer reference internal documents.

---
"@blindpay/node": minor
---

Runtime fixes, and the types you need are now importable from the package root:

- List methods (`payouts`, `payins`, `customers`, `payables`, `transfers` and `customers.bankAccounts`) no longer send unset filters as the text `"undefined"` (`list({ status: undefined })` used to send `?status=undefined`), and `list({})` no longer adds a bare `?`.
- New root exports: the shared types (`RequestOptions`, `ErrorResponse`, `BlindpayApiResponse`, `SuccessResponse`, `Network`, `Currency`, `Rail`, `Country`, `PaginationParams`, `PaginationMetadata`, `TransactionStatus` and the other types the SDK's methods use), `BlindPayError`, `BlindPayOptions` (the constructor options) and the terms-of-service `InitiateInput` / `InitiateResponse`.
- `BlindPayError`'s `name` is now `"BlindPayError"`, matching the class; it used to be `"BlindpayError"`, so update any check against the old string.
- The published package no longer includes test bundles (17.6 MB unpacked down to about 0.5 MB).
- `upload.upload` and `upload.analyze` now resolve to `{ data: null, error }` on a network failure or a non-JSON response instead of rejecting, like every other method.

---
"@blindpay/node": minor
---

Add `customer.new`, `customer.update` and `customer.delete` to `WebhookEvents` (the deployed API has been dual-emitting these alongside the legacy `receiver.*` events since June). Mark the `receiver.*` webhook events `@deprecated` in place; they still fire and are not removed.

Add `customer_id` as an accepted filter on `ListPayinsInput` and `ListPayoutsInput`, matching what the deployed API already accepts. Drop the internal `customer_id`/`customer_name` -> `receiver_id`/`receiver_name` query translation in the `customers` resource's `list()` now that the deployed API accepts the `customer_*` filter names natively.

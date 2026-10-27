---
"@blindpay/node": minor
---

Every method that creates, updates or deletes something takes an optional last argument, `{ idempotencyKey }`, sent as the `Idempotency-Key` header. Retrying with the same key and the same input replays the original response instead of acting twice (for example, a payout retried after a timeout is not created again). Keys are kept for 24 hours; file uploads and the unauthenticated terms-of-service route ignore them.

# BlindPay Node.js SDK

The official Node.js SDK for [BlindPay](https://blindpay.com) - Stablecoin API for global payments.

## Installation

```bash
npm install @blindpay/node
# or
yarn add @blindpay/node
# or
pnpm add @blindpay/node
# or
bun add @blindpay/node
```

Requires Node.js 18 or later.

## Configuration

You need your API key and your instance id, both on the BlindPay dashboard: [https://app.blindpay.com/instances/{instanceId}/api-keys](https://app.blindpay.com/instances/{instanceId}/api-keys).

```typescript
import { BlindPay } from '@blindpay/node';

const blindpay = new BlindPay({
  apiKey: process.env.BLINDPAY_API_KEY!,
  instanceId: process.env.BLINDPAY_INSTANCE_ID!,
  // All optional:
  timeoutMs: 60_000, // per attempt (default 60 s)
  maxRetries: 2,     // automatic retries (default 2; 0 turns them off), see "Retries"
  // baseUrl: 'https://api.blindpay.com', // e.g. a proxy; it receives your API key
  // fetch: myFetch,                       // a custom fetch, e.g. for tests
});
```

`baseUrl` is the host only: the SDK adds `/v1` to every path. Trailing slashes and a single trailing `/v1` are dropped, so `http://localhost:4010` and `http://localhost:4010/v1/` send the same requests. If your proxy itself is mounted at a path ending in `/v1`, pass that full mount path followed by the API's `/v1` (`baseUrl: 'https://proxy.example.com/v1/v1'`): only one trailing `/v1` is stripped, so requests go to `https://proxy.example.com/v1/v1/...`. Options set to `undefined` (say, `baseUrl: process.env.BLINDPAY_BASE_URL`) fall back to their defaults.

The snippets below use this `blindpay` client.

Every call uses this API key and instance id. A configured client is immutable: create it once and share it, since per-call options never change it. `console.log(blindpay)` and `JSON.stringify(blindpay)` show the configuration with the API key redacted.

Every method also takes an optional last argument with per-call options: `idempotencyKey` (on create, update and delete calls), `timeoutMs`, `headers` and an `AbortSignal` as `signal`. Aborting, even while the SDK waits to retry, resolves to an error with `type: 'aborted'`.

```typescript
const { data, error } = await blindpay.payouts.get('po_000000000000', { timeoutMs: 10_000 });
```

## Quick start

```typescript
const { data, error } = await blindpay.available.getRails();

if (error) {
  throw new Error(error.message);
}

console.log('Rails:', data);
```

## Responses and errors

Methods never throw for API or network failures. They resolve to `{ data, error }`: exactly one of the two is `null`.

```typescript
async function listPayins() {
  const { data, error } = await blindpay.payins.list();

  if (error) {
    console.error(error.status, error.code ?? error.message, error.request_id);
    return;
  }

  console.log(data); // fully typed
}
```

`error` is an `ErrorResponse`:

| Field | Meaning |
|---|---|
| `message` | Always present. |
| `status` | HTTP status; `0` when no response arrived. |
| `type` | `api_error`, `connection_error`, `timeout_error`, `aborted`, `invalid_request` (rejected before sending) or `invalid_response`. |
| `code` | Stable, UPPERCASE error code from the API (e.g. `PAYOUTS_INSUFFICIENT_BALANCE`), when it sends one. Branch on this, not on `message`. Typed as `ErrorCode`: the known codes autocomplete, and codes newer than the SDK still arrive as plain strings. |
| `retry_class` | What the API's error catalogue says about `code`: `retryable` (send it again as is), `terminal` (don't retry), `actionable` (fix something first, such as funding a balance), or `unknown` (a code newer than the SDK). Present only when `code` is. |
| `description` | Text that is safe to show to end users, when present. |
| `errors` | Field-level validation errors, when present. |
| `trace_id`, `request_id` | Include them when you contact support. |
| `retryable` | `true` when resending the same request is safe. |
| `idempotency_key` | The `Idempotency-Key` the request used (yours, or the one the SDK generated). |

Branch on `code` with the `ErrorCode` constants. Some errors (idempotency conflicts, for instance) carry no `code`, so keep `message` as the fallback:

```typescript
import { ErrorCode, errorCodeInfo, type CreateTransferQuoteInput } from '@blindpay/node';

async function quoteTransfer(input: CreateTransferQuoteInput) {
  const { data, error } = await blindpay.transfers.quotes.create(input);

  if (error) {
    if (error.code === ErrorCode.TRANSFERS_SWAP_AMOUNT_BELOW_MINIMUM) {
      // Swaps between different tokens need at least 100 USDC, measured on the USDC side.
      return { ok: false, reason: 'Send at least 100 USDC' } as const;
    }
    if (error.retry_class === 'actionable') {
      return { ok: false, reason: error.description ?? error.message } as const; // safe to show
    }
    throw new Error(error.code ?? error.message);
  }

  return { ok: true, quote: data } as const;
}

errorCodeInfo('QUOTES_EXPIRED'); // { status: 400, retry: 'actionable' }; undefined for unknown codes
```

`ErrorCode` is generated from the API's error catalogue (the "Errors" section of the [API reference](https://api.blindpay.com/reference)). `retry_class` is advice for your own handling; the SDK's automatic retries are described under [Idempotency and retries](#idempotency-and-retries).

A non-JSON error body (an HTML 502 page, for instance) becomes `HTTP 502 Bad Gateway`. Errors never contain your API key or the request body.

`BlindPayError` (exported from the package root) is only thrown by the constructor for invalid options, by webhook verification, and by auto-pagers when a page fails (its `error` property holds the `ErrorResponse`).

## Idempotency and retries

Create, update and delete calls accept an `idempotencyKey`. Retrying with the same key and the same input replays the original response instead of acting twice. Keys are kept for 24 hours and must be 1 to 255 characters (an empty key is rejected before sending, because the API would silently ignore it).

```typescript
import { randomUUID } from 'node:crypto';

const idempotencyKey = randomUUID(); // reuse it only to retry this same call

const { data, error } = await blindpay.payouts.createEvm(
  { quote_id: 'qu_000000000000', wallet_id: 'wa_000000000000' },
  { idempotencyKey }
);
```

The SDK retries on its own (up to `maxRetries`, with exponential backoff and `Retry-After`):

- **Reads (GET)**: no response or timeout, 408, 429, 500, 502, 503 and 504.
- **Create, update and delete calls**: only when the API can't have acted: no response or timeout, 429, and `409 idempotency_key_in_flight`. When you don't pass a key and retries are on, the SDK generates one before the first attempt, so a retry can never act twice.
- **Never a create, update or delete that got a 5xx.** The API releases the key on a 5xx, so a resend would run again. You get the error with `retryable: true` and its `idempotency_key` instead.

**If a create or payout returns a 5xx, look the resource up (by quote, external id, or a list filter) before resending. Resend with the same `idempotency_key` from the error.**

Uploads are never retried and never carry an idempotency key.

## Rate limits

Indicative FX quote endpoints are rate limited per instance; a limited call returns 429 `AUTH_RATE_LIMITED` with a `Retry-After` header, which the SDK honours when it retries.

## Pagination

`list()` on payouts, payins, customers and payables returns a bare array when you pass no `limit`, `starting_after` or `ending_before`, and **that array holds every matching row**. With any of them it returns `{ data, pagination: { has_more, next_page, prev_page } }`; pass `next_page` back as `starting_after`. Transfers and wallet deposits always return the envelope. Other lists (bank accounts, wallets, partner fees, ...) are always plain arrays.

For anything large, use the auto-pager. It requests pages of 100 and follows the cursor:

```typescript
for await (const payout of blindpay.payouts.listAutoPaging({ status: 'completed' })) {
  console.log(payout.id, payout.sender_amount);
}
```

Auto-pagers exist for `payouts`, `payins`, `customers`, `payables` and `transfers` (`listAutoPaging`) and for wallet deposits (`wallets.custodial.getDepositsAutoPaging`). A failed page throws a `BlindPayError`.

## Units

- Payout, payin, quote and limit **amounts are integer cents**: `1000` is 10.00.
- Partner **percentage fees are basis points** (`100` is 1%); partner flat fees are cents.
- **Wallet balances are whole tokens** (`10.5` is 10.5 USDC), and so is `total_fee_amount` on payouts and payins.
- Swaps between different tokens (`transfers.quotes.create` with `sender_token` and `customer_token` that differ) need **at least 100 USDC**, measured on the USDC side; smaller ones fail with `ErrorCode.TRANSFERS_SWAP_AMOUNT_BELOW_MINIMUM`.
- Payout creates take **exactly one of** `sender_wallet_address` and `wallet_id`; quotes take exactly one of `bank_account_id` and `payable_id`. The API returns 400 otherwise.

## File uploads

```typescript
import { readFile } from 'node:fs/promises';

const file = { file: await readFile('contract.pdf'), filename: 'contract.pdf', contentType: 'application/pdf' };

const uploaded = await blindpay.upload.upload({ ...file, bucket: 'documents' });
const analysis = await blindpay.upload.analyze({ ...file, type: 'invoice' });
const link = await blindpay.upload.presign({ file_url: uploaded.data!.file_url });
```

`file` takes a `File`, a `Blob`, or raw bytes (a `Buffer`/`Uint8Array` or an `ArrayBuffer`); `filename` and `contentType` name and type it. Uploads are sent as `multipart/form-data` for the client's own instance (the `instance_id` input is deprecated). The API requires a completed onboarding for them.

## Webhooks

Verify every delivery against the **raw** request body (with Express: `express.raw({ type: 'application/json' })`); a re-serialized object never matches the signature. `constructWebhookEvent` needs no client; it throws a `BlindPayError` when verification fails, and returns an event newer than this SDK as an `UnknownWebhookEvent`.

```typescript
import express from 'express';
import { constructWebhookEvent, isUnknownWebhookEvent } from '@blindpay/node';

const app = express();
const handled = new Set<string>(); // use your database

app.post('/webhooks/blindpay', express.raw({ type: 'application/json' }), (req, res) => {
  let event;
  try {
    event = constructWebhookEvent(req.body, req.headers, process.env.BLINDPAY_WEBHOOK_SECRET!);
  } catch {
    return res.sendStatus(400);
  }

  // Deliveries can repeat: skip an svix-id you already handled.
  const deliveryId = String(req.headers['svix-id']);
  if (handled.has(deliveryId)) return res.sendStatus(200);
  handled.add(deliveryId);

  if (!isUnknownWebhookEvent(event)) {
    switch (event.webhook_event) {
      case 'payout.complete':
      case 'payout.update':
        // A failed payout can arrive on either event: branch on status.
        if (event.status === 'failed') { /* ... */ }
        break;
      case 'customer.update':
        console.log('KYC status:', event.kyc_status);
        break;
    }
  }
  res.sendStatus(200);
});
```

`verifyWebhook(payload, headers, secret)` returns a boolean instead. Both accept `{ tolerance, now }` as a last argument: `tolerance` in seconds (default 300), and `now` (a `Date` or Unix seconds) to check the timestamp against a fixed time in tests or replays. Never log the `whsec_` secret. The client methods `blindpay.constructWebhookEvent({ secret, headers, payload })` and `blindpay.verifyWebhookSignature(...)` keep working as before.

## Limit increases

`customers.getLimitIncreaseRequests(customerId)` and the `limitIncrease.new` / `limitIncrease.update` webhooks carry `review_reason`: why compliance rejected the request or approved lower limits than requested, and what to send to get the full amount. It is set when the request is rejected or approved below the requested limits, and `null` otherwise.

## Tracking endpoints

`payouts.getTrack`, `payins.getTrack` and `transfers.getTrack` call BlindPay's public tracking routes, which serve BlindPay's own web and iOS apps. In production a server-side call gets a 401: use `payouts.get(id)` (and so on) instead.

## Testing against a development instance

- A payout of `66600` (666.00) fails and one of `77700` refunds.
- Payins complete in about 30 seconds.
- Quotes expire after 5 minutes (OTC payin quotes after 10 seconds; SEPA quotes can expire sooner).
- Development instances are rate limited on every instance route; the SDK retries a 429 after its `Retry-After`.

## Examples

[`examples/`](examples) has four end-to-end workflows, type-checked in CI: webhook setup, verification and dedupe (E1), funding a managed wallet with a payin and paying out from it with `wallet_id` (E2), a fiat payin, and reconciliation with the auto-pager.

For the full API documentation, see:
- [BlindPay API documentation](https://blindpay.com/docs/getting-started/overview)
- [API Reference](https://api.blindpay.com/reference)

## Releasing

Maintainers: see [RELEASING.md](RELEASING.md) for the release flow, secrets and how to verify a published version.

## Support

- 📧 Email: [support@blindpay.com](mailto:support@blindpay.com)
- 🐛 Issues: [GitHub Issues](https://github.com/blindpaylabs/blindpay-node/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Made with ❤️ by the [BlindPay](https://blindpay.com) team

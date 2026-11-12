// Type test, compiled by scripts/check-consumer-types.mjs against the built package with
// `exactOptionalPropertyTypes` (and the rest of a strict consumer tsconfig). Every optional
// option must accept an explicit `undefined`, e.g. a value read from an unset env variable.
import {
    BlindPay,
    type BlindPayOptions,
    constructWebhookEvent,
    type RequestOptions,
    verifyWebhook,
    type WebhookVerifyOptions,
} from "@blindpay/node";

const env: Record<string, string | undefined> = process.env;
const fromEnv = (name: string): number | undefined =>
    env[name] === undefined ? undefined : Number(env[name]);

const options: BlindPayOptions = {
    apiKey: "sk_test",
    instanceId: "in_000000000000",
    baseUrl: env.BLINDPAY_BASE_URL,
    timeoutMs: fromEnv("BLINDPAY_TIMEOUT_MS"),
    maxRetries: fromEnv("BLINDPAY_MAX_RETRIES"),
    fetch: undefined,
};
const blindpay = new BlindPay(options);

const perCall: RequestOptions = {
    idempotencyKey: env.IDEMPOTENCY_KEY,
    timeoutMs: undefined,
    headers: undefined,
    signal: undefined,
};
await blindpay.payouts.get("po_000000000000", perCall);

const verify: WebhookVerifyOptions = { tolerance: undefined, now: undefined };
verifyWebhook("{}", {}, "whsec_x", verify);
try {
    constructWebhookEvent("{}", {}, "whsec_x", verify);
} catch {
    // verification fails here; only the types matter
}
blindpay.verifyWebhookSignature({
    secret: "whsec_x",
    payload: "{}",
    headers: { id: "msg_1", timestamp: "0", signature: "v1,x" },
    tolerance: undefined,
    now: undefined,
});

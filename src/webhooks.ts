import { Webhook } from "svix";
import { BlindPayError } from "./internal/blindpay-error";
import { WEBHOOK_EVENT_NAMES } from "./internal/webhook-event-names";
import type { WebhookEvent } from "./resources/webhooks/events";

/**
 * The webhook request's headers: a Fetch `Headers` or a plain object such as Express's
 * `req.headers`. Looked up case-insensitively; `svix-*` and `webhook-*` names both work.
 */
export type WebhookHeaders = Headers | Record<string, string | string[] | undefined>;

declare const unknownWebhookEventName: unique symbol;

/** An event name this SDK version doesn't know yet (any string outside `WebhookEvents`). */
export type UnknownWebhookEventName = string & { readonly [unknownWebhookEventName]: true };

/**
 * A verified event this SDK version doesn't know yet (newer than the SDK). Check for it with
 * `isUnknownWebhookEvent` before a `switch` on `webhook_event`, which then narrows each known
 * event to its own payload type.
 */
export type UnknownWebhookEvent = {
    webhook_event: UnknownWebhookEventName;
    /** The whole verified payload, as received. */
    raw: Record<string, unknown>;
};

const KNOWN_EVENTS: ReadonlySet<string> = new Set(WEBHOOK_EVENT_NAMES);

/**
 * Checks a BlindPay webhook's Svix signature and timestamp (5 minute tolerance). Needs no API
 * key or client. Never throws.
 *
 * @param payload The raw request body, exactly as received: a string, or the bytes (a `Buffer`
 *   from `express.raw()` is fine); re-serialised JSON has different bytes and fails.
 * @param headers The request headers (`svix-id`, `svix-timestamp`, `svix-signature`).
 * @param secret The endpoint secret (`whsec_...`) from `instances.webhookEndpoints.getSecret`.
 *   Never log it.
 * @returns `true` when the signature matches and the timestamp is within tolerance.
 */
export function verifyWebhook(
    payload: string | Uint8Array,
    headers: WebhookHeaders,
    secret: string
): boolean {
    try {
        verifyWithSvix(payload, headers, secret);
        return true;
    } catch {
        return false;
    }
}

/**
 * Verifies a webhook like `verifyWebhook` and returns its payload, typed by `webhook_event`.
 * An event this SDK version doesn't know comes back as an `UnknownWebhookEvent` instead of an
 * error. Deduplicate on the `svix-id` header: a webhook can be delivered more than once.
 *
 * @throws {BlindPayError} When the signature or timestamp doesn't verify
 */
export function constructWebhookEvent(
    payload: string | Uint8Array,
    headers: WebhookHeaders,
    secret: string
): WebhookEvent | UnknownWebhookEvent {
    const body = verifyOrThrow(payload, headers, secret);
    if (
        isRecord(body) &&
        typeof body.webhook_event === "string" &&
        KNOWN_EVENTS.has(body.webhook_event)
    ) {
        return body as WebhookEvent;
    }
    const name = isRecord(body) && typeof body.webhook_event === "string" ? body.webhook_event : "";
    return {
        webhook_event: name as UnknownWebhookEventName,
        raw: isRecord(body) ? body : { value: body },
    };
}

/** `true` for an event this SDK version doesn't know (see `UnknownWebhookEvent`). */
export function isUnknownWebhookEvent(
    event: WebhookEvent | UnknownWebhookEvent
): event is UnknownWebhookEvent {
    return !KNOWN_EVENTS.has(event.webhook_event);
}

/** Verifies and returns the parsed payload, or throws a `BlindPayError`. */
export function verifyOrThrow(
    payload: string | Uint8Array,
    headers: WebhookHeaders,
    secret: string
): unknown {
    try {
        return verifyWithSvix(payload, headers, secret);
    } catch (error) {
        throw new BlindPayError(
            `Webhook verification failed: ${error instanceof Error ? error.message : String(error)}`
        );
    }
}

function verifyWithSvix(
    payload: string | Uint8Array,
    headers: WebhookHeaders,
    secret: string
): unknown {
    // svix takes a string or a Buffer; a Buffer view over the same bytes avoids a copy.
    const body =
        typeof payload === "string"
            ? payload
            : Buffer.from(payload.buffer, payload.byteOffset, payload.byteLength);
    return new Webhook(secret).verify(body, toHeaderRecord(headers));
}

function toHeaderRecord(headers: WebhookHeaders): Record<string, string> {
    const record: Record<string, string> = {};
    if (headers instanceof Headers) {
        headers.forEach((value, key) => {
            record[key.toLowerCase()] = value;
        });
        return record;
    }
    for (const [key, value] of Object.entries(headers)) {
        if (value === undefined) continue;
        record[key.toLowerCase()] = Array.isArray(value) ? value.join(" ") : value;
    }
    return record;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

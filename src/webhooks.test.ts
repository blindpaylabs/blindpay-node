import { readdirSync } from "node:fs";
import { join } from "node:path";
import { Webhook } from "svix";
import { afterEach, describe, expect, expectTypeOf, it, vi } from "vitest";
import { BlindPay } from "./client";
import { BlindPayError } from "./internal/blindpay-error";
import { readFixture } from "./internal/test-fixtures";
import { WEBHOOK_EVENT_NAMES } from "./internal/webhook-event-names";
import type { WebhookEvents } from "./resources/webhooks";
import type { PayoutWebhookEvent, WebhookEvent } from "./resources/webhooks/events";
import {
    constructWebhookEvent,
    isUnknownWebhookEvent,
    type UnknownWebhookEvent,
    verifyWebhook,
} from "./webhooks";

type Vector = {
    name: string;
    secret: string;
    headers: Record<string, string>;
    payload: string;
    now: number;
    expect: "valid" | "invalid";
    event?: string;
};

const { vectors } = readFixture<{ vectors: Vector[] }>("../webhook-vectors.json");

const SECRET = "whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw";

/** Signs `payload` the way BlindPay (Svix) does, at the current (fake) time. */
function signed(payload: string, id = "msg_000000000000") {
    const at = new Date();
    return {
        "svix-id": id,
        "svix-timestamp": Math.floor(at.getTime() / 1000).toString(),
        "svix-signature": new Webhook(SECRET).sign(id, at, payload),
    };
}

afterEach(() => {
    vi.useRealTimers();
});

describe("webhook test vectors (sdk-parity, 14 cases)", () => {
    it("has all 14 vectors", () => {
        expect(vectors).toHaveLength(14);
    });

    describe.each(vectors)("$name", (vector) => {
        const atVectorTime = () => {
            // Only Date is faked: Svix reads the clock through Date.now().
            vi.useFakeTimers({ toFake: ["Date"] });
            vi.setSystemTime(vector.now * 1000);
        };
        const valid = vector.expect === "valid";

        it(`verifyWebhook returns ${valid}`, () => {
            atVectorTime();
            expect(verifyWebhook(vector.payload, vector.headers, vector.secret)).toBe(valid);
        });

        it("gives the same answer through the client's verifyWebhookSignature", () => {
            atVectorTime();
            const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });
            const result = blindpay.verifyWebhookSignature({
                secret: vector.secret,
                payload: vector.payload,
                headers: {
                    id: vector.headers["svix-id"] ?? "",
                    timestamp: vector.headers["svix-timestamp"] ?? "",
                    signature: vector.headers["svix-signature"] ?? "",
                },
            });
            expect(result).toBe(valid);
        });

        it(
            valid ? "constructWebhookEvent returns the event" : "constructWebhookEvent throws",
            () => {
                atVectorTime();
                const construct = () =>
                    constructWebhookEvent(vector.payload, vector.headers, vector.secret);
                if (!valid) {
                    expect(construct).toThrow(BlindPayError);
                    return;
                }
                const event = construct();
                const payload = JSON.parse(vector.payload);
                if (isUnknownWebhookEvent(event)) {
                    expect(event).toEqual({ webhook_event: payload.webhook_event, raw: payload });
                } else {
                    expect(event).toEqual(payload);
                }
                if (vector.event) expect(event.webhook_event).toBe(vector.event);
            }
        );
    });
});

describe("verifyWebhook", () => {
    const payload = JSON.stringify({ webhook_event: "payout.complete", id: "pa_000000000000" });

    it("needs no client: payload, headers and secret are enough", () => {
        expect(verifyWebhook(payload, signed(payload), SECRET)).toBe(true);
    });

    it("accepts a Fetch Headers object and the body as a Buffer or plain Uint8Array", () => {
        const headers = new Headers(signed(payload));
        expect(verifyWebhook(Buffer.from(payload), headers, SECRET)).toBe(true);
        expect(verifyWebhook(new TextEncoder().encode(payload), headers, SECRET)).toBe(true);
        expect(verifyWebhook(new TextEncoder().encode(`${payload} `), headers, SECRET)).toBe(false);
    });

    it("looks headers up case-insensitively and accepts the webhook-* aliases", () => {
        const { "svix-id": id, "svix-timestamp": ts, "svix-signature": sig } = signed(payload);
        expect(
            verifyWebhook(
                payload,
                { "Svix-Id": id, "SVIX-TIMESTAMP": ts, "svix-signature": sig },
                SECRET
            )
        ).toBe(true);
        expect(
            verifyWebhook(
                payload,
                { "webhook-id": id, "webhook-timestamp": ts, "webhook-signature": sig },
                SECRET
            )
        ).toBe(true);
    });

    it("joins a signature header that arrives as an array (Node's IncomingHttpHeaders)", () => {
        const headers = signed(payload);
        expect(
            verifyWebhook(
                payload,
                { ...headers, "svix-signature": ["v1,AAAA", headers["svix-signature"]] },
                SECRET
            )
        ).toBe(true);
    });

    it("returns false, never throws, for a malformed secret or missing headers", () => {
        expect(verifyWebhook(payload, signed(payload), "whsec_%%%not-base64%%%")).toBe(false);
        expect(verifyWebhook(payload, {}, SECRET)).toBe(false);
    });
});

describe("constructWebhookEvent", () => {
    const webhookFiles = readdirSync(join(__dirname, "../test/fixtures/spec/webhooks")).filter(
        (name) => name.endsWith(".json") && !name.startsWith("_")
    );

    type WebhookFixture = { event: string; variants: Record<string, Record<string, unknown>> };

    it("covers every event the SDK knows with a shared fixture", () => {
        expect(webhookFiles.map((f) => f.replace(/\.json$/, "")).sort()).toEqual(
            [...WEBHOOK_EVENT_NAMES].sort()
        );
    });

    describe.each(webhookFiles)("%s", (file) => {
        const fixture = readFixture<WebhookFixture>(`webhooks/${file}`);

        it.each(Object.entries(fixture.variants))(
            "returns the %s variant as a known, typed event",
            (_variant, body) => {
                const payload = JSON.stringify(body);

                const event = constructWebhookEvent(payload, signed(payload), SECRET);

                expect(isUnknownWebhookEvent(event)).toBe(false);
                expect(event).toEqual(body);
                expect(event.webhook_event).toBe(fixture.event);
            }
        );
    });

    it("returns an event newer than the SDK as UnknownWebhookEvent instead of throwing", () => {
        const fixture = readFixture<WebhookFixture>("webhooks/_unknown_event.json");
        const body = fixture.variants.full;
        const payload = JSON.stringify(body);

        const event = constructWebhookEvent(payload, signed(payload), SECRET);

        expect(isUnknownWebhookEvent(event)).toBe(true);
        expect(event).toEqual({ webhook_event: "zz.future_event", raw: body });
    });

    it("throws a BlindPayError when verification fails", () => {
        const payload = JSON.stringify({ webhook_event: "payout.complete" });
        expect(() => constructWebhookEvent(`${payload} `, signed(payload), SECRET)).toThrow(
            BlindPayError
        );
    });

    it("keeps the runtime event list equal to the WebhookEvents union", () => {
        expectTypeOf<(typeof WEBHOOK_EVENT_NAMES)[number]>().toEqualTypeOf<WebhookEvents>();
    });

    it("narrows known events with a switch once unknown events are handled", () => {
        const handle = (event: WebhookEvent | UnknownWebhookEvent): string => {
            if (isUnknownWebhookEvent(event)) return `unknown ${event.webhook_event}`;
            switch (event.webhook_event) {
                case "payout.complete":
                    // Narrowed to the payout payload alone, the unknown variant excluded.
                    expectTypeOf(event).toEqualTypeOf<PayoutWebhookEvent>();
                    return event.status;
                case "tos.accept":
                    return event.tos_id;
                default:
                    return event.webhook_event;
            }
        };
        expect(handle({ webhook_event: "tos.accept", tos_id: "to_1" } as WebhookEvent)).toBe(
            "to_1"
        );
    });
});

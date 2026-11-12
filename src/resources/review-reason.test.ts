import { Webhook } from "svix";
import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../client";
import { readFixture, responseVariants } from "../internal/test-fixtures";
import { constructWebhookEvent } from "../webhooks";
import type { GetLimitIncreaseRequestsResponse } from "./customers";
import type { LimitIncreaseWebhookEvent } from "./webhooks/events";

// A fake signing key built at runtime for these tests; not a credential.
const SECRET = `whsec_${Buffer.from("blindpay-node-test-only-signing-key").toString("base64")}`;

function signed(payload: string) {
    const at = new Date();
    return {
        "svix-id": "msg_000000000000",
        "svix-timestamp": Math.floor(at.getTime() / 1000).toString(),
        "svix-signature": new Webhook(SECRET).sign("msg_000000000000", at, payload),
    };
}

/** The variant named `name` of a webhook fixture. */
function webhookVariant(event: string, name: string): Record<string, unknown> {
    const fixture = readFixture<{ variants: Record<string, Record<string, unknown>> }>(
        `webhooks/${event}.json`
    );
    const variant = fixture.variants[name];
    if (!variant) throw new Error(`no ${name} variant for ${event}`);
    return variant;
}

describe("review_reason on limit-increase requests", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });
    const variants = new Map(
        responseVariants("GET /v1/instances/{instance_id}/customers/{customer_id}/limit-increase")
    );

    async function get(variant: string): Promise<GetLimitIncreaseRequestsResponse> {
        fetchMock.mockResponseOnce(JSON.stringify(variants.get(variant)), {
            headers: { "Content-Type": "application/json" },
        });
        const { data, error } =
            await blindpay.customers.getLimitIncreaseRequests("re_000000000000");
        expect(error).toBeNull();
        if (!data) throw new Error("no data");
        return data;
    }

    it("is a non-empty string on the full GET variant", async () => {
        const [request] = await get("full");
        expect(typeof request.review_reason).toBe("string");
        expect(request.review_reason?.length).toBeGreaterThan(0);
    });

    it("is null on the nullables_null GET variant", async () => {
        const [request] = await get("nullables_null");
        expect(request.review_reason).toBeNull();
    });

    it("is absent on the required_only GET variant", async () => {
        const [request] = await get("required_only");
        expect(request.review_reason).toBeUndefined();
    });

    for (const event of ["limitIncrease.new", "limitIncrease.update"] as const) {
        function construct(variant: string): LimitIncreaseWebhookEvent {
            const payload = JSON.stringify(webhookVariant(event, variant));
            const parsed = constructWebhookEvent(payload, signed(payload), SECRET);
            expect(parsed.webhook_event).toBe(event);
            return parsed as LimitIncreaseWebhookEvent;
        }

        it(`is a non-empty string on the full ${event} webhook`, () => {
            const parsed = construct("full");
            expect(typeof parsed.review_reason).toBe("string");
            expect(parsed.review_reason?.length).toBeGreaterThan(0);
        });

        it(`is null on the nullables_null ${event} webhook`, () => {
            expect(construct("nullables_null").review_reason).toBeNull();
        });
    }
});

import { Webhook } from "svix";
import { describe, expect, expectTypeOf, it } from "vitest";
import { BlindPay } from "../../client";
import { BlindPayError } from "../../internal/blindpay-error";
import type { WebhookEvents } from ".";
import type { WebhookEvent } from "./events";

describe("Webhook events", () => {
    const secret = "whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw";
    const id = "msg_000000000000";
    const timestamp = new Date();

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });
    const sign = (body: string) => new Webhook(secret).sign(id, timestamp, body);
    const headers = (signature: string) => ({
        id,
        timestamp: Math.floor(timestamp.getTime() / 1000).toString(),
        signature,
    });

    it("has exactly one union member per webhook event name", () => {
        expectTypeOf<WebhookEvent["webhook_event"]>().toEqualTypeOf<WebhookEvents>();
    });

    it("returns the verified payload as a typed event", () => {
        const tosAccept = {
            webhook_event: "tos.accept",
            tos_id: "to_000000000000",
            idempotency_key: "7c4f5f8e-5b0e-4a3b-9d5f-2f1c0e6a8b9d",
            customer_id: null,
            version: "1.0.1",
        } satisfies WebhookEvent;
        const payload = JSON.stringify(tosAccept);

        const event = blindpay.constructWebhookEvent({
            secret,
            headers: headers(sign(payload)),
            payload,
        });

        expect(event).toEqual(tosAccept);
        if (event.webhook_event !== "tos.accept") {
            throw new Error(`unexpected event ${event.webhook_event}`);
        }
        expectTypeOf(event.tos_id).toEqualTypeOf<string>();
        expect(event.tos_id).toBe("to_000000000000");
    });

    it("narrows each event to its own payload shape", () => {
        const handle = (event: WebhookEvent): string => {
            switch (event.webhook_event) {
                case "customer.update":
                    return event.kyc_status;
                case "customer.delete":
                    return event.deleted_at;
                case "wallet.inbound":
                    return event.token.symbol;
                case "payout.complete":
                    return event.sender_wallet_address;
                case "payin.complete":
                    return event.blindpay_bank_details.beneficiary.name;
                case "transfer.complete":
                    return event.tracking_complete.step;
                default:
                    return event.webhook_event;
            }
        };

        const deleted = {
            webhook_event: "customer.delete",
            id: "cu_000000000000",
            customer_id: "cu_000000000000",
            instance_id: "in_000000000000",
            type: "individual",
            kyc_type: "standard",
            kyc_status: "approved",
            deleted_at: "2025-01-01T00:00:00Z",
        } satisfies WebhookEvent;
        const payload = JSON.stringify(deleted);

        const event = blindpay.constructWebhookEvent({
            secret,
            headers: headers(sign(payload)),
            payload,
        });

        expect(handle(event)).toBe("2025-01-01T00:00:00Z");
    });

    it("throws a BlindPayError when the payload was tampered with", () => {
        const payload = JSON.stringify({ webhook_event: "tos.accept", tos_id: "to_000000000000" });
        const tampered = JSON.stringify({ webhook_event: "tos.accept", tos_id: "to_111111111111" });

        expect(() =>
            blindpay.constructWebhookEvent({
                secret,
                headers: headers(sign(payload)),
                payload: tampered,
            })
        ).toThrow(BlindPayError);
    });
});

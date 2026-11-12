import { describe, expect, expectTypeOf, it } from "vitest";
import type * as Entry from ".";
import type {
    BlindPayOptions,
    BlindpayApiResponse,
    BlindpayErrorResponse,
    BlindpaySuccessResponse,
    Country,
    Currency,
    ErrorResponse,
    ErrorType,
    EstimatedTimeOfArrival,
    InitiateInput,
    InitiateResponse,
    Network,
    PaginationMetadata,
    PaginationParams,
    PayoutTrackingPayment,
    Rail,
    RequestOptions,
    StablecoinToken,
    SuccessResponse,
    TransactionStatus,
    UnknownWebhookEvent,
    WebhookHeaders,
} from ".";
import {
    BlindPay,
    BlindPayError,
    constructWebhookEvent,
    ErrorCode,
    type ErrorCodeInfo,
    errorCodeInfo,
    isUnknownWebhookEvent,
    type RetryClass,
    verifyWebhook,
} from ".";

describe("Package entry", () => {
    it("exports BlindPayError, named after its class", () => {
        const error = new BlindPayError("boom");

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(BlindPayError);
        expect(error.name).toBe("BlindPayError");
        expect(error.message).toBe("boom");
    });

    it("exports the standalone webhook helpers, which need no client", () => {
        expect(typeof verifyWebhook).toBe("function");
        expect(typeof constructWebhookEvent).toBe("function");
        expect(typeof isUnknownWebhookEvent).toBe("function");
        expectTypeOf<UnknownWebhookEvent>().toHaveProperty("raw");
        expectTypeOf<WebhookHeaders>().toExtend<object>();
    });

    it("throws the exported BlindPayError from the client", () => {
        expect(() => new BlindPay({ apiKey: "", instanceId: "in_000000000000" })).toThrow(
            BlindPayError
        );
    });

    it("exports the shared types", () => {
        expectTypeOf<RequestOptions>().toHaveProperty("idempotencyKey");
        expectTypeOf<RequestOptions>().toHaveProperty("timeoutMs");
        expectTypeOf<ErrorResponse>().toHaveProperty("status");
        expectTypeOf<"timeout_error">().toExtend<ErrorType>();
        expectTypeOf<ErrorResponse>().toHaveProperty("message").toEqualTypeOf<string>();
        expectTypeOf<BlindpayApiResponse<SuccessResponse>>().toHaveProperty("error");
        expectTypeOf<PaginationParams>().toHaveProperty("starting_after");
        expectTypeOf<PaginationMetadata>().toHaveProperty("has_more").toEqualTypeOf<boolean>();
        expectTypeOf<"base">().toExtend<Network>();
        expectTypeOf<"BRL">().toExtend<Currency>();
        expectTypeOf<"pix">().toExtend<Rail>();
        expectTypeOf<"BR">().toExtend<Country>();
        expectTypeOf<"USDC">().toExtend<StablecoinToken>();
        expectTypeOf<"completed">().toExtend<TransactionStatus>();
        expectTypeOf<BlindPayOptions>().toHaveProperty("apiKey").toEqualTypeOf<string>();
        expectTypeOf<BlindPayOptions>().toHaveProperty("maxRetries");
        expectTypeOf<InitiateInput>().toHaveProperty("idempotency_key").toEqualTypeOf<string>();
        expectTypeOf<InitiateResponse>().toHaveProperty("url").toEqualTypeOf<string>();
    });

    it("exports the error-code catalogue (W2 names)", () => {
        expect(ErrorCode.TRANSFERS_SWAP_AMOUNT_BELOW_MINIMUM).toBe(
            "TRANSFERS_SWAP_AMOUNT_BELOW_MINIMUM"
        );
        expect(errorCodeInfo("TRANSFERS_SWAP_AMOUNT_BELOW_MINIMUM")).toEqual({
            status: 400,
            retry: "actionable",
        });
        expectTypeOf<"unknown">().toExtend<RetryClass>();
        expectTypeOf<ErrorCodeInfo>().toHaveProperty("status").toEqualTypeOf<number>();
    });

    it("exports the types that exported types reference", () => {
        expectTypeOf<"5_min">().toExtend<EstimatedTimeOfArrival>();
        expectTypeOf<PayoutTrackingPayment>()
            .toHaveProperty("estimated_time_of_arrival")
            .toEqualTypeOf<EstimatedTimeOfArrival | null | undefined>();
        expectTypeOf<BlindpaySuccessResponse<SuccessResponse>>().toExtend<
            BlindpayApiResponse<SuccessResponse>
        >();
        expectTypeOf<BlindpayErrorResponse>().toExtend<BlindpayApiResponse<SuccessResponse>>();
        expectTypeOf<BlindpayErrorResponse>()
            .toHaveProperty("error")
            .toEqualTypeOf<ErrorResponse>();
    });

    it("keeps dead or stale shared types out of the public API", () => {
        // Checked by `bun run check-types`: each name must fail to resolve, so the expect-error
        // directive below it becomes a build error the day one of these gets exported.
        // @ts-expect-error stale payout tracking field type (removed from the spec)
        expectTypeOf<Entry.PayoutForcedProvider>();
        // @ts-expect-error stale payout tracking field type (removed from the spec)
        expectTypeOf<Entry.PayoutProviderIntegration>();
    });
});

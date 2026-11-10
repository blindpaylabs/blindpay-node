import { describe, expect, expectTypeOf, it } from "vitest";
import type * as Entry from ".";
import type {
    BlindPayOptions,
    BlindpayApiResponse,
    Country,
    Currency,
    ErrorResponse,
    ErrorType,
    InitiateInput,
    InitiateResponse,
    Network,
    PaginationMetadata,
    PaginationParams,
    Rail,
    RequestOptions,
    StablecoinToken,
    SuccessResponse,
    TransactionStatus,
} from ".";
import { BlindPay, BlindPayError } from ".";

describe("Package entry", () => {
    it("exports BlindPayError, named after its class", () => {
        const error = new BlindPayError("boom");

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(BlindPayError);
        expect(error.name).toBe("BlindPayError");
        expect(error.message).toBe("boom");
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

    it("keeps dead or stale shared types out of the public API", () => {
        // Checked by `bun run check-types`: each name must fail to resolve, so the expect-error
        // directive below it becomes a build error the day one of these gets exported.
        // @ts-expect-error stale payout tracking field type (removed from the spec)
        expectTypeOf<Entry.PayoutForcedProvider>();
        // @ts-expect-error stale payout tracking field type (removed from the spec)
        expectTypeOf<Entry.PayoutProviderIntegration>();
        // @ts-expect-error not used by any SDK type
        expectTypeOf<Entry.EstimatedTimeOfArrival>();
        // @ts-expect-error the BlindpayApiResponse branches aren't meant to be named
        expectTypeOf<Entry.BlindpayErrorResponse>();
        // @ts-expect-error the BlindpayApiResponse branches aren't meant to be named
        expectTypeOf<Entry.BlindpaySuccessResponse>();
    });
});

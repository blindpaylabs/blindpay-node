import { describe, expect, expectTypeOf, it } from "vitest";
import type {
    BlindpayApiResponse,
    Country,
    Currency,
    ErrorResponse,
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
        expectTypeOf<RequestOptions>().toEqualTypeOf<{ idempotencyKey?: string }>();
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
    });
});

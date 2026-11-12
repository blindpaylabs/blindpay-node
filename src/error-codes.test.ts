import { afterEach, describe, expect, expectTypeOf, it } from "vitest";
import { BlindPay } from "./client";
import { ErrorCode, type ErrorCodeInfo, errorCodeInfo, type RetryClass } from "./error-codes";
import type { ErrorResponse } from "./index";

describe("error codes (W2)", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({
        apiKey: "test-key",
        instanceId: "in_000000000000",
        maxRetries: 0,
    });

    it("names every code as itself", () => {
        for (const [key, value] of Object.entries(ErrorCode)) expect(value).toBe(key);
        expect(ErrorCode.TRANSFERS_SWAP_AMOUNT_BELOW_MINIMUM).toBe(
            "TRANSFERS_SWAP_AMOUNT_BELOW_MINIMUM"
        );
    });

    it("looks up the status and retry class of a catalogued code", () => {
        expect(errorCodeInfo(ErrorCode.TRANSFERS_SWAP_AMOUNT_BELOW_MINIMUM)).toEqual({
            status: 400,
            retry: "actionable",
        });
        expect(errorCodeInfo("QUOTES_EXPIRED")?.retry).toBe("actionable");
        for (const code of Object.values(ErrorCode)) {
            expect(errorCodeInfo(code)?.retry).toMatch(/^(retryable|terminal|actionable)$/);
        }
    });

    it("returns undefined for no code, an unknown code or an inherited property name", () => {
        expect(errorCodeInfo(undefined)).toBeUndefined();
        expect(errorCodeInfo(null)).toBeUndefined();
        expect(errorCodeInfo("")).toBeUndefined();
        expect(errorCodeInfo("SOMETHING_NEWER_THAN_THIS_SDK")).toBeUndefined();
        expect(errorCodeInfo("toString")).toBeUndefined();
        expect(errorCodeInfo("__proto__")).toBeUndefined();
    });

    it("keeps ErrorCode open: any string is still an ErrorCode, and code stays optional", () => {
        expectTypeOf<"TRANSFERS_SWAP_AMOUNT_BELOW_MINIMUM">().toExtend<ErrorCode>();
        expectTypeOf<"SOMETHING_NEWER_THAN_THIS_SDK">().toExtend<ErrorCode>();
        expectTypeOf<ErrorCode>().toExtend<string>();
        expectTypeOf<ErrorResponse["code"]>().toEqualTypeOf<ErrorCode | undefined>();
        expectTypeOf<ErrorResponse["retry_class"]>().toEqualTypeOf<RetryClass | undefined>();
        expectTypeOf<ErrorCodeInfo["retry"]>().toEqualTypeOf<
            "retryable" | "terminal" | "actionable"
        >();
        // Assigning a plain string from older code still compiles.
        const fromOlderCode: ErrorResponse = { message: "x", code: "ANY_STRING" as string };
        expect(fromOlderCode.code).toBe("ANY_STRING");
    });

    async function apiError(body: Record<string, unknown>, status = 400) {
        fetchMock.mockResponseOnce(JSON.stringify({ success: false, ...body }), { status });
        const { error } = await blindpay.transfers.quotes.create({} as never);
        if (!error) throw new Error("expected an error");
        return error;
    }

    it("sets retry_class from the catalogue on an API error", async () => {
        const error = await apiError({
            code: "TRANSFERS_SWAP_AMOUNT_BELOW_MINIMUM",
            message: "fx_amount_below_minimum",
        });
        expect(error.code).toBe(ErrorCode.TRANSFERS_SWAP_AMOUNT_BELOW_MINIMUM);
        expect(error.message).toBe("fx_amount_below_minimum");
        expect(error.retry_class).toBe("actionable");
    });

    it("sets retry_class to unknown for a code newer than this SDK, and leaves it out without a code", async () => {
        expect((await apiError({ code: "BRAND_NEW_CODE", message: "x" })).retry_class).toBe(
            "unknown"
        );
        const noCode = await apiError({ message: "idempotency_key_reused" }, 422);
        expect(noCode.code).toBeUndefined();
        expect(noCode).not.toHaveProperty("retry_class");
    });

    it("leaves retry_class out when no response arrived (no code)", async () => {
        fetchMock.mockRejectOnce(new TypeError("fetch failed"));
        const { error } = await blindpay.payouts.get("po_000000000000");
        expect(error?.type).toBe("connection_error");
        expect(error).not.toHaveProperty("retry_class");
    });
});

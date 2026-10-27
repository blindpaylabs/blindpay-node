import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../../client";
import type { InitiateResponse } from ".";

describe("Terms of Service", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });

    describe("Initiate Terms of Service", () => {
        it("should initiate terms of service and return a URL", async () => {
            const mockedUrl: InitiateResponse = {
                url: "https://app.blindpay.com/e/terms-of-service?session_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedUrl), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.instances.tos.initiate({
                idempotency_key: "123e4567-e89b-12d3-a456-426614174000",
                customer_id: null,
                redirect_url: null,
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedUrl);
        });

        it("should initiate terms of service with only an idempotency key", async () => {
            const mockedUrl: InitiateResponse = {
                url: "https://app.blindpay.com/e/terms-of-service?session_token=token",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedUrl), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.instances.tos.initiate({
                idempotency_key: "123e4567-e89b-12d3-a456-426614174000",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedUrl);

            const [url, init] = fetchMock.mock.calls[0];
            expect(url).toBe("https://api.blindpay.com/v1/e/instances/in_000000000000/tos");
            expect(JSON.parse(init?.body as string)).toEqual({
                idempotency_key: "123e4567-e89b-12d3-a456-426614174000",
            });
        });
    });
});

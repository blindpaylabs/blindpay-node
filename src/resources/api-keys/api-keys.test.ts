import { describe, expect, it } from "vitest";
import { BlindPay } from "../../client";
import type { CreateApiKeyResponse, GetApiKeyResponse, ListApiKeysResponse } from ".";

describe("Api keys", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });

    describe("Create api key", () => {
        it("should create an api key", async () => {
            const mockedApiKey: CreateApiKeyResponse = {
                id: "ap_000000000000",
                token: "token",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedApiKey), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.instances.apiKeys.create({
                name: "test",
                permission: "full_access",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedApiKey);
        });
    });

    describe("Get api key", () => {
        it("should get an api key", async () => {
            const mockedApiKey: GetApiKeyResponse = {
                id: "ap_000000000000",
                token: "token",
                name: "test",
                permission: "full_access",
                ip_whitelist: ["127.0.0.1"],
                unkey_id: "key_123456789",
                last_used_at: "2024-01-01T00:00:00.000Z",
                instance_id: "in_000000000000",
                created_at: "2021-01-01",
                updated_at: "2021-01-01",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedApiKey), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.instances.apiKeys.get("ap_000000000000");

            expect(error).toBeNull();
            expect(data).toEqual(mockedApiKey);
        });
    });

    describe("List api keys", () => {
        it("should list api keys", async () => {
            const mockedApiKeys: ListApiKeysResponse = [
                {
                    id: "ap_000000000000",
                    token: "token",
                    name: "test",
                    permission: "full_access",
                    ip_whitelist: ["127.0.0.1"],
                    unkey_id: "key_123456789",
                    last_used_at: "2024-01-01T00:00:00.000Z",
                    instance_id: "in_000000000000",
                    created_at: "2021-01-01",
                    updated_at: "2021-01-01",
                },
            ];

            fetchMock.mockResponseOnce(JSON.stringify(mockedApiKeys), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.instances.apiKeys.list();

            expect(error).toBeNull();
            expect(data).toEqual(mockedApiKeys);
        });
    });

    describe("Delete api key", () => {
        it("should delete an api key", async () => {
            fetchMock.mockResponseOnce(
                JSON.stringify({
                    data: null,
                }),
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            const { data, error } = await blindpay.instances.apiKeys.delete("ap_000000000000");

            expect(error).toBeNull();
            expect(data).toEqual({
                data: null,
            });
        });
    });
});

import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../../client";
import type { CreateWebhookEndpointResponse, ListWebhookEndpointsResponse } from "./index";

describe("Webhooks", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });

    describe("Create webhook endpoint", () => {
        it("should create a webhook endpoint", async () => {
            const mockedWebhookEndpoint: CreateWebhookEndpointResponse = {
                id: "we_000000000000",
            };
            fetchMock.mockResponseOnce(JSON.stringify(mockedWebhookEndpoint), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.instances.webhookEndpoints.create({
                url: "https://example.com/webhook",
                events: ["receiver.new"],
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedWebhookEndpoint);
        });
    });

    describe("List webhook endpoints", () => {
        it("should list webhook endpoints", async () => {
            const mockedWebhookEndpoints: ListWebhookEndpointsResponse = [
                {
                    id: "we_000000000000",
                    url: "https://example.com/webhook",
                    events: ["receiver.new"],
                    last_event_at: "2024-01-01T00:00:00.000Z",
                    instance_id: "in_000000000000",
                    created_at: "2021-01-01T00:00:00Z",
                    updated_at: "2021-01-01T00:00:00Z",
                },
            ];
            fetchMock.mockResponseOnce(JSON.stringify(mockedWebhookEndpoints), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.instances.webhookEndpoints.list();

            expect(error).toBeNull();
            expect(data).toEqual(mockedWebhookEndpoints);
        });
    });

    describe("Delete webhook endpoint", () => {
        it("should delete a webhook endpoint", async () => {
            const mockedResponse = { data: null };
            fetchMock.mockResponseOnce(JSON.stringify(mockedResponse), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } =
                await blindpay.instances.webhookEndpoints.delete("we_000000000000");

            expect(error).toBeNull();
            expect(data).toEqual(mockedResponse);
        });
    });

    describe("Get webhook endpoint secret", () => {
        it("should get webhook endpoint secret", async () => {
            const mockedWebhookSecret = { key: "whsec_000000000000" };
            fetchMock.mockResponseOnce(JSON.stringify(mockedWebhookSecret), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } =
                await blindpay.instances.webhookEndpoints.getSecret("we_000000000000");

            expect(error).toBeNull();
            expect(data).toEqual(mockedWebhookSecret);
        });
    });

    describe("Get webhook portal access url", () => {
        it("should get webhook portal access url", async () => {
            const mockedWebhookUrl = { url: "https://example.com/webhook" };

            fetchMock.mockResponseOnce(JSON.stringify(mockedWebhookUrl), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.instances.webhookEndpoints.getPortalAccessUrl();

            expect(error).toBeNull();
            expect(data).toEqual(mockedWebhookUrl);
        });
    });
});

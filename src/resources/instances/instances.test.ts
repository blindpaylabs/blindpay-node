import { afterEach, describe, expect, it } from "vitest";
import type { SuccessResponse } from "../../../types";
import { BlindPay } from "../../client";
import type { GetInstanceResponse } from ".";

describe("Instances", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });
    const mockedSuccess: SuccessResponse = { success: true };

    describe("Get instance", () => {
        it("should get the instance", async () => {
            const mockedInstance: GetInstanceResponse = {
                id: "in_000000000000",
                name: "My Instance",
                type: "development",
                onboarding_step: "completed",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedInstance), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.instances.get();

            expect(error).toBeNull();
            expect(data).toEqual(mockedInstance);
            const [url, init] = fetchMock.mock.calls[0];
            expect(url).toBe("https://api.blindpay.com/v1/instances/in_000000000000");
            expect(init?.method).toBe("GET");
        });
    });

    describe("Get instance members", () => {
        it("should get instance members", async () => {
            const mockedMembers = [
                {
                    id: "us_000000000000",
                    email: "email@example.com",
                    first_name: "Harry",
                    middle_name: "James",
                    last_name: "Potter",
                    image_url: "https://example.com/image.png",
                    created_at: "2021-01-01T00:00:00Z",
                    role: "admin",
                },
            ];

            fetchMock.mockResponseOnce(JSON.stringify(mockedMembers), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.instances.getMembers();

            expect(error).toBeNull();
            expect(data).toEqual(mockedMembers);
        });
    });

    describe("Update instance", () => {
        it("should update an instance", async () => {
            fetchMock.mockResponseOnce(JSON.stringify(mockedSuccess), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.instances.update({
                name: "New Instance Name",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedSuccess);
        });
    });

    describe("Delete instance", () => {
        it("should delete an instance", async () => {
            fetchMock.mockResponseOnce(JSON.stringify(mockedSuccess), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.instances.delete();

            expect(error).toBeNull();
            expect(data).toEqual(mockedSuccess);
        });
    });

    describe("Delete instance member", () => {
        it("should delete an instance member", async () => {
            fetchMock.mockResponseOnce(JSON.stringify(mockedSuccess), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.instances.deleteMember("us_000000000000");

            expect(error).toBeNull();
            expect(data).toEqual(mockedSuccess);
        });
    });

    describe("Update instance member role", () => {
        it("should update instance member role", async () => {
            fetchMock.mockResponseOnce(JSON.stringify(mockedSuccess), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.instances.updateMemberRole({
                memberId: "us_000000000000",
                role: "checker",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedSuccess);
        });
    });
});

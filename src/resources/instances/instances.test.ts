import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../../client";

describe("Instances", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });

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
            fetchMock.mockResponseOnce(JSON.stringify({ data: null }), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.instances.update({
                name: "New Instance Name",
            });

            expect(error).toBeNull();
            expect(data).toEqual({ data: null });
        });
    });

    describe("Delete instance", () => {
        it("should delete an instance", async () => {
            fetchMock.mockResponseOnce(JSON.stringify({ data: null }), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.instances.delete();

            expect(error).toBeNull();
            expect(data).toEqual({ data: null });
        });
    });

    describe("Delete instance member", () => {
        it("should delete an instance member", async () => {
            fetchMock.mockResponseOnce(JSON.stringify({ data: null }), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.instances.deleteMember("us_000000000000");

            expect(error).toBeNull();
            expect(data).toEqual({ data: null });
        });
    });

    describe("Update instance member role", () => {
        it("should update instance member role", async () => {
            fetchMock.mockResponseOnce(JSON.stringify({ data: null }), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.instances.updateMemberRole({
                memberId: "us_000000000000",
                role: "checker",
            });

            expect(error).toBeNull();
            expect(data).toEqual({ data: null });
        });
    });
});

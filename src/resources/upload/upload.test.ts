import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../../client";
import type { UploadResponse } from ".";

describe("Upload", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });

    describe("Upload file", () => {
        it("should upload a file", async () => {
            const mockedUpload: UploadResponse = {
                file_url: "https://storage.blindpay.com/uploads/abc123.pdf",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedUpload), {
                headers: { "Content-Type": "application/json" },
            });

            const file = new Blob(["test content"], { type: "application/pdf" });

            const { data, error } = await blindpay.upload.upload({
                file,
                bucket: "onboarding",
                instance_id: "in_000000000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedUpload);
        });

        it("should upload a file without instance_id", async () => {
            const mockedUpload: UploadResponse = {
                file_url: "https://storage.blindpay.com/uploads/abc123.pdf",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedUpload), {
                headers: { "Content-Type": "application/json" },
            });

            const file = new Blob(["test content"], { type: "image/png" });

            const { data, error } = await blindpay.upload.upload({
                file,
                bucket: "avatar",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedUpload);
        });
    });
});

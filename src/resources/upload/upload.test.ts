import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../../client";
import type { PresignResponse, UploadAnalyzeResponse, UploadResponse } from ".";

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

            const [url] = fetchMock.mock.calls[0];
            expect(url).toBe("https://api.blindpay.com/v1/upload?instance_id=in_000000000000");
        });

        it("should send an explicit instance_id instead of the client's", async () => {
            const mockedUpload: UploadResponse = {
                file_url: "https://storage.blindpay.com/uploads/abc123.pdf",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedUpload), {
                headers: { "Content-Type": "application/json" },
            });

            const file = new Blob(["test content"], { type: "image/png" });

            await blindpay.upload.upload({
                file,
                bucket: "avatar",
                instance_id: "in_111111111111",
            });

            const [url] = fetchMock.mock.calls[0];
            expect(url).toBe("https://api.blindpay.com/v1/upload?instance_id=in_111111111111");
        });
    });

    describe("Analyze document", () => {
        it("should analyze a document", async () => {
            const mockedAnalysis: UploadAnalyzeResponse = {
                approval_rate: "high",
                description: "The document is a legible utility bill matching the provided name.",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedAnalysis), {
                headers: { "Content-Type": "application/json" },
            });

            const file = new Blob(["test content"], { type: "application/pdf" });

            const { data, error } = await blindpay.upload.analyze({
                file,
                type: "proof_of_address",
                metadata: JSON.stringify({ full_name: "Jane Doe" }),
                instance_id: "in_000000000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedAnalysis);

            const [url, init] = fetchMock.mock.calls[0];
            expect(url).toBe(
                "https://api.blindpay.com/v1/upload/analyze?instance_id=in_000000000000"
            );
            expect(init?.method).toBe("POST");
            const body = init?.body as FormData;
            expect(body).toBeInstanceOf(FormData);
            expect(body.get("type")).toBe("proof_of_address");
            expect(body.get("metadata")).toBe(JSON.stringify({ full_name: "Jane Doe" }));
            expect(body.get("file")).toBeInstanceOf(Blob);
            expect(new Headers(init?.headers).has("Content-Type")).toBe(false);
        });

        it("should analyze a document without metadata or instance_id", async () => {
            const mockedAnalysis: UploadAnalyzeResponse = {
                approval_rate: "low",
                description: "The document is blurry.",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedAnalysis), {
                headers: { "Content-Type": "application/json" },
            });

            const file = new Blob(["test content"], { type: "image/png" });

            const { data, error } = await blindpay.upload.analyze({
                file,
                type: "selfie",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedAnalysis);

            const [url, init] = fetchMock.mock.calls[0];
            expect(url).toBe(
                "https://api.blindpay.com/v1/upload/analyze?instance_id=in_000000000000"
            );
            const body = init?.body as FormData;
            expect(body.has("metadata")).toBe(false);
        });

        it("should return an error when analysis fails", async () => {
            fetchMock.mockResponseOnce(
                JSON.stringify({
                    success: false,
                    code: "UPLOAD_UNSUPPORTED_FILE",
                    message: "Unsupported file",
                    errors: [],
                    trace_id: "0af7651916cd43dd8448eb211c80319c",
                }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );

            const file = new Blob(["test content"], { type: "text/plain" });

            const { data, error } = await blindpay.upload.analyze({ file, type: "invoice" });

            expect(data).toBeNull();
            expect(error).toStrictEqual({
                code: "UPLOAD_UNSUPPORTED_FILE",
                message: "Unsupported file",
                errors: [],
                trace_id: "0af7651916cd43dd8448eb211c80319c",
            });
        });
    });

    describe("Presign file URL", () => {
        it("should presign a file URL", async () => {
            const mockedPresign: PresignResponse = {
                file_url: "https://storage.blindpay.com/uploads/abc123.pdf?signature=xyz",
                expires_at: "2025-01-01T01:00:00Z",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedPresign), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.upload.presign({
                file_url: "https://storage.blindpay.com/uploads/abc123.pdf",
                instance_id: "in_000000000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedPresign);

            const [url, init] = fetchMock.mock.calls[0];
            expect(url).toBe("https://api.blindpay.com/v1/presign?instance_id=in_000000000000");
            expect(init?.method).toBe("POST");
            expect(JSON.parse(init?.body as string)).toEqual({
                file_url: "https://storage.blindpay.com/uploads/abc123.pdf",
            });
        });

        it("should default instance_id to the client's instance", async () => {
            const mockedPresign: PresignResponse = {
                file_url: "https://storage.blindpay.com/uploads/abc123.pdf?signature=xyz",
                expires_at: "2025-01-01T01:00:00Z",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedPresign), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.upload.presign({
                file_url: "https://storage.blindpay.com/uploads/abc123.pdf",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedPresign);

            const [url, init] = fetchMock.mock.calls[0];
            expect(url).toBe("https://api.blindpay.com/v1/presign?instance_id=in_000000000000");
            expect(JSON.parse(init?.body as string)).toEqual({
                file_url: "https://storage.blindpay.com/uploads/abc123.pdf",
            });
        });
    });
});

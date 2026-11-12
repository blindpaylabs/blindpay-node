import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../../client";
import { type ErrorFixture, errorFixtures, readFixture } from "../../internal/test-fixtures";
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

    describe("File input", () => {
        /** The `file` part of the single multipart request sent. */
        async function sentFile(call: () => Promise<unknown>): Promise<File> {
            fetchMock.mockResponseOnce(JSON.stringify({ file_url: "https://x" }));
            await call();
            const body = fetchMock.mock.calls[0][1]?.body as FormData;
            expect(String(fetchMock.mock.calls[0][0])).toContain("?instance_id=in_000000000000");
            return body.get("file") as File;
        }

        it.each([
            ["a Uint8Array", new TextEncoder().encode("%PDF-1.7")],
            ["an ArrayBuffer", new TextEncoder().encode("%PDF-1.7").buffer],
        ])("sends %s with its filename and content type", async (_label, bytes) => {
            const part = await sentFile(() =>
                blindpay.upload.upload({
                    file: bytes,
                    filename: "contract.pdf",
                    contentType: "application/pdf",
                    bucket: "documents",
                })
            );
            expect(part.name).toBe("contract.pdf");
            expect(part.type).toBe("application/pdf");
            expect(await part.text()).toBe("%PDF-1.7");
        });

        it("names bare bytes `upload` as application/octet-stream by default", async () => {
            const part = await sentFile(() =>
                blindpay.upload.analyze({ file: new Uint8Array([1, 2, 3]), type: "invoice" })
            );
            expect(part.name).toBe("upload");
            expect(part.type).toBe("application/octet-stream");
        });

        it("keeps a Blob's own type and lets filename and contentType override it", async () => {
            const blob = new Blob(["x"], { type: "text/plain" });
            const kept = await sentFile(() =>
                blindpay.upload.upload({ file: blob, bucket: "documents" })
            );
            expect(kept.type).toBe("text/plain");
            fetchMock.resetMocks();
            const renamed = await sentFile(() =>
                blindpay.upload.upload({
                    file: blob,
                    filename: "notes.csv",
                    contentType: "text/csv",
                    bucket: "documents",
                })
            );
            expect(renamed.name).toBe("notes.csv");
            expect(renamed.type).toBe("text/csv");
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
                status: 400,
                type: "api_error",
                retry_class: "unknown",
                retryable: false,
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

    describe("Multipart failures resolve to { error } instead of rejecting", () => {
        const file = new Blob(["test content"], { type: "text/plain" });
        const multipartCalls = [
            { name: "upload", call: () => blindpay.upload.upload({ file, bucket: "documents" }) },
            { name: "analyze", call: () => blindpay.upload.analyze({ file, type: "invoice" }) },
        ];

        const envelopeFixtures = errorFixtures().filter(([, fixture]) => fixture.body);

        describe.each(multipartCalls)("$name", ({ call }) => {
            it("returns a network failure as error", async () => {
                fetchMock.mockRejectOnce(new TypeError("fetch failed"));

                const { data, error } = await call();

                expect(data).toBeNull();
                expect(error).toStrictEqual({
                    message: "fetch failed",
                    status: 0,
                    type: "connection_error",
                    retryable: false,
                });
            });

            it("returns a non-JSON error body as an error naming the status", async () => {
                const fixture = readFixture<ErrorFixture>("errors/non_json_502.json");
                fetchMock.mockResponseOnce(fixture.raw_body ?? "", {
                    status: fixture.status,
                    statusText: "Bad Gateway",
                    headers: fixture.headers,
                });

                const { data, error } = await call();

                expect(data).toBeNull();
                expect(error).toStrictEqual({
                    message: "HTTP 502 Bad Gateway",
                    status: 502,
                    type: "api_error",
                    retryable: false,
                });
            });

            it("returns a 2xx body that isn't JSON as an error", async () => {
                fetchMock.mockResponseOnce("<html>ok</html>", { status: 200 });

                const { data, error } = await call();

                expect(data).toBeNull();
                expect(error).toStrictEqual({
                    message: "HTTP 200: the response body is not valid JSON",
                    status: 200,
                    type: "invalid_response",
                    retryable: false,
                });
            });

            it("returns an empty 2xx body as data null", async () => {
                fetchMock.mockResponseOnce(() => new Response(null, { status: 204 }));

                const { data, error } = await call();

                expect(error).toBeNull();
                expect(data).toBeNull();
            });

            it.each(envelopeFixtures)(
                "maps the %s error envelope",
                async (_name, { status, headers, body }) => {
                    fetchMock.mockResponseOnce(JSON.stringify(body), {
                        status,
                        headers: { "Content-Type": "application/json", ...headers },
                    });

                    const { data, error } = await call();

                    expect(data).toBeNull();
                    expect(error?.message).toBe(body?.message);
                    expect(error?.code).toBe(body?.code);
                    expect(error?.trace_id).toBe(body?.trace_id);
                }
            );
        });
    });
});

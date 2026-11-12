import { inspect } from "node:util";
import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "./client";
import { constructWebhookEvent, verifyWebhook } from "./webhooks";

// A fake key built at runtime, distinctive enough to search for in the output; not a credential.
const API_KEY = ["test", "key", "redaction", "probe"].join("_");

/** Every way a client or a result could end up in a log line. */
function renderings(value: unknown): string[] {
    return [
        inspect(value, { depth: null, showHidden: true, getters: true }),
        JSON.stringify(value) ?? "",
        String(value),
    ];
}

describe("API key redaction", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({
        apiKey: API_KEY,
        instanceId: "in_000000000000",
        maxRetries: 0,
    });

    it("never shows the key when the client or a resource is logged or serialised", () => {
        for (const value of [blindpay, blindpay.payouts, blindpay.wallets, blindpay.upload]) {
            for (const text of renderings(value)) {
                expect(text).not.toContain(API_KEY);
                expect(text).not.toContain("Bearer");
            }
        }
        expect(JSON.parse(JSON.stringify(blindpay))).toMatchObject({
            instanceId: "in_000000000000",
            apiKey: "[redacted]",
        });
    });

    it("still sends the key, only on the wire", async () => {
        fetchMock.mockResponseOnce(JSON.stringify({}));
        await blindpay.payouts.get("po_000000000000");
        const headers = new Headers(fetchMock.mock.calls[0][1]?.headers);
        expect(headers.get("Authorization")).toBe(`Bearer ${API_KEY}`);
    });

    it("never puts the key or the request body in an error", async () => {
        const body = { tax_id: "123-45-6789" };
        fetchMock.mockResponseOnce(JSON.stringify({ success: false, message: "bad" }), {
            status: 400,
        });
        const apiError = await blindpay.customers.update({ customer_id: "re_1", ...body } as never);
        fetchMock.mockRejectOnce(new Error("socket hang up"));
        const networkError = await blindpay.customers.update({
            customer_id: "re_1",
            ...body,
        } as never);

        for (const result of [apiError, networkError]) {
            expect(result.error).not.toBeNull();
            for (const text of renderings(result)) {
                expect(text).not.toContain(API_KEY);
                expect(text).not.toContain("Bearer");
                expect(text).not.toContain(body.tax_id);
            }
        }
    });

    it("keeps the query string, which can carry list filters, out of transport errors", async () => {
        const name = "Maria Probe Silva";
        const fetchWithUrlInMessage = async (input: RequestInfo | URL): Promise<Response> => {
            throw new Error(`request to ${String(input)} failed, reason: ECONNRESET`);
        };
        const client = new BlindPay({
            apiKey: API_KEY,
            instanceId: "in_000000000000",
            maxRetries: 0,
            fetch: fetchWithUrlInMessage,
        });
        const result = await client.customers.list({ customer_name: name });
        expect(result.error?.type).toBe("connection_error");
        expect(result.error?.message).toBe(
            "request to https://api.blindpay.com/v1/instances/in_000000000000/customers failed, reason: ECONNRESET"
        );
        for (const text of renderings(result)) {
            expect(text).not.toContain("customer_name");
            expect(text).not.toContain(encodeURIComponent(name));
        }
    });
});

describe("query strings in transport errors", () => {
    const name = "Maria Probe Silva";

    it.each([
        [
            "an absolute URL",
            (url: string) => `request to ${url} failed`,
            "request to https://api.blindpay.com/v1/instances/in_000000000000/customers failed",
        ],
        [
            "a relative path",
            (url: string) =>
                `GET ${new URL(url).pathname}${new URL(url).search} failed: ECONNRESET`,
            "GET /v1/instances/in_000000000000/customers failed: ECONNRESET",
        ],
        [
            "a quoted path inside a longer message",
            (url: string) =>
                `proxy error for "${new URL(url).pathname}${new URL(url).search}" (socket closed)`,
            'proxy error for "/v1/instances/in_000000000000/customers" (socket closed)',
        ],
    ])("strips it from %s", async (_label, message, expected) => {
        const client = new BlindPay({
            apiKey: API_KEY,
            instanceId: "in_000000000000",
            maxRetries: 0,
            fetch: async (input: RequestInfo | URL): Promise<Response> => {
                throw new Error(message(String(input)));
            },
        });
        const { error } = await client.customers.list({ customer_name: name });
        expect(error?.message).toBe(expected);
        expect(error?.message).not.toContain("customer_name");
    });
});

describe("webhook secret redaction", () => {
    // Fake secrets built at runtime; not credentials.
    const secret = `whsec_${Buffer.from("blindpay-node-secret-redaction-probe").toString("base64")}`;
    const malformed = `whsec_${["not", "base64", "probe"].join("!")}`;
    const headers = {
        "svix-id": "msg_000000000000",
        "svix-timestamp": String(Math.floor(Date.now() / 1000)),
        "svix-signature": "v1,AAAA",
    };

    it("never puts the secret in a verification error", () => {
        for (const key of [secret, malformed]) {
            expect(verifyWebhook("{}", headers, key)).toBe(false);
            let thrown: unknown;
            try {
                constructWebhookEvent("{}", headers, key);
            } catch (error) {
                thrown = error;
            }
            expect(thrown).toBeInstanceOf(Error);
            for (const text of [...renderings(thrown), (thrown as Error).stack ?? ""]) {
                expect(text).not.toContain(key);
                expect(text).not.toContain(key.slice("whsec_".length));
            }
        }
    });
});

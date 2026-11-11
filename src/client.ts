import { version } from "../package.json";
import type { BlindpayApiResponse, RequestOptions } from "../types";
import type { InternalApiClient } from "./internal/api-client";
import { BlindPayError } from "./internal/blindpay-error";
import { type HttpMethod, send, type TransportConfig } from "./internal/http";
import { createAvailableResource } from "./resources/available";
import { createBankAccountsResource } from "./resources/bank-accounts";
import { createCustomersResource } from "./resources/customers";
import { createFeesResource } from "./resources/fees";
import { createInstancesResource } from "./resources/instances";
import { createInstanceOnboardingResource } from "./resources/instances/onboarding";
import { createPartnerFeesResource } from "./resources/partner-fees";
import { createPayablesResource } from "./resources/payables";
import { createPayinsResource } from "./resources/payins";
import { createPayinQuotesResource } from "./resources/payins/quotes";
import { createPayoutsResource } from "./resources/payouts";
import { createQuotesResource } from "./resources/quotes";
import { createCustomerRfiResource, createInstanceRfiResource } from "./resources/rfi";
import { createTermsOfServiceResource } from "./resources/terms-of-service";
import { createTransfersResource } from "./resources/transfers";
import { createUploadResource } from "./resources/upload";
import { createVirtualAccountsResource } from "./resources/virtual-accounts";
import { createBlockchainWalletsResource } from "./resources/wallets/blockchain";
import { createCustodialWalletsResource } from "./resources/wallets/custodial";
import { createOfframpWalletsResource } from "./resources/wallets/offramp";
import { createWebhookEndpointsResource } from "./resources/webhooks";
import type { WebhookEvent } from "./resources/webhooks/events";
import { verifyOrThrow, verifyWebhook } from "./webhooks";

/** What `verifyWebhookSignature` and `constructWebhookEvent` check: the svix-* headers. */
export type WebhookVerificationInput = {
    secret: string;
    headers: {
        id: string;
        timestamp: string;
        signature: string;
    };
    /** The raw request body: re-serialized JSON changes the bytes and fails verification. */
    payload: string;
    /** Allowed distance of the timestamp from now, in seconds (default 300). */
    tolerance?: number;
};

/** Options for `new BlindPay(...)`. */
export type BlindPayOptions = {
    /** Secret API key from the BlindPay dashboard. */
    apiKey: string;
    /** Instance the client acts on; every instance-scoped path uses it. */
    instanceId: string;
    /**
     * API origin, default `https://api.blindpay.com` (paths start with `/v1`). Change it only
     * for a proxy or a test server: it receives your API key.
     */
    baseUrl?: string;
    /** Per-attempt timeout in milliseconds, default 60 000. A call can override it. */
    timeoutMs?: number;
    /**
     * Automatic retries after the first attempt, default 2; `0` turns them off. GETs are
     * retried on connection errors, timeouts, 408, 429 and 5xx. Mutations are retried only
     * under an `Idempotency-Key` (generated when you don't pass one) and only when the API
     * can't have acted: no response, 429, or a concurrent duplicate (409); never on a 5xx.
     */
    maxRetries?: number;
    /** `fetch` implementation to use (tests, proxies, instrumentation); default the global one. */
    fetch?: typeof fetch;
};

const DEFAULT_BASE_URL = "https://api.blindpay.com";
const DEFAULT_TIMEOUT_MS = 60_000;
const DEFAULT_MAX_RETRIES = 2;

export class BlindPay {
    // Options
    // ECMAScript-private, so the API key never shows in util.inspect (even showHidden),
    // JSON.stringify or a debugger's property list (sdk-parity C13).
    readonly #transport: TransportConfig;
    private readonly instanceId: string;
    private readonly api: InternalApiClient;

    // Resources
    readonly available: ReturnType<typeof createAvailableResource>;
    readonly partnerFees: ReturnType<typeof createPartnerFeesResource>;
    readonly payables: ReturnType<typeof createPayablesResource>;
    readonly payins: ReturnType<typeof createPayinsResource> & {
        quotes: ReturnType<typeof createPayinQuotesResource>;
    };
    readonly quotes: ReturnType<typeof createQuotesResource>;
    readonly payouts: ReturnType<typeof createPayoutsResource>;
    readonly transfers: ReturnType<typeof createTransfersResource>;
    readonly fees: ReturnType<typeof createFeesResource>;
    readonly upload: ReturnType<typeof createUploadResource>;
    readonly virtualAccounts: ReturnType<typeof createVirtualAccountsResource>;
    readonly customers: ReturnType<typeof createCustomersResource> & {
        bankAccounts: ReturnType<typeof createBankAccountsResource>;
        rfi: ReturnType<typeof createCustomerRfiResource>;
    };
    readonly instances: ReturnType<typeof createInstancesResource> & {
        webhookEndpoints: ReturnType<typeof createWebhookEndpointsResource>;
        tos: ReturnType<typeof createTermsOfServiceResource>;
        onboarding: ReturnType<typeof createInstanceOnboardingResource>;
        rfi: ReturnType<typeof createInstanceRfiResource>;
    };
    readonly wallets: {
        blockchain: ReturnType<typeof createBlockchainWalletsResource>;
        offramp: ReturnType<typeof createOfframpWalletsResource>;
        custodial: ReturnType<typeof createCustodialWalletsResource>;
    };

    /**
     * A configured client is immutable and safe to share: per-call options never change it.
     *
     * @throws {BlindPayError} When `apiKey` or `instanceId` is missing, or an option is invalid
     */
    constructor({
        apiKey,
        instanceId,
        baseUrl = DEFAULT_BASE_URL,
        timeoutMs = DEFAULT_TIMEOUT_MS,
        maxRetries = DEFAULT_MAX_RETRIES,
        fetch: fetchFn,
    }: BlindPayOptions) {
        if (!apiKey) {
            throw new BlindPayError("Api key not provided, get your api key on blindpay dashboard");
        }

        if (!instanceId) {
            throw new BlindPayError(
                "Instance id not provided, get your instance id on blindpay dashboard"
            );
        }

        if (!Number.isInteger(maxRetries) || maxRetries < 0) {
            throw new BlindPayError("maxRetries must be a non-negative integer");
        }

        if (!(timeoutMs > 0)) {
            throw new BlindPayError("timeoutMs must be a positive number of milliseconds");
        }

        this.instanceId = instanceId;

        this.#transport = {
            baseUrl: baseUrl.replace(/\/+$/, ""),
            apiKey,
            userAgent: `blindpay-node/${version}`,
            timeoutMs,
            maxRetries,
            // Looked up per call, so a fetch installed (or mocked) after construction is used.
            fetch: fetchFn ?? ((input, init) => globalThis.fetch(input, init)),
        };

        // Initialize the internal API client with bound HTTP methods to encapsulate and restrict direct access to raw API calls
        this.api = {
            get: this.get.bind(this),
            post: this.post.bind(this),
            put: this.put.bind(this),
            patch: this.patch.bind(this),
            delete: this.delete.bind(this),
            postMultipart: this.postMultipart.bind(this),
        };

        // Resources interpolate the instance id into request paths, so they get it percent-encoded
        // (a no-op for a well-formed `in_...` id). Upload sends it as a query param instead, where
        // toQueryString encodes it, so it gets the raw value.
        const pathInstanceId = encodeURIComponent(this.instanceId);

        this.available = createAvailableResource(this.api);

        this.instances = {
            ...createInstancesResource(pathInstanceId, this.api),
            webhookEndpoints: createWebhookEndpointsResource(pathInstanceId, this.api),
            tos: createTermsOfServiceResource(pathInstanceId, this.api),
            onboarding: createInstanceOnboardingResource(pathInstanceId, this.api),
            rfi: createInstanceRfiResource(pathInstanceId, this.api),
        };

        this.partnerFees = createPartnerFeesResource(pathInstanceId, this.api);

        this.payables = createPayablesResource(pathInstanceId, this.api);

        this.payins = {
            ...createPayinsResource(pathInstanceId, this.api),
            quotes: createPayinQuotesResource(pathInstanceId, this.api),
        };

        this.quotes = createQuotesResource(pathInstanceId, this.api);

        this.payouts = createPayoutsResource(pathInstanceId, this.api);

        this.transfers = createTransfersResource(pathInstanceId, this.api);

        this.fees = createFeesResource(pathInstanceId, this.api);

        this.upload = createUploadResource(this.instanceId, this.#transport.baseUrl, {}, this.api);

        this.customers = {
            ...createCustomersResource(pathInstanceId, this.api),
            bankAccounts: createBankAccountsResource(pathInstanceId, this.api),
            rfi: createCustomerRfiResource(pathInstanceId, this.api),
        };

        this.virtualAccounts = createVirtualAccountsResource(pathInstanceId, this.api);

        this.wallets = {
            blockchain: createBlockchainWalletsResource(pathInstanceId, this.api),
            offramp: createOfframpWalletsResource(pathInstanceId, this.api),
            custodial: createCustodialWalletsResource(pathInstanceId, this.api),
        };
    }

    /** What `console.log(client)` shows: the configuration, never the API key. */
    [Symbol.for("nodejs.util.inspect.custom")](): Record<string, unknown> {
        return this.toJSON();
    }

    /** What `JSON.stringify(client)` gives: the configuration, never the API key. */
    toJSON(): Record<string, unknown> {
        return {
            instanceId: this.instanceId,
            baseUrl: this.#transport.baseUrl,
            timeoutMs: this.#transport.timeoutMs,
            maxRetries: this.#transport.maxRetries,
            apiKey: "[redacted]",
        };
    }

    private request<T>(
        method: HttpMethod,
        path: string,
        body?: Record<string, unknown>,
        options?: RequestOptions
    ): Promise<BlindpayApiResponse<T>> {
        return send<T>(this.#transport, { method, path, json: body, options });
    }

    private get<T>(path: string, options?: RequestOptions): Promise<BlindpayApiResponse<T>> {
        return this.request<T>("GET", path, undefined, options);
    }

    private post<T>(
        path: string,
        body: Record<string, unknown>,
        options?: RequestOptions
    ): Promise<BlindpayApiResponse<T>> {
        return this.request<T>("POST", path, body, options);
    }

    private put<T>(
        path: string,
        body: Record<string, unknown>,
        options?: RequestOptions
    ): Promise<BlindpayApiResponse<T>> {
        return this.request<T>("PUT", path, body, options);
    }

    private patch<T>(
        path: string,
        body: Record<string, unknown>,
        options?: RequestOptions
    ): Promise<BlindpayApiResponse<T>> {
        return this.request<T>("PATCH", path, body, options);
    }

    private delete<T>(path: string, options?: RequestOptions): Promise<BlindpayApiResponse<T>> {
        return this.request<T>("DELETE", path, undefined, options);
    }

    /** Multipart POST: no Idempotency-Key (the API skips it) and no automatic retry. */
    private postMultipart<T>(
        path: string,
        form: FormData,
        options?: RequestOptions
    ): Promise<BlindpayApiResponse<T>> {
        return send<T>(this.#transport, { method: "POST", path, form, options });
    }

    /**
     * Verifies the BlindPay webhook signature using Svix. Same check as the standalone
     * `verifyWebhook(payload, headers, secret)`, which needs no client.
     *
     * @param params.secret The webhook secret from BlindPay dashboard
     * @param params.headers The webhook headers object containing svix-id, svix-timestamp, and svix-signature
     * @param params.payload The raw request body as a string
     * @returns {boolean} True if the signature is valid, false otherwise
     */
    verifyWebhookSignature(params: WebhookVerificationInput): boolean {
        return verifyWebhook(params.payload, svixHeaders(params), params.secret, {
            tolerance: params.tolerance,
        });
    }

    /**
     * Verifies a BlindPay webhook with Svix and returns its payload, typed by `webhook_event`.
     * An event newer than this SDK is returned as received. The standalone
     * `constructWebhookEvent(payload, headers, secret)` needs no client and returns such events
     * as an `UnknownWebhookEvent`.
     *
     * @returns The verified payload; narrow it with a `switch` on `event.webhook_event`
     * @throws {BlindPayError} When the signature or timestamp does not verify
     */
    constructWebhookEvent(params: WebhookVerificationInput): WebhookEvent {
        return verifyOrThrow(params.payload, svixHeaders(params), params.secret, {
            tolerance: params.tolerance,
        }) as WebhookEvent;
    }
}

function svixHeaders({ headers }: WebhookVerificationInput): Record<string, string> {
    return {
        "svix-id": headers.id,
        "svix-timestamp": headers.timestamp,
        "svix-signature": headers.signature,
    };
}

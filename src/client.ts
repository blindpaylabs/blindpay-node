import { Webhook } from "svix";
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
    private readonly transport: TransportConfig;
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

        this.transport = {
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

        this.available = createAvailableResource(this.api);

        this.instances = {
            ...createInstancesResource(this.instanceId, this.api),
            webhookEndpoints: createWebhookEndpointsResource(this.instanceId, this.api),
            tos: createTermsOfServiceResource(this.instanceId, this.api),
            onboarding: createInstanceOnboardingResource(this.instanceId, this.api),
            rfi: createInstanceRfiResource(this.instanceId, this.api),
        };

        this.partnerFees = createPartnerFeesResource(this.instanceId, this.api);

        this.payables = createPayablesResource(this.instanceId, this.api);

        this.payins = {
            ...createPayinsResource(this.instanceId, this.api),
            quotes: createPayinQuotesResource(this.instanceId, this.api),
        };

        this.quotes = createQuotesResource(this.instanceId, this.api);

        this.payouts = createPayoutsResource(this.instanceId, this.api);

        this.transfers = createTransfersResource(this.instanceId, this.api);

        this.fees = createFeesResource(this.instanceId, this.api);

        this.upload = createUploadResource(this.instanceId, this.transport.baseUrl, {}, this.api);

        this.customers = {
            ...createCustomersResource(this.instanceId, this.api),
            bankAccounts: createBankAccountsResource(this.instanceId, this.api),
            rfi: createCustomerRfiResource(this.instanceId, this.api),
        };

        this.virtualAccounts = createVirtualAccountsResource(this.instanceId, this.api);

        this.wallets = {
            blockchain: createBlockchainWalletsResource(this.instanceId, this.api),
            offramp: createOfframpWalletsResource(this.instanceId, this.api),
            custodial: createCustodialWalletsResource(this.instanceId, this.api),
        };
    }

    private request<T>(
        method: HttpMethod,
        path: string,
        body?: Record<string, unknown>,
        options?: RequestOptions
    ): Promise<BlindpayApiResponse<T>> {
        return send<T>(this.transport, { method, path, json: body, options });
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
        return send<T>(this.transport, { method: "POST", path, form, options });
    }

    /**
     * Verifies the BlindPay webhook signature using Svix
     *
     * @param params.secret The webhook secret from BlindPay dashboard
     * @param params.headers The webhook headers object containing svix-id, svix-timestamp, and svix-signature
     * @param params.payload The raw request body as a string
     * @returns {boolean} True if the signature is valid, false otherwise
     */
    verifyWebhookSignature(params: WebhookVerificationInput): boolean {
        try {
            verifyWithSvix(params);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Verifies a BlindPay webhook with Svix and returns its payload, typed by `webhook_event`.
     *
     * @returns The verified payload; narrow it with a `switch` on `event.webhook_event`
     * @throws {BlindPayError} When the signature or timestamp does not verify
     */
    constructWebhookEvent(params: WebhookVerificationInput): WebhookEvent {
        try {
            return verifyWithSvix(params) as WebhookEvent;
        } catch (error) {
            throw new BlindPayError(
                `Webhook verification failed: ${error instanceof Error ? error.message : String(error)}`
            );
        }
    }
}

/** Returns the parsed payload when the Svix signature and timestamp verify, else throws. */
function verifyWithSvix({ secret, headers, payload }: WebhookVerificationInput): unknown {
    return new Webhook(secret).verify(payload, {
        "svix-id": headers.id,
        "svix-timestamp": headers.timestamp,
        "svix-signature": headers.signature,
    });
}

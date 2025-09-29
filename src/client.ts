import { createHmac, timingSafeEqual } from "node:crypto";
import { version } from "../package.json";
import type { BlindpayApiResponse } from "../types";
import type { InternalApiClient } from "./internal/api-client";
import { BlindPayError } from "./internal/blindpay-error";
import { createApiKeysResource } from "./resources/api-keys";
import { createAvailableResource } from "./resources/available";
import { createBankAccountsResource } from "./resources/bank-accounts";
import { createInstancesResource } from "./resources/instances";
import { createPartnerFeesResource } from "./resources/partner-fees";
import { createPayinsResource } from "./resources/payins";
import { createPayinQuotesResource } from "./resources/payins/quotes";
import { createPayoutsResource } from "./resources/payouts";
import { createQuotesResource } from "./resources/quotes";
import { createReceiversResource } from "./resources/receivers";
import { createVirtualAccountsResource } from "./resources/virtual-accounts";
import { createBlockchainWalletsResource } from "./resources/wallets/blockchain";
import { createOfframpWalletsResource } from "./resources/wallets/offramp";
import { createWebhookEndpointsResource } from "./resources/webhooks";

export class BlindPay {
    // Options
    private readonly baseUrl = "https://api.blindpay.com/v1";
    private readonly headers: Record<string, string>;
    private readonly apiKey: string;
    private readonly instanceId: string;
    private readonly api: InternalApiClient;

    // Resources
    readonly available: ReturnType<typeof createAvailableResource>;
    readonly partnerFees: ReturnType<typeof createPartnerFeesResource>;
    readonly payins: ReturnType<typeof createPayinsResource> & {
        quotes: ReturnType<typeof createPayinQuotesResource>;
    };
    readonly quotes: ReturnType<typeof createQuotesResource>;
    readonly payouts: ReturnType<typeof createPayoutsResource>;
    readonly virtualAccounts: ReturnType<typeof createVirtualAccountsResource>;
    readonly receivers: ReturnType<typeof createReceiversResource> & {
        bankAccounts: ReturnType<typeof createBankAccountsResource>;
    };
    readonly instances: ReturnType<typeof createInstancesResource> & {
        apiKeys: ReturnType<typeof createApiKeysResource>;
        webhookEndpoints: ReturnType<typeof createWebhookEndpointsResource>;
    };
    readonly wallets: {
        blockchain: ReturnType<typeof createBlockchainWalletsResource>;
        offramp: ReturnType<typeof createOfframpWalletsResource>;
    };

    constructor({
        apiKey,
        instanceId,
    }: {
        apiKey: string;
        instanceId: string;
    }) {
        if (!apiKey) {
            throw new BlindPayError("Api key not provided, get your api key on blindpay dashboard");
        }

        if (!instanceId) {
            throw new BlindPayError(
                "Instance id not provided, get your instance id on blindpay dashboard"
            );
        }

        this.apiKey = apiKey;
        this.instanceId = instanceId;

        this.headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            "User-Agent": `blindpay-node/${version}`,
            Authorization: `Bearer ${this.apiKey}`,
        };

        // Initialize the internal API client with bound HTTP methods to encapsulate and restrict direct access to raw API calls
        this.api = {
            get: this.get.bind(this),
            post: this.post.bind(this),
            put: this.put.bind(this),
            patch: this.patch.bind(this),
            delete: this.delete.bind(this),
        };

        this.available = createAvailableResource(this.api);

        this.instances = {
            ...createInstancesResource(this.instanceId, this.api),
            apiKeys: createApiKeysResource(this.instanceId, this.api),
            webhookEndpoints: createWebhookEndpointsResource(this.instanceId, this.api),
        };

        this.partnerFees = createPartnerFeesResource(this.instanceId, this.api);

        this.payins = {
            ...createPayinsResource(this.instanceId, this.api),
            quotes: createPayinQuotesResource(this.instanceId, this.api),
        };

        this.quotes = createQuotesResource(this.instanceId, this.api);

        this.payouts = createPayoutsResource(this.instanceId, this.api);

        this.receivers = {
            ...createReceiversResource(this.instanceId, this.api),
            bankAccounts: createBankAccountsResource(this.instanceId, this.api),
        };

        this.virtualAccounts = createVirtualAccountsResource(this.instanceId, this.api);

        this.wallets = {
            blockchain: createBlockchainWalletsResource(this.instanceId, this.api),
            offramp: createOfframpWalletsResource(this.instanceId, this.api),
        };
    }

    private async request<T>(
        method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
        path: string,
        body?: Record<string, unknown>
    ): Promise<BlindpayApiResponse<T>> {
        try {
            const response = await fetch(`${this.baseUrl}${path}`, {
                method,
                headers: this.headers,
                body: body ? JSON.stringify(body) : undefined,
            });

            if (!response.ok) {
                const error = await response.json();
                return {
                    data: null,
                    error: {
                        message: error?.message ?? "Unknown error",
                    },
                };
            }

            const data = await response.json();

            return {
                data,
                error: null,
            };
        } catch (error) {
            if (error instanceof Error) {
                return {
                    data: null,
                    error: {
                        message: error.message,
                    },
                };
            }

            const errorMessage =
                error &&
                typeof error === "object" &&
                "message" in error &&
                typeof error.message === "string"
                    ? error.message
                    : "Unknown error";

            return {
                data: null,
                error: {
                    message: errorMessage,
                },
            };
        }
    }

    private async get<T>(path: string): Promise<BlindpayApiResponse<T>> {
        return this.request<T>("GET", path);
    }

    private async post<T>(
        path: string,
        body: Record<string, unknown>
    ): Promise<BlindpayApiResponse<T>> {
        return this.request<T>("POST", path, body);
    }

    private async put<T>(
        path: string,
        body: Record<string, unknown>
    ): Promise<BlindpayApiResponse<T>> {
        return this.request<T>("PUT", path, body);
    }

    private async patch<T>(
        path: string,
        body: Record<string, unknown>
    ): Promise<BlindpayApiResponse<T>> {
        return this.request<T>("PATCH", path, body);
    }

    private async delete<T>(
        path: string,
        body?: Record<string, unknown>
    ): Promise<BlindpayApiResponse<T>> {
        return this.request<T>("DELETE", path, body);
    }

    /**
     * Verifies the BlindPay webhook signature
     *
     * @param params.secret The webhook secret from BlindPay dashboard
     * @param params.id The value of the `svix-id` header
     * @param params.timestamp The value of the `svix-timestamp` header
     * @param params.payload The raw request body
     * @param params.svixSignature The value of the `svix-signature` header
     * @returns {boolean} True if the signature is valid, false otherwise
     */
    verifyWebhookSignature({
        secret,
        id,
        timestamp,
        payload,
        svixSignature,
    }: {
        secret: string;
        id: string;
        timestamp: string;
        payload: string;
        svixSignature: string;
    }): boolean {
        const signedContent = `${id}.${timestamp}.${payload}`;
        const secretBytes = Buffer.from(secret.split("_")[1], "base64");

        const expectedSignature = createHmac("sha256", secretBytes)
            .update(signedContent)
            .digest("base64");

        return (
            svixSignature.length === expectedSignature.length &&
            timingSafeEqual(Buffer.from(svixSignature), Buffer.from(expectedSignature))
        );
    }
}

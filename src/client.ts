import { Webhook } from "svix";
import { version } from "../package.json";
import type { BlindpayApiResponse, RequestOptions } from "../types";
import type { InternalApiClient } from "./internal/api-client";
import { BlindPayError } from "./internal/blindpay-error";
import { toErrorResponse } from "./internal/error-response";
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

        this.upload = createUploadResource(this.instanceId, this.baseUrl, this.headers, this.api);

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

    private async request<T>(
        method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
        path: string,
        body?: Record<string, unknown>,
        options?: RequestOptions
    ): Promise<BlindpayApiResponse<T>> {
        try {
            const idempotencyKey = options?.idempotencyKey;
            const response = await fetch(`${this.baseUrl}${path}`, {
                method,
                headers: idempotencyKey
                    ? { ...this.headers, "Idempotency-Key": idempotencyKey }
                    : this.headers,
                body: body ? JSON.stringify(body) : undefined,
            });

            if (!response.ok) {
                return {
                    data: null,
                    error: toErrorResponse(await this.parseJsonResponse<unknown>(response)),
                };
            }

            const data = await this.parseJsonResponse<T>(response);

            return {
                data: data as T,
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

    private async parseJsonResponse<T>(response: Response): Promise<T | null> {
        const text = await response.text();
        return text ? (JSON.parse(text) as T) : null;
    }

    private async get<T>(path: string): Promise<BlindpayApiResponse<T>> {
        return this.request<T>("GET", path);
    }

    private async post<T>(
        path: string,
        body: Record<string, unknown>,
        options?: RequestOptions
    ): Promise<BlindpayApiResponse<T>> {
        return this.request<T>("POST", path, body, options);
    }

    private async put<T>(
        path: string,
        body: Record<string, unknown>,
        options?: RequestOptions
    ): Promise<BlindpayApiResponse<T>> {
        return this.request<T>("PUT", path, body, options);
    }

    private async patch<T>(
        path: string,
        body: Record<string, unknown>,
        options?: RequestOptions
    ): Promise<BlindpayApiResponse<T>> {
        return this.request<T>("PATCH", path, body, options);
    }

    private async delete<T>(
        path: string,
        options?: RequestOptions
    ): Promise<BlindpayApiResponse<T>> {
        return this.request<T>("DELETE", path, undefined, options);
    }

    /**
     * Verifies the BlindPay webhook signature using Svix
     *
     * @param params.secret The webhook secret from BlindPay dashboard
     * @param params.headers The webhook headers object containing svix-id, svix-timestamp, and svix-signature
     * @param params.payload The raw request body as a string
     * @returns {boolean} True if the signature is valid, false otherwise
     */
    verifyWebhookSignature({
        secret,
        headers,
        payload,
    }: {
        secret: string;
        headers: {
            id: string;
            timestamp: string;
            signature: string;
        };
        payload: string;
    }): boolean {
        try {
            const webhook = new Webhook(secret);

            webhook.verify(payload, {
                "svix-id": headers.id,
                "svix-timestamp": headers.timestamp,
                "svix-signature": headers.signature,
            });

            return true;
        } catch {
            return false;
        }
    }

    /**
     * Verifies a BlindPay webhook with Svix and returns its payload, typed by `webhook_event`.
     *
     * @param params.secret The webhook secret from BlindPay dashboard
     * @param params.headers The webhook headers object containing svix-id, svix-timestamp, and svix-signature
     * @param params.payload The raw request body as a string
     * @returns The verified payload; narrow it with a `switch` on `event.webhook_event`
     * @throws {BlindPayError} When the signature or timestamp does not verify
     */
    constructWebhookEvent({
        secret,
        headers,
        payload,
    }: {
        secret: string;
        headers: {
            id: string;
            timestamp: string;
            signature: string;
        };
        payload: string;
    }): import("./resources/webhooks/events").WebhookEvent {
        try {
            const webhook = new Webhook(secret);

            return webhook.verify(payload, {
                "svix-id": headers.id,
                "svix-timestamp": headers.timestamp,
                "svix-signature": headers.signature,
            }) as import("./resources/webhooks/events").WebhookEvent;
        } catch (error) {
            throw new BlindPayError(
                `Webhook verification failed: ${error instanceof Error ? error.message : String(error)}`
            );
        }
    }
}

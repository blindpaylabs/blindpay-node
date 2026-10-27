import type { BlindpayApiResponse, RequestOptions, SuccessResponse } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type WebhookEvents =
    | "bankAccount.new"
    | "payout.new"
    | "payout.update"
    | "payout.complete"
    | "payout.partnerFee"
    | "blockchainWallet.new"
    | "blockchainWallet.update"
    | "payin.new"
    | "payin.update"
    | "payin.complete"
    | "payin.partnerFee"
    | "tos.accept"
    | "limitIncrease.new"
    | "limitIncrease.update"
    | "virtualAccount.new"
    | "virtualAccount.complete"
    | "transfer.new"
    | "transfer.update"
    | "transfer.complete"
    | "wallet.new"
    | "wallet.inbound"
    | "customer.new"
    | "customer.update"
    | "payable.complete"
    | "payable.new"
    | "payable.update"
    | "wallet.update"
    | "customer.delete";

export type CreateWebhookEndpointInput = {
    url: string;
    events: WebhookEvents[];
};

export type CreateWebhookEndpointResponse = {
    id: string;
};

export type DeleteWebhookEndpointInput = string;

export type ListWebhookEndpointsResponse = Array<{
    id: string;
    url: string;
    events: WebhookEvents[];
    last_event_at?: string | null;
    instance_id: string;
    created_at: string | null;
    updated_at: string | null;
}>;

export type GetWebhookEndpointSecretInput = string;

export type GetWebhookEndpointSecretResponse = {
    key: string;
};

export type GetPortalAccessUrlResponse = {
    url: string;
};

export function createWebhookEndpointsResource(instanceId: string, client: InternalApiClient) {
    return {
        list(): Promise<BlindpayApiResponse<ListWebhookEndpointsResponse>> {
            return client.get(`/instances/${instanceId}/webhook-endpoints`);
        },
        create(
            { ...data }: CreateWebhookEndpointInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<CreateWebhookEndpointResponse>> {
            return client.post(`/instances/${instanceId}/webhook-endpoints`, data, options);
        },
        delete(
            id: DeleteWebhookEndpointInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<SuccessResponse>> {
            return client.delete(`/instances/${instanceId}/webhook-endpoints/${id}`, options);
        },
        getSecret(
            id: GetWebhookEndpointSecretInput
        ): Promise<BlindpayApiResponse<GetWebhookEndpointSecretResponse>> {
            return client.get(`/instances/${instanceId}/webhook-endpoints/${id}/secret`);
        },
        getPortalAccessUrl(): Promise<BlindpayApiResponse<GetPortalAccessUrlResponse>> {
            return client.get(`/instances/${instanceId}/webhook-endpoints/portal-access`);
        },
    };
}

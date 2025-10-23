import type { BlindpayApiResponse } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type WebhookEvents =
    | "receiver.new"
    | "receiver.update"
    | "bankAccount.new"
    | "payout.new"
    | "payout.update"
    | "payout.complete"
    | "payout.partnerFee"
    | "blockchainWallet.new"
    | "payin.new"
    | "payin.update"
    | "payin.complete"
    | "payin.partnerFee"
    | "tos.accept";

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
    last_event_at: string;
    instance_id: string;
    created_at: string;
    updated_at: string;
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
        create({
            ...data
        }: CreateWebhookEndpointInput): Promise<
            BlindpayApiResponse<CreateWebhookEndpointResponse>
        > {
            return client.post(`/instances/${instanceId}/webhook-endpoints`, data);
        },
        delete(id: DeleteWebhookEndpointInput): Promise<BlindpayApiResponse<void>> {
            return client.delete(`/instances/${instanceId}/webhook-endpoints/${id}`);
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

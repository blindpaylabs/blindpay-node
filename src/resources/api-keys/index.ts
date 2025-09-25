import type { BlindpayApiResponse } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

type ApiKey = {
    id: string;
    name: string;
    permission: "full_access";
    token: string;
    ip_whitelist?: string[];
    unkey_id: string;
    last_used_at: string | null;
    instance_id: string;
    created_at: string;
    updated_at: string;
};

export type ListApiKeysInput = {
    instanceId: string;
};

export type ListApiKeysResponse = ApiKey[];

export type CreateApiKeyInput = {
    instanceId: string;
    name: string;
    permission: "full_access";
    ip_whitelist?: string[];
};

export type CreateApiKeyResponse = {
    id: string;
    token: string;
};

export type GetApiKeyInput = {
    instanceId: string;
    id: string;
};

export type GetApiKeyResponse = ApiKey;

export type DeleteApiKeyInput = {
    instanceId: string;
    id: string;
};

export function createApiKeysResource(client: InternalApiClient) {
    return {
        list({ instanceId }: ListApiKeysInput): Promise<BlindpayApiResponse<ListApiKeysResponse>> {
            return client.get(`/instances/${instanceId}/api-keys`);
        },
        create({
            instanceId,
            ...data
        }: CreateApiKeyInput): Promise<BlindpayApiResponse<CreateApiKeyResponse>> {
            return client.post(`/instances/${instanceId}/api-keys`, data);
        },
        get({ instanceId, id }: GetApiKeyInput): Promise<BlindpayApiResponse<GetApiKeyResponse>> {
            return client.get(`/instances/${instanceId}/api_keys/${id}`);
        },
        delete({ instanceId, id }: DeleteApiKeyInput): Promise<BlindpayApiResponse<void>> {
            return client.delete(`/instances/${instanceId}/api-keys/${id}`);
        },
    };
}

import type { BlindpayApiResponse } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type ListApiKeysResponse = Array<{
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
}>;

export type CreateApiKeyInput = {
    name: string;
    permission: "full_access";
    ip_whitelist?: string[];
};

export type CreateApiKeyResponse = {
    id: string;
    token: string;
};

export type GetApiKeyInput = string;

export type GetApiKeyResponse = {
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

export type DeleteApiKeyInput = string;

export function createApiKeysResource(instanceId: string, client: InternalApiClient) {
    return {
        list(): Promise<BlindpayApiResponse<ListApiKeysResponse>> {
            return client.get(`/instances/${instanceId}/api-keys`);
        },
        create({ ...data }: CreateApiKeyInput): Promise<BlindpayApiResponse<CreateApiKeyResponse>> {
            return client.post(`/instances/${instanceId}/api-keys`, data);
        },
        get(id: GetApiKeyInput): Promise<BlindpayApiResponse<GetApiKeyResponse>> {
            return client.get(`/instances/${instanceId}/api-keys/${id}`);
        },
        delete(id: DeleteApiKeyInput): Promise<BlindpayApiResponse<void>> {
            return client.delete(`/instances/${instanceId}/api-keys/${id}`);
        },
    };
}

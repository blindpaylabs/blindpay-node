import type { BlindpayApiResponse } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type InitiateInput = {
    idempotency_key: string;
    receiver_id: string | null;
    redirect_url: string | null;
};

export type InitiateResponse = {
    url: string;
};

export function createTermsOfServiceResource(instanceId: string, client: InternalApiClient) {
    return {
        initiate({
            idempotency_key,
            receiver_id,
            redirect_url,
        }: InitiateInput): Promise<BlindpayApiResponse<InitiateResponse>> {
            return client.post(`/e/instances/${instanceId}/tos`, {
                idempotency_key,
                receiver_id,
                redirect_url,
            });
        },
    };
}

import type { BlindpayApiResponse } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type InitiateTermsOfServiceInput = {
    idempotency_key: string;
    receiver_id: string | null;
    redirect_url: string | null;
};

export type InitiateTermsOfServiceResponse = {
    url: string;
};

export function createTermsOfServiceResource(instanceId: string, client: InternalApiClient) {
    return {
        initiate({
            idempotency_key,
            receiver_id,
            redirect_url,
        }: InitiateTermsOfServiceInput): Promise<
            BlindpayApiResponse<InitiateTermsOfServiceResponse>
        > {
            return client.post(`/e/instances/${instanceId}/tos`, {
                idempotency_key,
                receiver_id,
                redirect_url,
            });
        },
    };
}

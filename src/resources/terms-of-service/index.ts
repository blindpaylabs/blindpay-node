import type { BlindpayApiResponse, RequestOptions } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type InitiateInput = {
    idempotency_key: string;
    customer_id?: string | null;
    redirect_url?: string | null;
};

export type InitiateResponse = {
    url: string;
};

export function createTermsOfServiceResource(instanceId: string, client: InternalApiClient) {
    return {
        /**
         * `idempotency_key` here is a body field the API requires for the ToS flow; it is not the
         * `Idempotency-Key` header, which `options.idempotencyKey` sets (or the SDK generates).
         */
        initiate(
            { idempotency_key, customer_id, redirect_url }: InitiateInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<InitiateResponse>> {
            return client.post(
                `/e/instances/${instanceId}/tos`,
                { idempotency_key, customer_id, redirect_url },
                options
            );
        },
    };
}

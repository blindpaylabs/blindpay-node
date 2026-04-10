import type { BlindpayApiResponse } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type FeeOptions = {
    payin_flat: number;
    payin_percentage: number;
    payout_flat: number;
    payout_percentage: number;
};

export type GetFeesResponse = {
    id: string;
    instance_id: string;
    ach: FeeOptions;
    domestic_wire: FeeOptions;
    rtp: FeeOptions;
    international_swift: FeeOptions;
    pix: FeeOptions;
    pix_safe: FeeOptions;
    ach_colombia: FeeOptions;
    transfers_3: FeeOptions;
    spei: FeeOptions;
    tron: FeeOptions;
    ethereum: FeeOptions;
    polygon: FeeOptions;
    base: FeeOptions;
    arbitrum: FeeOptions;
    stellar: FeeOptions;
    solana: FeeOptions;
    created_at: string;
    updated_at: string;
};

export function createFeesResource(instanceId: string, client: InternalApiClient) {
    return {
        get(): Promise<BlindpayApiResponse<GetFeesResponse>> {
            return client.get(`/instances/${instanceId}/billing/fees`);
        },
    };
}

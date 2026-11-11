import type { BlindpayApiResponse, Network, RequestOptions } from "../../../types";
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
    sepa: FeeOptions;
    faster_payments: FeeOptions;
    tron: FeeOptions;
    ethereum: FeeOptions;
    polygon: FeeOptions;
    base: FeeOptions;
    arbitrum: FeeOptions;
    stellar: FeeOptions;
    solana: FeeOptions;
    ted?: FeeOptions | null;
    created_at: string | null;
    updated_at: string | null;
    /** Yield fee split, in basis points (100 = 1%). */
    yield?: {
        blindpay_share_bps: number;
        partner_share_bps: number;
        /** EVM address that receives the instance share, per network. A network without an address charges no instance share there. */
        partner_wallets?: Partial<Record<Network, string>>;
        /** @deprecated No longer returned by the API (spec 66144f3b2); read `partner_wallets` instead. Kept so existing code compiles; removed in the next major. */
        partner_wallet_address?: string | null;
    } | null;
};

export function createFeesResource(instanceId: string, client: InternalApiClient) {
    return {
        get(options?: RequestOptions): Promise<BlindpayApiResponse<GetFeesResponse>> {
            return client.get(`/instances/${instanceId}/billing/fees`, options);
        },
    };
}

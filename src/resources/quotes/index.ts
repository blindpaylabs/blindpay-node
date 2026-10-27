import type {
    BlindpayApiResponse,
    Currency,
    CurrencyType,
    Network,
    StablecoinToken,
} from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type CreateQuoteInput = {
    bank_account_id?: string | null;
    currency_type?: CurrencyType;
    cover_fees?: boolean | null;
    request_amount?: number | null;
    network: Network;
    token: StablecoinToken;
    description?: string | null;
    partner_fee_id?: string | null;
    refund_wallet_address?: string | null;
    payable_id?: string | null;
};
export type CreateQuoteResponse = {
    id: string;
    expires_at: number | null;
    commercial_quotation: number | null;
    blindpay_quotation: number | null;
    receiver_amount: number | null;
    sender_amount: number | null;
    partner_fee_amount?: number | null;
    flat_fee?: number | null;
    contract?: {
        abi: Record<string, unknown>[];
        address: string;
        functionName: "approve";
        blindpayContractAddress: string;
        amount: string;
        network: {
            name: string;
            chainId: number;
        };
    } | null;
    customer_local_amount?: number | null;
    description?: string | null;
    billing_fee_amount?: number | null;
};

export type GetFxRateInput = {
    currency_type: CurrencyType;
    from: StablecoinToken;
    to: Extract<Currency, "BRL" | "USD" | "MXN" | "COP" | "ARS" | "EUR" | "GBP">;
    request_amount: number;
};

export type GetFxRateResponse = {
    commercial_quotation: number | null;
    blindpay_quotation: number | null;
    result_amount: number;
    instance_flat_fee?: number | null;
    instance_percentage_fee: number;
};

export function createQuotesResource(instanceId: string, client: InternalApiClient) {
    return {
        create({ ...data }: CreateQuoteInput): Promise<BlindpayApiResponse<CreateQuoteResponse>> {
            return client.post(`/instances/${instanceId}/quotes`, data);
        },

        getFxRate({ ...data }: GetFxRateInput): Promise<BlindpayApiResponse<GetFxRateResponse>> {
            return client.post(`/instances/${instanceId}/quotes/fx`, data);
        },
    };
}

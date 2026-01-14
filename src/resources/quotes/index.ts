import type {
    BlindpayApiResponse,
    Currency,
    CurrencyType,
    Network,
    StablecoinToken,
    TransactionDocumentType,
} from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type CreateQuoteInput = {
    bank_account_id: string;
    currency_type: CurrencyType;
    cover_fees: boolean;
    request_amount: number;
    network: Network;
    token?: StablecoinToken | null;
    description?: string | null;
    partner_fee_id?: string | null;
    transaction_document_file: string | null;
    transaction_document_id?: string | null;
    transaction_document_type?: TransactionDocumentType | null;
};
export type CreateQuoteResponse = {
    id: string;
    expires_at: number;
    commercial_quotation: number;
    blindpay_quotation: number;
    receiver_amount: number;
    sender_amount: number;
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
    receiver_local_amount?: number | null;
    description?: string | null;
};

export type GetFxRateInput = {
    currency_type: CurrencyType;
    from: StablecoinToken;
    to: Extract<Currency, "BRL" | "USD" | "MXN" | "COP" | "ARS">;
    request_amount: number;
};

export type GetFxRateResponse = {
    commercial_quotation: number;
    blindpay_quotation: number;
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

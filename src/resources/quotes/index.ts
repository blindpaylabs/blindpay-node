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
    network?: Network | null;
    request_amount: number;
    token?: StablecoinToken | null;
    cover_fees: boolean | null;
    description?: string | null;
    partner_fee_id: string | null;
    transaction_document_file: string | null;
    transaction_document_id: string | null;
    transaction_document_type: TransactionDocumentType;
};
export type CreateQuoteResponse = {
    id: string;
    expires_at: number;
    commercial_quotation: number;
    blindpay_quotation: number;
    receiver_amount: number;
    sender_amount: number;
    partner_fee_amount: number;
    flat_fee: number;
    contract: {
        abi: Record<string, unknown>[];
        address: string;
        functionName: string;
        blindpayContractAddress: string;
        amount: string;
        network: {
            name: string;
            chainId: number;
        };
    };
    receiver_local_amount: number;
    description: string;
};

export type GetFxRateInput = {
    currency_type: CurrencyType;
    from: Currency;
    to: Currency;
    request_amount: number;
};

export type GetFxRateResponse = {
    commercial_quotation: number;
    blindpay_quotation: number;
    result_amount: number;
    instance_flat_fee: number;
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

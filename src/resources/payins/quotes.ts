import type {
    BlindpayApiResponse,
    Currency,
    CurrencyType,
    PayerRules,
    PayinPaymentMethod,
    StablecoinToken,
} from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type CreatePayinQuoteInput = {
    blockchain_wallet_id: string;
    currency_type: CurrencyType;
    payment_method: PayinPaymentMethod;
    request_amount: number;
    token: StablecoinToken;
    is_otc?: boolean | null;
    cover_fees: boolean;
    partner_fee_id: string | null;
    payer_rules?: PayerRules | null;
};

export type CreatePayinQuoteResponse = {
    id: string;
    expires_at: number;
    commercial_quotation: number;
    blindpay_quotation: number;
    receiver_amount: number;
    sender_amount: number;
    partner_fee_amount?: number | null;
    flat_fee: number;
    is_otc?: boolean | null;
};

export type GetPayinFxRateInput = {
    currency_type: CurrencyType;
    from: Currency;
    to: Currency;
    request_amount: number;
};

export type GetPayinFxRateResponse = {
    commercial_quotation: number;
    blindpay_quotation: number;
    result_amount: number;
    instance_flat_fee: number;
    instance_percentage_fee: number;
};

export function createPayinQuotesResource(instanceId: string, client: InternalApiClient) {
    return {
        create({
            ...data
        }: CreatePayinQuoteInput): Promise<BlindpayApiResponse<CreatePayinQuoteResponse>> {
            return client.post(`/instances/${instanceId}/payin-quotes`, data);
        },
        getFxRate({
            ...data
        }: GetPayinFxRateInput): Promise<BlindpayApiResponse<GetPayinFxRateResponse>> {
            return client.post(`/instances/${instanceId}/payin-quotes/fx`, data);
        },
    };
}

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
    blockchain_wallet_id: string | null;
    currency_type: CurrencyType;
    payment_method: PayinPaymentMethod;
    request_amount: number;
    token: StablecoinToken;
    is_otc?: boolean | null;
    cover_fees: boolean | null;
    partner_fee_id: string | null;
    payer_rules?: PayerRules | null;
    wallet_id?: string | null;
};

export type CreatePayinQuoteResponse = {
    id: string;
    expires_at: number | null;
    commercial_quotation: number | null;
    blindpay_quotation: number | null;
    receiver_amount: number | null;
    sender_amount: number | null;
    partner_fee_amount?: number | null;
    flat_fee: number | null;
    is_otc?: boolean | null;
};

export type GetPayinFxRateInput = {
    currency_type: CurrencyType;
    from: Extract<Currency, "BRL" | "USD" | "MXN" | "COP" | "ARS" | "EUR" | "GBP">;
    to: Extract<Currency, "USDC" | "USDT" | "USDB">;
    request_amount: number;
};

export type GetPayinFxRateResponse = {
    commercial_quotation: number | null;
    blindpay_quotation: number | null;
    result_amount: number;
    instance_flat_fee: number | null;
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

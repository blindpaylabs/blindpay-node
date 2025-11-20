import type { BlindpayApiResponse, Currency, CurrencyType, StablecoinToken } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type PayinPaymentMethod = "ach" | "wire" | "pix" | "spei";

export type CreatePayinQuoteInput = {
    blockchain_wallet_id: string;
    currency_type: CurrencyType;
    payment_method: PayinPaymentMethod;
    request_amount: number;
    token: StablecoinToken;
    cover_fees: boolean;
    partner_fee_id: string | null;
    payer_rules: {
        pix_allowed_tax_ids: string[];
    };
};

export type CreatePayinQuoteResponse = {
    id: string;
    expires_at: number;
    commercial_quotation: number;
    blindpay_quotation: number;
    receiver_amount: number;
    sender_amount: number;
    partner_fee_amount: number | null;
    flat_fee: number | null;
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

export type GetPayinQuoteInput = string;

export type GetPayinQuoteResponse = {
    id: string;
    payment_method: PayinPaymentMethod;
    token: StablecoinToken;
    request_amount: number;
    cover_fees: boolean;
    currency_type: CurrencyType;
    expires_at: number | null;
    currency: Extract<Currency, "BRL" | "USD" | "MXN" | "COP" | "ARS">;
    commercial_quotation: number | null;
    blindpay_quotation: number | null;
    receiver_amount: number;
    sender_amount: number;
    partner_fee_amount: number | null;
    flat_fee: number | null;
    total_fee_amount: number | null;
    payer_rules: {
        pix_allowed_tax_ids: string[];
    } | null;
    blockchain_wallet_id: string;
    instance_id: string;
    partner_fee_id: string | null;
    billing_fee: number | null;
    created_at: string;
    updated_at: string;
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
        get(id: GetPayinQuoteInput): Promise<BlindpayApiResponse<GetPayinQuoteResponse>> {
            return client.get(`/instances/${instanceId}/payin-quotes/${id}`);
        },
    };
}

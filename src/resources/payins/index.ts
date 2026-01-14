import type {
    AccountClass,
    AchCopDocument,
    BlindpayApiResponse,
    Currency,
    Network,
    PaginationMetadata,
    PaginationParams,
    PayerRules,
    PayinPaymentMethod,
    PayinTrackingComplete,
    PayinTrackingPartnerFee,
    PayinTrackingPayment,
    PayinTrackingTransaction,
    StablecoinToken,
    TransactionStatus,
} from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type BlindpayBankDetails = {
    routing_number: string;
    account_number: string;
    account_type: string;
    swift_bic_code?: string | null;
    ach?: {
        routing_number: string;
        account_number: string;
    } | null;
    wire?: {
        routing_number: string;
        account_number: string;
    } | null;
    rtp?: {
        routing_number: string;
        account_number: string;
    } | null;
    beneficiary: {
        name: string;
        address_line_1: string;
        address_line_2: string;
    };
};

export type Payin = {
    id: string;
    receiver_id: string;
    pix_code?: string | null;
    memo_code?: string | null;
    clabe?: string | null;
    status: TransactionStatus;
    payin_quote_id: string;
    instance_id: string;
    tracking_transaction: PayinTrackingTransaction;
    tracking_payment: PayinTrackingPayment;
    tracking_complete: PayinTrackingComplete;
    tracking_partner_fee?: PayinTrackingPartnerFee;
    created_at: string;
    updated_at: string;
    image_url?: string | null | undefined;
    first_name?: string | null | undefined;
    last_name?: string | null | undefined;
    legal_name?: string | null | undefined;
    type: AccountClass;
    payment_method: PayinPaymentMethod;
    sender_amount: number;
    receiver_amount: number;
    token: StablecoinToken;
    partner_fee_amount?: number | null;
    total_fee_amount?: number | null;
    commercial_quotation: number;
    blindpay_quotation: number;
    currency: Extract<Currency, "BRL" | "USD" | "MXN" | "COP" | "ARS">;
    billing_fee?: number | null;
    is_otc?: boolean | null;
    payer_rules?: PayerRules | null;
    name: string;
    address?: string | null;
    network: Network;
    blindpay_bank_details?: BlindpayBankDetails | null;
    pse_payment_link?: string | null;
    pse_full_name?: string | null;
    pse_tax_id?: string | null;
    pse_document_type?: Extract<AchCopDocument, "CC" | "NIT"> | null;
};

export type ListPayinsInput = PaginationParams & {
    status?: TransactionStatus;
    receiver_id?: string;
};

export type ListPayinsResponse =
    | {
          data: Payin[];
          pagination: PaginationMetadata;
      }
    | Payin[];

export type CreatePayinInput = {
    quote_id: string;
};

export type GetPayinInput = string;

export type GetPayinResponse = Payin;

export type GetPayinTrackInput = string;

export type GetPayinTrackResponse = Payin;

export type CreateEvmPayinInput = string;

export type CreateEvmPayinResponse = Pick<
    Payin,
    | "id"
    | "status"
    | "pix_code"
    | "memo_code"
    | "clabe"
    | "tracking_complete"
    | "tracking_payment"
    | "tracking_transaction"
    | "tracking_partner_fee"
> & {
    blindpay_bank_details: BlindpayBankDetails;
    receiver_id?: string | null;
    receiver_amount?: number | null;
    payment_method?: PayinPaymentMethod | null;
    billing_fee?: number | null;
    sender_amount?: number | null;
};

export function createPayinsResource(instanceId: string, client: InternalApiClient) {
    return {
        list(params?: ListPayinsInput): Promise<BlindpayApiResponse<ListPayinsResponse>> {
            const queryParams = params ? `?${new URLSearchParams(params)}` : "";
            return client.get(`/instances/${instanceId}/payins${queryParams}`);
        },
        get(payinId: GetPayinInput): Promise<BlindpayApiResponse<GetPayinResponse>> {
            return client.get(`/instances/${instanceId}/payins/${payinId}`);
        },
        getTrack(payinId: GetPayinTrackInput): Promise<BlindpayApiResponse<GetPayinTrackResponse>> {
            return client.get(`/e/payins/${payinId}`);
        },
        createEvm(
            payin_quote_id: CreateEvmPayinInput
        ): Promise<BlindpayApiResponse<CreateEvmPayinResponse>> {
            return client.post(`/instances/${instanceId}/payins/evm`, {
                payin_quote_id,
            });
        },
    };
}

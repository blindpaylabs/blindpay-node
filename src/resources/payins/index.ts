import type {
    BlindpayApiResponse,
    Network,
    PaginationMetadata,
    PaginationParams,
    StablecoinToken,
    TrackingComplete,
    TrackingPartnerFee,
    TrackingPayment,
    TrackingTransaction,
    TransactionStatus,
} from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type Payin = {
    receiver_id: string;
    id: string;
    pix_code?: string;
    memo_code?: string;
    clabe?: string;
    status: TransactionStatus;
    payin_quote_id: string;
    instance_id: string;
    tracking_transaction?: TrackingTransaction;
    tracking_payment?: TrackingPayment;
    tracking_complete?: TrackingComplete;
    tracking_partner_fee?: TrackingPartnerFee;
    created_at: string;
    updated_at: string;
    image_url?: string;
    first_name?: string;
    last_name?: string;
    legal_name?: string;
    type: string;
    payment_method: string;
    sender_amount: number;
    receiver_amount: number;
    token: StablecoinToken;
    partner_fee_amount: number;
    total_fee_amount: number;
    commercial_quotation: number;
    blindpay_quotation: number;
    currency: string;
    billing_fee: number;
    name: string;
    address: string;
    network: Network;
    blindpay_bank_details: {
        routing_number: string;
        account_number: string;
        account_type: string;
        swift_bic_code: string;
        ach: {
            routing_number: string;
            account_number: string;
        };
        wire: {
            routing_number: string;
            account_number: string;
        };
        rtp: {
            routing_number: string;
            account_number: string;
        };
        beneficiary: {
            name: string;
            address_line_1: string;
            address_line_2: string;
        };
        receiving_bank: {
            name: string;
            address_line_1: string;
            address_line_2: string;
        };
    };
};

export type ListPayinsInput = PaginationParams & {
    status?: TransactionStatus;
    receiver_id?: string;
};

export type ListPayinsResponse = {
    data: Payin[];
    pagination: PaginationMetadata;
};

export type CreatePayinInput = {
    quote_id: string;
    sender_address: string;
    receiver_address: string;
    amount: number;
    token: StablecoinToken;
    network: Network;
    description?: string | null;
};

export type GetPayinInput = string;

export type GetPayinResponse = Payin;

export type GetPayinTrackInput = string;

export type GetPayinTrackResponse = {
    receiver_id: string;
    id: string;
    pix_code: string;
    memo_code: string;
    clabe: string;
    status: string;
    payin_quote_id: string;
    instance_id: string;
    tracking_transaction: {
        step: string;
        status: string;
        external_id: string;
        completed_at: string;
        sender_name: string;
        sender_tax_id: string;
        sender_bank_code: string;
        sender_account_number: string;
        trace_number: string;
        transaction_reference: string;
        description: string;
    };
    tracking_payment: {
        step: string;
        provider_name: string;
        completed_at: string;
    };
    tracking_complete: {
        step: string;
        transaction_hash: string;
        completed_at: string;
    };
    tracking_partner_fee: {
        step: string;
        transaction_hash: string;
        completed_at: string;
    };
    created_at: string;
    updated_at: string;
    image_url: string;
    first_name: string;
    last_name: string;
    legal_name: string;
    type: string;
    payment_method: string;
    sender_amount: number;
    receiver_amount: number;
    token: StablecoinToken;
    partner_fee_amount: number;
    total_fee_amount: number;
    commercial_quotation: number;
    blindpay_quotation: number;
    currency: string;
    billing_fee: number;
    name: string;
    address: string;
    network: Network;
    blindpay_bank_details: {
        routing_number: string;
        account_number: string;
        account_type: string;
        swift_bic_code: string;
        ach: {
            routing_number: string;
            account_number: string;
        };
        wire: {
            routing_number: string;
            account_number: string;
        };
        rtp: {
            routing_number: string;
            account_number: string;
        };
        beneficiary: {
            name: string;
            address_line_1: string;
            address_line_2: string;
        };
        receiving_bank: {
            name: string;
            address_line_1: string;
            address_line_2: string;
        };
    };
};

export type ExportPayinsInput = Pick<PaginationParams, "limit" | "offset"> & {
    status: TransactionStatus;
};

export type ExportPayinsResponse = Payin[];

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
    | "blindpay_bank_details"
    | "receiver_id"
    | "receiver_amount"
>;

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
        export({
            ...params
        }: ExportPayinsInput): Promise<BlindpayApiResponse<ExportPayinsResponse>> {
            const queryParams = params ? `?${new URLSearchParams(params)}` : "";
            return client.get(`/instances/${instanceId}/export/payins${queryParams}`);
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

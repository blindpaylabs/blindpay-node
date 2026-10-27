import type {
    BlindpayApiResponse,
    Network,
    PaginationMetadata,
    PaginationParams,
    StablecoinToken,
    TrackingStatus,
    TransactionStatus,
} from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type TransferTrackingStep = {
    step: TrackingStatus;
    transaction_hash: string | null;
    gas_fee: string | null;
    completed_at: string | null;
    error_message: string | null;
};

export type TransferTrackingTransactionMonitoring = {
    step: TrackingStatus;
    blockchain_screening: number | null;
    risk_score: number | null;
    completed_at: string | null;
};

export type Transfer = {
    id: string;
    status: TransactionStatus;
    transfer_quote_id: string;
    instance_id: string;
    tracking_transaction_monitoring: TransferTrackingTransactionMonitoring;
    tracking_paymaster: TransferTrackingStep;
    tracking_bridge_swap: TransferTrackingStep;
    tracking_complete: TransferTrackingStep;
    tracking_partner_fee: TransferTrackingStep | null;
    created_at: string | null;
    updated_at: string | null;
    image_url?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    legal_name?: string | null;
    wallet_id: string;
    sender_token: StablecoinToken;
    sender_amount: number;
    receiver_amount: number;
    customer_network: Network;
    customer_token: StablecoinToken;
    customer_wallet_address: string;
    partner_fee_amount: number | null;
    customer_id: string;
    address: string | null;
    network: Network;
    partner_flat_fee?: number;
    partner_percentage_fee?: number;
};

export type CreateTransferQuoteInput = {
    wallet_id: string;
    sender_token: StablecoinToken;
    customer_wallet_address: string;
    customer_token: StablecoinToken;
    customer_network: Network;
    request_amount: number;
    cover_fees?: boolean | null;
    amount_reference: "sender" | "receiver";
    partner_fee_id?: string | null;
    partner_flat_fee?: number;
    partner_percentage_fee?: number;
};

export type CreateTransferQuoteResponse = {
    id: string;
    expires_at: number | null;
    commercial_quotation: number | null;
    blindpay_quotation: number | null;
    receiver_amount: number;
    sender_amount: number;
    partner_fee_amount: number | null;
    flat_fee: number;
    partner_flat_fee?: number;
    partner_percentage_fee?: number;
};

export type CreateTransferInput = {
    transfer_quote_id: string;
};

export type CreateTransferResponse = {
    id: string;
    status: TransactionStatus;
    tracking_bridge_swap: TransferTrackingStep;
    tracking_complete: TransferTrackingStep;
    tracking_paymaster: TransferTrackingStep;
    tracking_transaction_monitoring: TransferTrackingTransactionMonitoring;
    tracking_partner_fee: TransferTrackingStep | null;
};

export type ListTransfersInput = PaginationParams;

export type ListTransfersResponse = {
    data: Transfer[];
    pagination: PaginationMetadata;
};

export type GetTransferInput = string;

export type GetTransferResponse = Transfer;

export type GetTransferTrackInput = string;

export type GetTransferTrackResponse = Transfer;

export function createTransfersResource(instanceId: string, client: InternalApiClient) {
    return {
        quotes: {
            create({
                ...data
            }: CreateTransferQuoteInput): Promise<
                BlindpayApiResponse<CreateTransferQuoteResponse>
            > {
                return client.post(`/instances/${instanceId}/transfer-quotes`, data);
            },
        },
        create({
            ...data
        }: CreateTransferInput): Promise<BlindpayApiResponse<CreateTransferResponse>> {
            return client.post(`/instances/${instanceId}/transfers`, data);
        },
        list(params?: ListTransfersInput): Promise<BlindpayApiResponse<ListTransfersResponse>> {
            const queryParams = params ? `?${new URLSearchParams(params)}` : "";
            return client.get(`/instances/${instanceId}/transfers${queryParams}`);
        },
        get(transferId: GetTransferInput): Promise<BlindpayApiResponse<GetTransferResponse>> {
            return client.get(`/instances/${instanceId}/transfers/${transferId}`);
        },
        getTrack(
            transferId: GetTransferTrackInput
        ): Promise<BlindpayApiResponse<GetTransferTrackResponse>> {
            return client.get(`/e/transfers/${transferId}`);
        },
    };
}

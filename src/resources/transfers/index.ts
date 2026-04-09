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
import { buildQueryString } from "../../internal/query-string";

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
    tracking_partner_fee: TransferTrackingStep;
    created_at: string;
    updated_at: string;
    image_url?: string;
    first_name?: string;
    last_name?: string;
    legal_name?: string;
    wallet_id: string;
    sender_token: StablecoinToken;
    sender_amount: number;
    receiver_amount: number;
    receiver_network: Network;
    receiver_token: StablecoinToken;
    receiver_wallet_address: string;
    partner_fee_amount: number | null;
};

export type CreateTransferQuoteInput = {
    wallet_id: string;
    sender_token: StablecoinToken;
    receiver_wallet_address: string;
    receiver_token: StablecoinToken;
    receiver_network: Network;
    request_amount: number;
    cover_fees: boolean;
    amount_reference: "sender" | "receiver";
    partner_fee_id?: string | null;
};

export type CreateTransferQuoteResponse = {
    id: string;
    expires_at: number;
    commercial_quotation: number;
    blindpay_quotation: number;
    receiver_amount: number;
    sender_amount: number;
    partner_fee_amount: number | null;
    flat_fee: number;
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
    tracking_partner_fee: TransferTrackingStep;
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
        list(
            params?: ListTransfersInput
        ): Promise<BlindpayApiResponse<ListTransfersResponse>> {
            return client.get(`/instances/${instanceId}/transfers${buildQueryString(params ?? {})}`);
        },
        get(
            transferId: GetTransferInput
        ): Promise<BlindpayApiResponse<GetTransferResponse>> {
            return client.get(`/instances/${instanceId}/transfers/${transferId}`);
        },
        getTrack(
            transferId: GetTransferTrackInput
        ): Promise<BlindpayApiResponse<GetTransferTrackResponse>> {
            return client.get(`/e/transfers/${transferId}`);
        },
    };
}

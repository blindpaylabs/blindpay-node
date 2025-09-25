import type {
    AccountClass,
    BankAccountType,
    BlindpayApiResponse,
    Country,
    Currency,
    Network,
    PaginationMetadata,
    PaginationParams,
    Rail,
    StablecoinToken,
    TrackingComplete,
    TrackingLiquidity,
    TrackingPartnerFee,
    TrackingPayment,
    TrackingTransaction,
    TransactionDocumentType,
    TransactionStatus,
} from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type SpeiProtocol = "clabe" | "debitcard" | "phonenum";

export type Payout = {
    receiver_id: string;
    id: string;
    status: TransactionStatus;
    sender_wallet_address: string;
    signed_transaction: string;
    quote_id: string;
    instance_id: string;
    tracking_transaction: TrackingTransaction;
    tracking_payment: TrackingPayment;
    tracking_liquidity: TrackingLiquidity;
    tracking_complete: TrackingComplete;
    tracking_partner_fee: TrackingPartnerFee;
    created_at: string;
    updated_at: string;
    image_url: string;
    first_name: string;
    last_name: string;
    legal_name: string;
    network: Network;
    token: StablecoinToken;
    description: string;
    sender_amount: number;
    receiver_amount: number;
    partner_fee_amount: number;
    commercial_quotation: number;
    blindpay_quotation: number;
    total_fee_amount: number;
    receiver_local_amount: number;
    currency: Exclude<Currency, "USDT" | "USDB">;
    transaction_document_file: string;
    transaction_document_type: TransactionDocumentType;
    transaction_document_id: string;
    name: string;
    type: Rail;
    pix_key?: string;
    account_number?: string;
    routing_number?: string;
    country?: Country;
    account_class?: AccountClass;
    address_line_1?: string;
    address_line_2?: string;
    city?: string;
    state_province_region?: string;
    postal_code?: string;
    account_type?: BankAccountType;
    ach_cop_beneficiary_first_name?: string;
    ach_cop_bank_account?: string;
    ach_cop_bank_code?: string;
    ach_cop_beneficiary_last_name?: string;
    ach_cop_document_id?: string;
    ach_cop_document_type?: string;
    ach_cop_email?: string;
    beneficiary_name?: string;
    spei_clabe?: string;
    spei_protocol?: SpeiProtocol;
    spei_institution_code?: string;
    swift_beneficiary_country?: Country;
    swift_code_bic?: string;
    swift_account_holder_name?: string;
    swift_account_number_iban?: string;
    transfers_account?: string;
    transfers_type: "CVU" | "CBU" | "ALIAS";
    has_virtual_account: boolean;
};

export type ListPayoutsInput = {
    instanceId: string;
    params?: PaginationParams & {
        receiver_id?: string;
    };
};

export type ListPayoutsResponse = {
    data: Payout[];
    pagination: PaginationMetadata;
};

export type CreatePayoutInput = {
    instanceId: string;
    receiver_id: string;
    bank_account_id: string;
    amount: number;
    currency: string;
    description?: string | null;
    reference?: string | null;
    network?: Network | null;
    token?: StablecoinToken | null;
};

export type GetPayoutInput = {
    instanceId: string;
    id: string;
};

export type GetPayoutResponse = Payout;

export type GetPayoutTrackInput = {
    id: string;
};

export type GetPayoutTrackResponse = Payout;

export type ExportPayoutsInput = {
    instanceId: string;
    params?: Pick<PaginationParams, "limit" | "offset">;
};

export type ExportPayoutsResponse = Payout[];

export type AuthorizeStellarTokenInput = {
    instanceId: string;

    quote_id: string;
    sender_wallet_address: string;
};

export type AuthorizeStellarTokenResponse = {
    transaction_hash: string;
};

export type CreateStellarPayoutInput = {
    instanceId: string;

    quote_id: string;
    sender_wallet_address: string;
    signed_transaction?: string;
};

export type CreateStellarPayoutResponse = {
    id: string;
    status: TransactionStatus;
    sender_wallet_address: string;
    tracking_complete?: TrackingComplete;
    tracking_payment?: TrackingPayment;
    tracking_transaction?: TrackingTransaction;
    tracking_partner_fee?: TrackingPartnerFee;
    tracking_liquidity?: TrackingLiquidity;
    receiver_id: string;
};

export type CreateEvmPayoutInput = {
    instanceId: string;

    quote_id: string;
    sender_wallet_address: string;
};

export type CreateEvmPayoutResponse = {
    id: string;
    status: TransactionStatus;
    sender_wallet_address: string;
    tracking_complete?: TrackingComplete;
    tracking_payment?: TrackingPayment;
    tracking_transaction?: TrackingTransaction;
    tracking_partner_fee?: TrackingPartnerFee;
    tracking_liquidity?: TrackingLiquidity;
    receiver_id: string;
};

export function createPayoutsResource(client: InternalApiClient) {
    return {
        list({
            instanceId,
            params,
        }: ListPayoutsInput): Promise<BlindpayApiResponse<ListPayoutsResponse>> {
            const queryParams = params ? `?${new URLSearchParams(params)}` : "";
            return client.get(`/instances/${instanceId}/payouts${queryParams}`);
        },
        export({
            instanceId,
            params,
        }: ExportPayoutsInput): Promise<BlindpayApiResponse<ExportPayoutsResponse>> {
            const queryParams = params ? `?${new URLSearchParams(params)}` : "";
            return client.get(`/instances/${instanceId}/export/payouts${queryParams}`);
        },
        get({ instanceId, id }: GetPayoutInput): Promise<BlindpayApiResponse<GetPayoutResponse>> {
            return client.get(`/instances/${instanceId}/payouts/${id}`);
        },
        getTrack({
            id,
        }: GetPayoutTrackInput): Promise<BlindpayApiResponse<GetPayoutTrackResponse>> {
            return client.get(`/e/payouts/${id}`);
        },
        authorizeStellarToken({
            instanceId,
            ...data
        }: AuthorizeStellarTokenInput): Promise<
            BlindpayApiResponse<AuthorizeStellarTokenResponse>
        > {
            return client.post(`/instances/${instanceId}/payouts/stellar/authorize`, data);
        },
        createStellar({
            instanceId,
            ...data
        }: CreateStellarPayoutInput): Promise<BlindpayApiResponse<CreateStellarPayoutResponse>> {
            return client.post(`/instances/${instanceId}/payouts/stellar`, data);
        },
        createEvm({
            instanceId,
            ...data
        }: CreateEvmPayoutInput): Promise<BlindpayApiResponse<CreateEvmPayoutResponse>> {
            return client.post(`/instances/${instanceId}/payouts/evm`, data);
        },
    };
}

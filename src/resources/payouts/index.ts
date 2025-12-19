import type {
    AccountClass,
    BankAccountType,
    BlindpayApiResponse,
    Country,
    Currency,
    Network,
    PaginationMetadata,
    PaginationParams,
    PayoutTrackingComplete,
    PayoutTrackingLiquidity,
    PayoutTrackingPartnerFee,
    PayoutTrackingPayment,
    PayoutTrackingTransaction,
    Rail,
    StablecoinToken,
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
    tracking_transaction: PayoutTrackingTransaction;
    tracking_payment: PayoutTrackingPayment;
    tracking_liquidity: PayoutTrackingLiquidity;
    tracking_complete: PayoutTrackingComplete;
    tracking_partner_fee: PayoutTrackingPartnerFee;
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

export type ListPayoutsInput = PaginationParams & {
    receiver_id?: string;
};

export type ListPayoutsResponse = {
    data: Payout[];
    pagination: PaginationMetadata;
};

export type CreatePayoutInput = {
    receiver_id: string;
    bank_account_id: string;
    amount: number;
    currency: string;
    description?: string | null;
    reference?: string | null;
    network?: Network | null;
    token?: StablecoinToken | null;
};

export type GetPayoutInput = string;

export type GetPayoutResponse = Payout;

export type GetPayoutTrackInput = string;

export type GetPayoutTrackResponse = Payout;

export type ExportPayoutsInput = Pick<PaginationParams, "limit" | "offset">;

export type ExportPayoutsResponse = Payout[];

export type AuthorizeStellarTokenInput = {
    quote_id: string;
    sender_wallet_address: string;
};

export type AuthorizeStellarTokenResponse = {
    transaction_hash: string;
};

export type CreateStellarPayoutInput = {
    quote_id: string;
    sender_wallet_address: string;
    signed_transaction?: string;
};

export type CreateStellarPayoutResponse = {
    id: string;
    status: TransactionStatus;
    sender_wallet_address: string;
    tracking_complete?: PayoutTrackingComplete;
    tracking_payment?: PayoutTrackingPayment;
    tracking_transaction?: PayoutTrackingTransaction;
    tracking_partner_fee?: PayoutTrackingPartnerFee;
    tracking_liquidity?: PayoutTrackingLiquidity;
    receiver_id: string;
};

export type CreateEvmPayoutInput = {
    quote_id: string;
    sender_wallet_address: string;
};

export type CreateEvmPayoutResponse = {
    id: string;
    status: TransactionStatus;
    sender_wallet_address: string;
    tracking_complete?: PayoutTrackingComplete;
    tracking_payment?: PayoutTrackingPayment;
    tracking_transaction?: PayoutTrackingTransaction;
    tracking_partner_fee?: PayoutTrackingPartnerFee;
    tracking_liquidity?: PayoutTrackingLiquidity;
    receiver_id: string;
};

export type AuthorizeSolanaInput = {
    quote_id: string;
    sender_wallet_address: string;
};

export type AuthorizeSolanaResponse = {
    serialized_transaction: string;
};

export type CreateSolanaPayoutInput = {
    quote_id: string;
    sender_wallet_address: string;
    signed_transaction: string | null;
};

export type CreateSolanaPayoutResponse = {
    id: string;
    status: TransactionStatus;
    sender_wallet_address: string;
    tracking_complete: PayoutTrackingComplete;
    tracking_payment: PayoutTrackingPayment;
    tracking_transaction: PayoutTrackingTransaction;
    tracking_partner_fee?: PayoutTrackingPartnerFee | null;
    tracking_liquidity?: PayoutTrackingLiquidity | null;
    receiver_id: string | null;
};

export function createPayoutsResource(instanceId: string, client: InternalApiClient) {
    return {
        list(params?: ListPayoutsInput): Promise<BlindpayApiResponse<ListPayoutsResponse>> {
            const queryParams = params ? `?${new URLSearchParams(params)}` : "";
            return client.get(`/instances/${instanceId}/payouts${queryParams}`);
        },
        export(params?: ExportPayoutsInput): Promise<BlindpayApiResponse<ExportPayoutsResponse>> {
            const queryParams = params ? `?${new URLSearchParams(params)}` : "";
            return client.get(`/instances/${instanceId}/export/payouts${queryParams}`);
        },
        get(payoutId: GetPayoutInput): Promise<BlindpayApiResponse<GetPayoutResponse>> {
            return client.get(`/instances/${instanceId}/payouts/${payoutId}`);
        },
        getTrack(
            payoutId: GetPayoutTrackInput
        ): Promise<BlindpayApiResponse<GetPayoutTrackResponse>> {
            return client.get(`/e/payouts/${payoutId}`);
        },
        authorizeStellarToken({
            ...data
        }: AuthorizeStellarTokenInput): Promise<
            BlindpayApiResponse<AuthorizeStellarTokenResponse>
        > {
            return client.post(`/instances/${instanceId}/payouts/stellar/authorize`, data);
        },
        createStellar({
            ...data
        }: CreateStellarPayoutInput): Promise<BlindpayApiResponse<CreateStellarPayoutResponse>> {
            return client.post(`/instances/${instanceId}/payouts/stellar`, data);
        },
        createEvm({
            ...data
        }: CreateEvmPayoutInput): Promise<BlindpayApiResponse<CreateEvmPayoutResponse>> {
            return client.post(`/instances/${instanceId}/payouts/evm`, data);
        },
        authorizeSolana({
            ...data
        }: AuthorizeSolanaInput): Promise<BlindpayApiResponse<AuthorizeSolanaResponse>> {
            return client.post(`/instances/${instanceId}/payouts/solana/authorize`, data);
        },
        createSolana({
            ...data
        }: CreateSolanaPayoutInput): Promise<BlindpayApiResponse<CreateSolanaPayoutResponse>> {
            return client.post(`/instances/${instanceId}/payouts/solana`, data);
        },
    };
}

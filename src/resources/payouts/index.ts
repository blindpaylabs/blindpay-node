import type {
    AccountClass,
    AchCopDocument,
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
    customer_id: string;
    id: string;
    status: TransactionStatus;
    sender_wallet_address: string;
    signed_transaction: string | null;
    quote_id: string;
    instance_id: string;
    tracking_transaction: PayoutTrackingTransaction;
    tracking_payment: PayoutTrackingPayment;
    tracking_liquidity: PayoutTrackingLiquidity | null;
    tracking_complete: PayoutTrackingComplete;
    tracking_partner_fee: PayoutTrackingPartnerFee;
    created_at: string | null;
    updated_at: string | null;
    image_url: string | null;
    first_name: string | null;
    last_name: string | null;
    legal_name: string | null;
    network: Network;
    token: StablecoinToken;
    description: string | null;
    sender_amount: number | null;
    receiver_amount: number | null;
    partner_fee_id?: string | null;
    partner_fee_amount: number | null;
    commercial_quotation: number | null;
    blindpay_quotation: number | null;
    total_fee_amount: number | null;
    customer_local_amount: number | null;
    currency: Exclude<Currency, "USDB" | "USDC" | "USDT">;
    transaction_document_file: string | null;
    transaction_document_type: TransactionDocumentType | null;
    transaction_document_id: string | null;
    name: string | null;
    type: Rail | null;
    pix_key?: string | null;
    account_number?: string | null;
    routing_number?: string | null;
    country?: Country | null;
    account_class?: AccountClass | null;
    address_line_1?: string | null;
    address_line_2?: string | null;
    city?: string | null;
    state_province_region?: string | null;
    postal_code?: string | null;
    account_type?: BankAccountType | null;
    ach_cop_beneficiary_first_name?: string | null;
    ach_cop_bank_account?: string | null;
    ach_cop_bank_code?: string | null;
    ach_cop_beneficiary_last_name?: string | null;
    ach_cop_document_id?: string | null;
    ach_cop_document_type?: AchCopDocument | null;
    ach_cop_email?: string | null;
    beneficiary_name?: string | null;
    spei_clabe?: string | null;
    spei_protocol?: SpeiProtocol | null;
    spei_institution_code?: string | null;
    swift_beneficiary_country?: Country | null;
    swift_code_bic?: string | null;
    swift_account_holder_name?: string | null;
    swift_account_number_iban?: string | null;
    transfers_account?: string | null;
    transfers_type: "CVU" | "CBU" | "ALIAS" | null;
    has_virtual_account: boolean | null;
    billing_fee_amount?: number | null;
    cpn_payment_id?: string | null;
    jpm_track_data?: Record<string, unknown> | string | null;
    ted_bank_code?: string | null;
    ted_branch_code?: string | null;
    ted_cpf_cnpj?: string | null;
    bank_account_id?: string | null;
    faster_payments_account_number?: string | null;
    faster_payments_beneficiary_address_line_1?: string | null;
    faster_payments_beneficiary_city?: string | null;
    faster_payments_beneficiary_country?: Country | null;
    faster_payments_beneficiary_legal_name?: string | null;
    faster_payments_beneficiary_postal_code?: string | null;
    faster_payments_sort_code?: string | null;
    payable_id?: string | null;
    sepa_beneficiary_address_line_1?: string | null;
    sepa_beneficiary_city?: string | null;
    sepa_beneficiary_country?: Country | null;
    sepa_beneficiary_legal_name?: string | null;
    sepa_beneficiary_postal_code?: string | null;
    sepa_iban?: string | null;
};

export type ListPayoutsInput = PaginationParams & {
    customer_id?: string;
};

export type ListPayoutsResponse =
    | {
          data: Payout[];
          pagination: PaginationMetadata;
      }
    | Payout[];

export type CreatePayoutInput = {
    customer_id: string;
    bank_account_id: string;
    amount: number;
    currency: Currency;
    description?: string | null;
    reference?: string | null;
    network?: Network | null;
    token?: StablecoinToken | null;
};

export type SubmitPayoutDocumentsInput = {
    payout_id: string;
    transaction_document_type: TransactionDocumentType;
    transaction_document_id: string;
    transaction_document_file: string;
    description?: string;
};

export type SubmitPayoutDocumentsResponse = {
    id: string;
};

export type GetPayoutInput = string;

export type GetPayoutResponse = Payout;

export type GetPayoutTrackInput = string;

export type GetPayoutTrackResponse = Payout;

export type AuthorizeStellarTokenInput = {
    quote_id: string;
    sender_wallet_address: string;
    wallet_id?: string;
};

export type AuthorizeStellarTokenResponse = {
    transaction_hash: string;
};

export type CreateStellarPayoutInput = {
    quote_id: string;
    sender_wallet_address: string;
    signed_transaction?: string | null;
    wallet_id?: string;
};

export type CreateStellarPayoutResponse = {
    id: string;
    status: TransactionStatus;
    sender_wallet_address: string;
    tracking_complete?: PayoutTrackingComplete;
    tracking_payment?: PayoutTrackingPayment;
    tracking_transaction?: PayoutTrackingTransaction;
    tracking_partner_fee?: PayoutTrackingPartnerFee;
    tracking_liquidity?: PayoutTrackingLiquidity | null;
    customer_id: string | null;
    payable_id?: string | null;
};

export type CreateEvmPayoutInput = {
    quote_id: string;
    sender_wallet_address: string;
    wallet_id?: string;
};

export type CreateEvmPayoutResponse = {
    id: string;
    status: TransactionStatus;
    sender_wallet_address: string;
    tracking_complete?: PayoutTrackingComplete;
    tracking_payment?: PayoutTrackingPayment;
    tracking_transaction?: PayoutTrackingTransaction;
    tracking_partner_fee?: PayoutTrackingPartnerFee;
    tracking_liquidity?: PayoutTrackingLiquidity | null;
    customer_id: string | null;
    payable_id?: string | null;
};

export type CreateSolanaPayoutInput = {
    quote_id: string;
    sender_wallet_address: string;
    signed_transaction: string | null;
    wallet_id?: string;
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
    customer_id: string | null;
    payable_id?: string | null;
};

export function createPayoutsResource(instanceId: string, client: InternalApiClient) {
    return {
        list(params?: ListPayoutsInput): Promise<BlindpayApiResponse<ListPayoutsResponse>> {
            const queryParams = params ? `?${new URLSearchParams(params)}` : "";
            return client.get(`/instances/${instanceId}/payouts${queryParams}`);
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
        createSolana({
            ...data
        }: CreateSolanaPayoutInput): Promise<BlindpayApiResponse<CreateSolanaPayoutResponse>> {
            return client.post(`/instances/${instanceId}/payouts/solana`, data);
        },
        submitDocuments({
            payout_id,
            ...data
        }: SubmitPayoutDocumentsInput): Promise<
            BlindpayApiResponse<SubmitPayoutDocumentsResponse>
        > {
            return client.post(`/instances/${instanceId}/payouts/${payout_id}/documents`, data);
        },
    };
}

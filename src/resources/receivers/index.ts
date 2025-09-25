import type { AccountClass, BlindpayApiResponse, Country } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type ProofOfAddressDocType =
    | "UTILITY_BILL"
    | "BANK_STATEMENT"
    | "RENTAL_AGREEMENT"
    | "TAX_DOCUMENT"
    | "GOVERNMENT_CORRESPONDENCE";
export type PurposeOfTransactions =
    | "business_transactions"
    | "charitable_donations"
    | "investment_purposes"
    | "payments_to_friends_or_family_abroad"
    | "personal_or_living_expenses";
export type SourceOfFundsDocType =
    | "business_income"
    | "gambling_proceeds"
    | "gifts"
    | "government_benefits"
    | "inheritance";

export type IdentificationDocument = "PASSPORT" | "ID_CARD" | "DRIVERS";

export type KycType = "light" | "standard" | "enhanced";

export type OwnerRole = "beneficial_controlling" | "beneficial_owner" | "controlling_person";

export type Owner = {
    address_line_1: string;
    address_line_2: string;
    city: string;
    country: Country;
    date_of_birth: string;
    first_name: string;
    id_doc_country: Country;
    id_doc_front_file: string;
    id_doc_type: IdentificationDocument;
    last_name: string;
    postal_code: string;
    role: OwnerRole;
    state_province_region: string;
    tax_id: string;
    id_doc_back_file: string;
    proof_of_address_doc_file: string;
    proof_of_address_doc_type: ProofOfAddressDocType;
};

export type Receiver = {
    id: string;
    type: AccountClass;
    kyc_type: KycType;
    kyc_status: string;
    kyc_warnings: Array<{
        code: string | null;
        message: string | null;
        resolution_status: string | null;
        warning_id: string | null;
    }>;
    email: string;
    tax_id: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state_province_region: string;
    country: Country;
    postal_code: string;
    ip_address: string;
    image_url: string;
    phone_number: string;
    proof_of_address_doc_type: ProofOfAddressDocType;
    proof_of_address_doc_file: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    id_doc_country: Country;
    id_doc_type: IdentificationDocument;
    id_doc_front_file: string;
    id_doc_back_file: string;
    legal_name: string;
    alternate_name: string;
    formation_date: string;
    website: string;
    owners: Array<
        { id: string } & Pick<
            Owner,
            | "first_name"
            | "last_name"
            | "address_line_1"
            | "address_line_2"
            | "city"
            | "state_province_region"
            | "country"
            | "postal_code"
            | "id_doc_country"
            | "id_doc_type"
            | "id_doc_front_file"
            | "id_doc_back_file"
        >
    >;
    incorporation_doc_file: string;
    proof_of_ownership_doc_file: string;
    source_of_funds_doc_type: SourceOfFundsDocType;
    source_of_funds_doc_file: string;
    individual_holding_doc_front_file: string;
    purpose_of_transactions: PurposeOfTransactions;
    purpose_of_transactions_explanation: string;
    external_id: string;
    instance_id: string;
    tos_id: string;
    aiprise_validation_key: string;
    created_at: string;
    updated_at: string;
    limit: {
        per_transaction: number;
        daily: number;
        monthly: number;
    };
};

export type ListReceiversInput = {
    instanceId: string;
};

export type ListReceiversResponse = Receiver[];

export type CreateReceiverInput = {
    instanceId: string;

    country: Country;
    kyc_type: KycType;
    type: AccountClass;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    image_url: string;
    ip_address: string;
    postal_code: string;
    state_province_region: string;
    tax_id: string;
    alternate_name?: string;
    date_of_birth: string;
    external_id: string;
    first_name: string;
    formation_date: string;
    id_doc_back_file: string;
    id_doc_front_file: string;
    id_doc_type: IdentificationDocument;
    id_doc_country: Country;
    email: string;
    incorporation_doc_file: string;
    individual_holding_doc_front_file: string;
    last_name: string;
    legal_name: string;
    owners: Owner[];
    phone_number: string;
    proof_of_address_doc_file: string;
    proof_of_address_doc_type: ProofOfAddressDocType;
    proof_of_ownership_doc_file: string;
    purpose_of_transactions: PurposeOfTransactions;
    purpose_of_transactions_explanation: string;
    source_of_funds_doc_file: string;
    source_of_funds_doc_type: SourceOfFundsDocType;
    tos_id: string;
    website: string;
};

export type CreateReceiverResponse = {
    id: string;
};

export type GetReceiverInput = {
    instanceId: string;
    id: string;
};

export type GetReceiverResponse = Receiver;

export type UpdateReceiverInput = {
    instanceId: string;
    id: string;

    email?: string;
    tax_id?: string;
    address_line_1?: string;
    address_line_2?: string;
    city?: string;
    state_province_region?: string;
    country?: Country;
    postal_code?: string;
    ip_address?: string;
    image_url?: string;
    phone_number?: string;
    proof_of_address_doc_type?: ProofOfAddressDocType;
    proof_of_address_doc_file?: string;
    first_name?: string;
    last_name?: string;
    date_of_birth?: string;
    id_doc_country?: Country;
    id_doc_type?: IdentificationDocument;
    id_doc_front_file?: string;
    id_doc_back_file?: string;
    legal_name?: string;
    alternate_name?: string;
    formation_date?: string;
    website?: string;
    owners?: Array<
        { id: string } & Pick<
            Owner,
            | "first_name"
            | "last_name"
            | "role"
            | "date_of_birth"
            | "tax_id"
            | "address_line_1"
            | "address_line_2"
            | "city"
            | "state_province_region"
            | "country"
            | "postal_code"
            | "id_doc_country"
            | "id_doc_type"
            | "id_doc_front_file"
            | "id_doc_back_file"
        >
    >;
    incorporation_doc_file?: string;
    proof_of_ownership_doc_file?: string;
    source_of_funds_doc_type?: SourceOfFundsDocType;
    source_of_funds_doc_file?: string;
    individual_holding_doc_front_file?: string;
    purpose_of_transactions?: PurposeOfTransactions;
    purpose_of_transactions_explanation?: string;
    external_id?: string;
    tos_id?: string;
};

export type DeleteReceiverInput = {
    instanceId: string;
    id: string;
};

export type GetReceiverLimitsInput = {
    instanceId: string;
    id: string;
};

export type GetReceiverLimitsResponse = {
    limits: {
        payin: {
            daily: number;
            monthly: number;
        };
        payout: {
            daily: number;
            monthly: number;
        };
    };
};

export function createReceiversResource(client: InternalApiClient) {
    return {
        list({
            instanceId,
        }: ListReceiversInput): Promise<BlindpayApiResponse<ListReceiversResponse>> {
            return client.get(`/instances/${instanceId}/receivers`);
        },
        create({
            instanceId,
            ...data
        }: CreateReceiverInput): Promise<BlindpayApiResponse<CreateReceiverResponse>> {
            return client.post(`/instances/${instanceId}/receivers`, data);
        },
        get({
            instanceId,
            id,
        }: GetReceiverInput): Promise<BlindpayApiResponse<GetReceiverResponse>> {
            return client.get(`/instances/${instanceId}/receivers/${id}`);
        },
        update({
            instanceId,
            id,
            ...data
        }: UpdateReceiverInput): Promise<BlindpayApiResponse<void>> {
            return client.patch(`/instances/${instanceId}/receivers/${id}`, data);
        },
        delete({ instanceId, id }: DeleteReceiverInput): Promise<BlindpayApiResponse<void>> {
            return client.delete(`/instances/${instanceId}/receivers/${id}`);
        },
        getLimits({
            instanceId,
            id,
        }: GetReceiverLimitsInput): Promise<BlindpayApiResponse<GetReceiverLimitsResponse>> {
            return client.get(`/instances/${instanceId}/limits/receivers/${id}`);
        },
    };
}

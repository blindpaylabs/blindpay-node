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
    | "personal_or_living_expenses"
    | "protect_wealth"
    | "purchase_good_and_services"
    | "receive_payment_for_freelancing"
    | "receive_salary"
    | "other";

export type SourceOfFundsDocType =
    | "business_income"
    | "gambling_proceeds"
    | "gifts"
    | "government_benefits"
    | "inheritance"
    | "investment_loans"
    | "pension_retirement"
    | "salary"
    | "sale_of_assets_real_estate"
    | "savings"
    | "esops"
    | "investment_proceeds"
    | "someone_else_funds";

export type IdentificationDocument = "PASSPORT" | "ID_CARD" | "DRIVERS";

export type KycType = "light" | "standard" | "enhanced";

export type OwnerRole = "beneficial_controlling" | "beneficial_owner" | "controlling_person";

export type Owner = {
    id: string;
    instance_id: string;
    receiver_id: string;
    role: OwnerRole;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    tax_id: string;
    address_line_1: string;
    address_line_2: string | null;
    city: string;
    state_province_region: string;
    country: Country;
    postal_code: string;
    id_doc_country: Country;
    id_doc_type: IdentificationDocument;
    id_doc_front_file: string;
    id_doc_back_file: string | null;
    proof_of_address_doc_type: ProofOfAddressDocType;
    proof_of_address_doc_file: string;
};

export type IndividualWithStandardKYC = {
    id: string;
    type: Extract<AccountClass, "individual">;
    kyc_type: Extract<KycType, "standard">;
    kyc_status: string;
    kyc_warnings: Array<{
        code: string | null;
        message: string | null;
        resolution_status: string | null;
        warning_id: string | null;
    }> | null;
    email: string;
    tax_id: string;
    address_line_1: string;
    address_line_2?: string | null;
    city: string;
    state_province_region: string;
    country: Country;
    postal_code: string;
    ip_address: string | null;
    image_url: string | null;
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
    aiprise_validation_key: string;
    instance_id: string;
    tos_id: string | null;
    created_at: string;
    updated_at: string;
    limit: {
        per_transaction: number;
        daily: number;
        monthly: number;
    };
};

export type IndividualWithEnhancedKYC = {
    id: string;
    type: Extract<AccountClass, "individual">;
    kyc_type: Extract<KycType, "enhanced">;
    kyc_status: string;
    kyc_warnings: Array<{
        code: string | null;
        message: string | null;
        resolution_status: string | null;
        warning_id: string | null;
    }> | null;
    email: string;
    tax_id: string;
    address_line_1: string;
    address_line_2?: string | null;
    city: string;
    state_province_region: string;
    country: Country;
    postal_code: string;
    ip_address: string | null;
    image_url: string | null;
    phone_number: string | null;
    proof_of_address_doc_type: ProofOfAddressDocType;
    proof_of_address_doc_file: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    id_doc_country: Country;
    id_doc_type: IdentificationDocument;
    id_doc_front_file: string;
    id_doc_back_file: string | null;
    aiprise_validation_key: string;
    instance_id: string;
    source_of_funds_doc_type: string;
    source_of_funds_doc_file: string;
    individual_holding_doc_front_file: string;
    purpose_of_transactions: PurposeOfTransactions;
    purpose_of_transactions_explanation: string | null;
    tos_id: string | null;
    created_at: string;
    updated_at: string;
    limit: {
        per_transaction: number;
        daily: number;
        monthly: number;
    };
};

export type BusinessWithStandardKYB = {
    id: string;
    type: Extract<AccountClass, "business">;
    kyc_type: Extract<KycType, "standard">;
    kyc_status: string;
    kyc_warnings: Array<{
        code: string | null;
        message: string | null;
        resolution_status: string | null;
        warning_id: string | null;
    }> | null;
    email: string;
    tax_id: string;
    address_line_1: string;
    address_line_2?: string | null;
    city: string;
    state_province_region: string;
    country: Country;
    postal_code: string;
    ip_address: string | null;
    image_url: string | null;
    phone_number: string | null;
    proof_of_address_doc_type: ProofOfAddressDocType;
    proof_of_address_doc_file: string;
    legal_name: string;
    alternate_name: string | null;
    formation_date: string;
    website: string | null;
    owners: Owner[];
    incorporation_doc_file: string;
    proof_of_ownership_doc_file: string;
    external_id: string | null;
    instance_id: string;
    tos_id: string | null;
    aiprise_validation_key: string;
    created_at: string;
    updated_at: string;
    limit: {
        per_transaction: number;
        daily: number;
        monthly: number;
    };
};

export type CreateIndividualWithStandardKYCInput = {
    external_id?: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    country: Country;
    date_of_birth: string;
    email: string;
    first_name: string;
    phone_number: string | null;
    id_doc_country: Country;
    id_doc_front_file: string;
    id_doc_type: IdentificationDocument;
    id_doc_back_file: string | null;
    last_name: string;
    postal_code: string;
    proof_of_address_doc_file: string;
    proof_of_address_doc_type: ProofOfAddressDocType;
    state_province_region: string;
    tax_id: string;
    tos_id: string;
};

export type CreateIndividualWithStandardKYCResponse = {
    id: string;
};

export type CreateIndividualWithEnhancedKYCInput = {
    external_id?: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    country: Country;
    date_of_birth: string;
    email: string;
    first_name: string;
    id_doc_country: Country;
    id_doc_front_file: string;
    id_doc_type: IdentificationDocument;
    id_doc_back_file: string | null;
    individual_holding_doc_front_file: string;
    last_name: string;
    postal_code: string;
    phone_number: string | null;
    proof_of_address_doc_file: string;
    proof_of_address_doc_type: ProofOfAddressDocType;
    purpose_of_transactions: PurposeOfTransactions;
    source_of_funds_doc_file: string;
    source_of_funds_doc_type: SourceOfFundsDocType;
    purpose_of_transactions_explanation: string | null;
    state_province_region: string;
    tax_id: string;
    tos_id: string;
};

export type CreateIndividualWithEnhancedKYCResponse = {
    id: string;
};

export type CreateBusinessWithStandardKYBInput = {
    external_id?: string;
    address_line_1: string;
    address_line_2?: string;
    alternate_name: string;
    city: string;
    country: Country;
    email: string;
    formation_date: string;
    incorporation_doc_file: string;
    legal_name: string;
    owners: Owner[];
    postal_code: string;
    proof_of_address_doc_file: string;
    proof_of_address_doc_type: ProofOfAddressDocType;
    proof_of_ownership_doc_file: string;
    state_province_region: string;
    tax_id: string;
    tos_id: string;
    website: string | null;
};

export type CreateBusinessWithStandardKYBResponse = {
    id: string;
};

export type ListReceiversResponse = Array<
    IndividualWithStandardKYC | IndividualWithEnhancedKYC | BusinessWithStandardKYB
>;

export type GetReceiverInput = string;

export type GetReceiverResponse =
    | IndividualWithStandardKYC
    | IndividualWithEnhancedKYC
    | BusinessWithStandardKYB;

export type UpdateReceiverInput = {
    receiver_id: string;
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

export type DeleteReceiverInput = string;

export type GetReceiverLimitsInput = string;

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

export type GetLimitIncreaseRequestsInput = string;

export type LimitIncreaseRequestStatus = "in_review" | "approved" | "rejected";

export type LimitIncreaseRequestSupportingDocumentType =
    | "individual_bank_statement"
    | "individual_tax_return"
    | "individual_proof_of_income"
    | "business_bank_statement"
    | "business_financial_statements"
    | "business_tax_return";

export type GetLimitIncreaseRequestsResponse = Array<{
    id: string;
    receiver_id: string;
    status: LimitIncreaseRequestStatus;
    daily: number;
    monthly: number;
    per_transaction: number;
    supporting_document_file: string;
    supporting_document_type: LimitIncreaseRequestSupportingDocumentType;
    created_at: string;
    updated_at: string;
}>;

export type RequestLimitIncreaseInput = {
    receiver_id: string;
    daily: number;
    monthly: number;
    per_transaction: number;
    supporting_document_file: string;
    supporting_document_type: LimitIncreaseRequestSupportingDocumentType;
};

export type RequestLimitIncreaseResponse = {
    id: string;
};

export function createReceiversResource(instanceId: string, client: InternalApiClient) {
    return {
        list(): Promise<BlindpayApiResponse<ListReceiversResponse>> {
            return client.get(`/instances/${instanceId}/receivers`);
        },
        createIndividualWithStandardKYC(
            data: CreateIndividualWithStandardKYCInput
        ): Promise<BlindpayApiResponse<CreateIndividualWithStandardKYCResponse>> {
            return client.post(`/instances/${instanceId}/receivers`, {
                kyc_type: "standard",
                type: "individual",
                ...data,
            });
        },
        createIndividualWithEnhancedKYC(
            data: CreateIndividualWithEnhancedKYCInput
        ): Promise<BlindpayApiResponse<CreateIndividualWithEnhancedKYCResponse>> {
            return client.post(`/instances/${instanceId}/receivers`, {
                kyc_type: "enhanced",
                type: "individual",
                ...data,
            });
        },
        createBusinessWithStandardKYB(
            data: CreateBusinessWithStandardKYBInput
        ): Promise<BlindpayApiResponse<CreateBusinessWithStandardKYBResponse>> {
            return client.post(`/instances/${instanceId}/receivers`, {
                kyc_type: "standard",
                type: "business",
                ...data,
            });
        },
        get(receiver_id: GetReceiverInput): Promise<BlindpayApiResponse<GetReceiverResponse>> {
            return client.get(`/instances/${instanceId}/receivers/${receiver_id}`);
        },
        update({ receiver_id, ...data }: UpdateReceiverInput): Promise<BlindpayApiResponse<void>> {
            return client.patch(`/instances/${instanceId}/receivers/${receiver_id}`, data);
        },
        delete(receiver_id: DeleteReceiverInput): Promise<BlindpayApiResponse<void>> {
            return client.delete(`/instances/${instanceId}/receivers/${receiver_id}`);
        },
        getLimits(
            receiver_id: GetReceiverLimitsInput
        ): Promise<BlindpayApiResponse<GetReceiverLimitsResponse>> {
            return client.get(`/instances/${instanceId}/limits/receivers/${receiver_id}`);
        },
        getLimitIncreaseRequests(
            receiver_id: GetLimitIncreaseRequestsInput
        ): Promise<BlindpayApiResponse<GetLimitIncreaseRequestsResponse>> {
            return client.get(`/instances/${instanceId}/receivers/${receiver_id}/limit-increase`);
        },
        requestLimitIncrease({
            receiver_id,
            ...data
        }: RequestLimitIncreaseInput): Promise<BlindpayApiResponse<RequestLimitIncreaseResponse>> {
            return client.post(
                `/instances/${instanceId}/receivers/${receiver_id}/limit-increase`,
                data
            );
        },
    };
}

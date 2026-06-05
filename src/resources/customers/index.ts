import type {
    AccountClass,
    AccountPurpose,
    BlindpayApiResponse,
    BusinessIndustry,
    BusinessType,
    Country,
    EstimatedAnnualRevenue,
    KycStatus,
    PaginationMetadata,
    PaginationParams,
    PurposeOfTransactions,
    RecipientRelationship,
    SoleProprietorDocType,
    SourceOfFundsDocType,
    SourceOfWealth,
} from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";
import type { StrictOmit } from "../../internal/helpers/strict-omit";

export type ProofOfAddressDocType =
    | "UTILITY_BILL"
    | "BANK_STATEMENT"
    | "RENTAL_AGREEMENT"
    | "TAX_DOCUMENT"
    | "GOVERNMENT_CORRESPONDENCE";

export type IdentificationDocument = "PASSPORT" | "ID_CARD" | "DRIVERS";

export type AmlStatus = "clear" | "hit" | "error";

export type AmlHits = {
    has_sanction_match: boolean;
    has_pep_match: boolean;
    has_watchlist_match: boolean;
    has_crimelist_match: boolean;
    has_adversemedia_match: boolean;
};

export type FraudWarning = {
    id: string | null;
    name: string | null;
    operation: string | null;
    score: number | null;
};

export type OwnerTaxType = "SSN" | "ITIN";

export type KycType = "light" | "standard" | "enhanced";

export type OwnerRole = "beneficial_controlling" | "beneficial_owner" | "controlling_person";

export type Owner = {
    id: string;
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
    proof_of_address_doc_file: string | null;
    ownership_percentage: number | null;
    title: string | null;
    tax_type?: OwnerTaxType | null;
    instance_id?: string;
    customer_id?: string;
};

export type IndividualWithStandardKYC = {
    id: string;
    is_tos_accepted: boolean;
    type: Extract<AccountClass, "individual">;
    kyc_type: Extract<KycType, "standard">;
    kyc_status: KycStatus;
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
    fraud_warnings?: FraudWarning[] | null;
    aml_status?: AmlStatus | null;
    aml_hits?: AmlHits | null;
    account_purpose?: AccountPurpose | null;
    account_purpose_other?: string | null;
    occupation?: string | null;
    external_id?: string | null;
    is_fbo?: boolean | null;
    selfie_file?: string | null;
    source_of_funds_doc_type?: SourceOfFundsDocType | null;
    source_of_funds_doc_file?: string | null;
    business_description?: string | null;
    business_industry?: BusinessIndustry | null;
    estimated_annual_revenue?: EstimatedAnnualRevenue | null;
    source_of_wealth?: SourceOfWealth | null;
    recipient_relationship?: RecipientRelationship | null;
    sole_proprietor_doc_type?: SoleProprietorDocType | null;
    publicly_traded?: boolean | null;
};

export type IndividualWithEnhancedKYC = {
    id: string;
    is_tos_accepted: boolean;
    type: Extract<AccountClass, "individual">;
    kyc_type: Extract<KycType, "enhanced">;
    kyc_status: KycStatus;
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
    fraud_warnings?: FraudWarning[] | null;
    aml_status?: AmlStatus | null;
    aml_hits?: AmlHits | null;
    account_purpose?: AccountPurpose | null;
    account_purpose_other?: string | null;
    occupation?: string | null;
    external_id?: string | null;
    is_fbo?: boolean | null;
    selfie_file?: string | null;
    business_description?: string | null;
    business_industry?: BusinessIndustry | null;
    estimated_annual_revenue?: EstimatedAnnualRevenue | null;
    source_of_wealth?: SourceOfWealth | null;
    recipient_relationship?: RecipientRelationship | null;
    sole_proprietor_doc_type?: SoleProprietorDocType | null;
    publicly_traded?: boolean | null;
};

export type BusinessWithStandardKYB = {
    id: string;
    is_tos_accepted: boolean;
    is_fbo: boolean;
    type: Extract<AccountClass, "business">;
    kyc_type: Extract<KycType, "standard">;
    kyc_status: KycStatus;
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
    fraud_warnings?: FraudWarning[] | null;
    aml_status?: AmlStatus | null;
    aml_hits?: AmlHits | null;
    account_purpose?: AccountPurpose | null;
    account_purpose_other?: string | null;
    occupation?: string | null;
    selfie_file?: string | null;
    source_of_funds_doc_type?: SourceOfFundsDocType | null;
    source_of_funds_doc_file?: string | null;
    business_description?: string | null;
    business_industry?: BusinessIndustry | null;
    estimated_annual_revenue?: EstimatedAnnualRevenue | null;
    source_of_wealth?: SourceOfWealth | null;
    recipient_relationship?: RecipientRelationship | null;
    sole_proprietor_doc_type?: SoleProprietorDocType | null;
};

export type CreateIndividualWithStandardKYCInput = {
    country: Country;
    email: string;
    account_purpose?: AccountPurpose | null;
    address_line_1?: string | null;
    address_line_2?: string | null;
    city?: string | null;
    date_of_birth?: string | null;
    external_id?: string | null;
    first_name?: string | null;
    id_doc_back_file?: string | null;
    id_doc_country?: Country | null;
    id_doc_front_file?: string | null;
    id_doc_type?: IdentificationDocument | null;
    image_url?: string | null;
    ip_address?: string | null;
    last_name?: string | null;
    phone_number?: string | null;
    postal_code?: string | null;
    proof_of_address_doc_file?: string | null;
    proof_of_address_doc_type?: ProofOfAddressDocType | null;
    selfie_file?: string | null;
    source_of_funds_doc_file?: string | null;
    source_of_funds_doc_type?: SourceOfFundsDocType | null;
    source_of_wealth?: SourceOfWealth | null;
    state_province_region?: string | null;
    tax_id?: string | null;
    tos_id?: string | null;
    account_purpose_other?: string | null;
    occupation?: string | null;
    recipient_relationship?: RecipientRelationship | null;
    sole_proprietor_doc_type?: SoleProprietorDocType | null;
};

export type CreateIndividualWithStandardKYCResponse = {
    id: string;
};

export type CreateIndividualWithEnhancedKYCInput = {
    country: Country;
    email: string;
    account_purpose?: AccountPurpose | null;
    address_line_1?: string | null;
    address_line_2?: string | null;
    city?: string | null;
    date_of_birth?: string | null;
    external_id?: string | null;
    first_name?: string | null;
    id_doc_back_file?: string | null;
    id_doc_country?: Country | null;
    id_doc_front_file?: string | null;
    id_doc_type?: IdentificationDocument | null;
    image_url?: string | null;
    ip_address?: string | null;
    last_name?: string | null;
    phone_number?: string | null;
    postal_code?: string | null;
    proof_of_address_doc_file?: string | null;
    proof_of_address_doc_type?: ProofOfAddressDocType | null;
    purpose_of_transactions?: PurposeOfTransactions | null;
    purpose_of_transactions_explanation?: string | null;
    selfie_file?: string | null;
    source_of_funds_doc_file?: string | null;
    source_of_funds_doc_type?: SourceOfFundsDocType | null;
    source_of_wealth?: SourceOfWealth | null;
    state_province_region?: string | null;
    tax_id?: string | null;
    tos_id?: string | null;
    account_purpose_other?: string | null;
    occupation?: string | null;
    recipient_relationship?: RecipientRelationship | null;
    sole_proprietor_doc_type?: SoleProprietorDocType | null;
};

export type CreateIndividualWithEnhancedKYCResponse = {
    id: string;
};

export type CreateBusinessWithStandardKYBInput = {
    country: Country;
    email: string;
    account_purpose?: AccountPurpose | null;
    address_line_1?: string | null;
    address_line_2?: string | null;
    alternate_name?: string | null;
    business_description?: string | null;
    business_industry?: BusinessIndustry | null;
    business_type?: BusinessType | null;
    city?: string | null;
    estimated_annual_revenue?: EstimatedAnnualRevenue | null;
    external_id?: string | null;
    formation_date?: string | null;
    image_url?: string | null;
    incorporation_doc_file?: string | null;
    ip_address?: string | null;
    legal_name?: string | null;
    owners?: Array<StrictOmit<Owner, "id">> | null;
    phone_number?: string | null;
    postal_code?: string | null;
    proof_of_address_doc_file?: string | null;
    proof_of_address_doc_type?: ProofOfAddressDocType | null;
    proof_of_ownership_doc_file?: string | null;
    publicly_traded?: boolean | null;
    source_of_funds_doc_file?: string | null;
    source_of_funds_doc_type?: SourceOfFundsDocType | null;
    source_of_wealth?: SourceOfWealth | null;
    state_province_region?: string | null;
    tax_id?: string | null;
    tos_id?: string | null;
    website?: string | null;
    account_purpose_other?: string | null;
    occupation?: string | null;
    recipient_relationship?: RecipientRelationship | null;
    sole_proprietor_doc_type?: SoleProprietorDocType | null;
};

export type CreateBusinessWithStandardKYBResponse = {
    id: string;
};

export type ListCustomersInput = PaginationParams & {
    full_name?: string;
    customer_name?: string;
    status?: string;
    customer_id?: string;
    bank_account_id?: string;
    country?: Country;
};

export type ListCustomersResponse = {
    data: Array<IndividualWithStandardKYC | IndividualWithEnhancedKYC | BusinessWithStandardKYB>;
    pagination: PaginationMetadata;
};

export type GetCustomerInput = string;

export type GetCustomerResponse =
    | IndividualWithStandardKYC
    | IndividualWithEnhancedKYC
    | BusinessWithStandardKYB;

export type UpdateCustomerInput = {
    customer_id: string;
    account_purpose?: AccountPurpose | null;
    address_line_1?: string;
    address_line_2?: string;
    alternate_name?: string;
    business_description?: string;
    business_industry?: BusinessIndustry | null;
    business_type?: BusinessType | null;
    city?: string;
    country?: Country;
    date_of_birth?: string;
    email?: string;
    estimated_annual_revenue?: EstimatedAnnualRevenue | null;
    external_id?: string;
    first_name?: string;
    formation_date?: string;
    id_doc_back_file?: string;
    id_doc_country?: Country;
    id_doc_front_file?: string;
    id_doc_type?: IdentificationDocument;
    image_url?: string;
    incorporation_doc_file?: string;
    ip_address?: string;
    last_name?: string;
    legal_name?: string;
    owners?: Array<StrictOmit<Owner, "id">>;
    phone_number?: string;
    postal_code?: string;
    proof_of_address_doc_file?: string;
    proof_of_address_doc_type?: ProofOfAddressDocType;
    proof_of_ownership_doc_file?: string;
    publicly_traded?: boolean | null;
    purpose_of_transactions?: PurposeOfTransactions;
    purpose_of_transactions_explanation?: string;
    selfie_file?: string;
    source_of_funds_doc_file?: string;
    source_of_funds_doc_type?: SourceOfFundsDocType;
    source_of_wealth?: SourceOfWealth | null;
    state_province_region?: string;
    tax_id?: string;
    tos_id?: string;
    website?: string;
    account_purpose_other?: string | null;
    occupation?: string | null;
    recipient_relationship?: RecipientRelationship | null;
    sole_proprietor_doc_type?: SoleProprietorDocType | null;
};

export type DeleteCustomerInput = string;

export type GetCustomerLimitsInput = string;

export type GetCustomerLimitsResponse = {
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
    customer_id: string;
    status: LimitIncreaseRequestStatus;
    daily: number;
    monthly: number;
    per_transaction: number;
    supporting_document_file: string;
    supporting_document_type: LimitIncreaseRequestSupportingDocumentType;
    created_at: string;
    updated_at: string;
    approved_per_transaction?: number | null;
    approved_daily?: number | null;
    approved_monthly?: number | null;
}>;

export type RequestLimitIncreaseInput = {
    customer_id: string;
    daily: number;
    monthly: number;
    per_transaction: number;
    supporting_document_file: string;
    supporting_document_type: LimitIncreaseRequestSupportingDocumentType;
};

export type RequestLimitIncreaseResponse = {
    id: string;
};

export function createCustomersResource(instanceId: string, client: InternalApiClient) {
    return {
        list(params?: ListCustomersInput): Promise<BlindpayApiResponse<ListCustomersResponse>> {
            // The API's filter schema still uses receiver_id/receiver_name. Translate
            // customer_* inputs to the wire-level names so consumers see a clean
            // customer-only surface. Drop this mapping once the API accepts customer_*.
            const wireParams = params
                ? Object.fromEntries(
                      Object.entries(params).map(([k, v]) => {
                          if (k === "customer_id") return ["receiver_id", v];
                          if (k === "customer_name") return ["receiver_name", v];
                          return [k, v];
                      })
                  )
                : undefined;
            const queryParams = wireParams ? `?${new URLSearchParams(wireParams)}` : "";
            return client.get(`/instances/${instanceId}/customers${queryParams}`);
        },
        createIndividualWithStandardKYC(
            data: CreateIndividualWithStandardKYCInput
        ): Promise<BlindpayApiResponse<CreateIndividualWithStandardKYCResponse>> {
            return client.post(`/instances/${instanceId}/customers`, {
                kyc_type: "standard",
                type: "individual",
                ...data,
            });
        },
        createIndividualWithEnhancedKYC(
            data: CreateIndividualWithEnhancedKYCInput
        ): Promise<BlindpayApiResponse<CreateIndividualWithEnhancedKYCResponse>> {
            return client.post(`/instances/${instanceId}/customers`, {
                kyc_type: "enhanced",
                type: "individual",
                ...data,
            });
        },
        createBusinessWithStandardKYB(
            data: CreateBusinessWithStandardKYBInput
        ): Promise<BlindpayApiResponse<CreateBusinessWithStandardKYBResponse>> {
            return client.post(`/instances/${instanceId}/customers`, {
                kyc_type: "standard",
                type: "business",
                ...data,
            });
        },
        get(customer_id: GetCustomerInput): Promise<BlindpayApiResponse<GetCustomerResponse>> {
            return client.get(`/instances/${instanceId}/customers/${customer_id}`);
        },
        update({ customer_id, ...data }: UpdateCustomerInput): Promise<BlindpayApiResponse<void>> {
            return client.put(`/instances/${instanceId}/customers/${customer_id}`, data);
        },
        delete(customer_id: DeleteCustomerInput): Promise<BlindpayApiResponse<void>> {
            return client.delete(`/instances/${instanceId}/customers/${customer_id}`);
        },
        getLimits(
            customer_id: GetCustomerLimitsInput
        ): Promise<BlindpayApiResponse<GetCustomerLimitsResponse>> {
            return client.get(`/instances/${instanceId}/limits/customers/${customer_id}`);
        },
        getLimitIncreaseRequests(
            customer_id: GetLimitIncreaseRequestsInput
        ): Promise<BlindpayApiResponse<GetLimitIncreaseRequestsResponse>> {
            return client.get(`/instances/${instanceId}/customers/${customer_id}/limit-increase`);
        },
        requestLimitIncrease({
            customer_id,
            ...data
        }: RequestLimitIncreaseInput): Promise<BlindpayApiResponse<RequestLimitIncreaseResponse>> {
            return client.post(
                `/instances/${instanceId}/customers/${customer_id}/limit-increase`,
                data
            );
        },
    };
}

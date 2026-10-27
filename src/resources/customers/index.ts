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
    SuccessResponse,
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
    tax_id: string | null;
    address_line_1: string;
    address_line_2: string | null;
    city: string;
    state_province_region: string;
    country: Country;
    postal_code: string;
    id_doc_country: Country;
    id_doc_type: IdentificationDocument;
    id_doc_front_file: string | null;
    id_doc_back_file: string | null;
    proof_of_address_doc_type: ProofOfAddressDocType | null;
    proof_of_address_doc_file: string | null;
    ownership_percentage: number | null;
    title: string | null;
    tax_type?: OwnerTaxType | null;
    instance_id?: string;
    customer_id?: string;
};

/** An owner sent when creating a business customer. */
export type CreateCustomerOwnerInput = {
    role: OwnerRole;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    tax_id: string;
    address_line_1: string;
    address_line_2?: string | null;
    city: string;
    state_province_region: string;
    country: Country;
    postal_code: string;
    id_doc_country: Country;
    id_doc_type: IdentificationDocument;
    id_doc_front_file: string;
    id_doc_back_file?: string | null;
    proof_of_address_doc_type?: ProofOfAddressDocType | null;
    proof_of_address_doc_file?: string | null;
    ownership_percentage?: number | null;
    title?: string | null;
    tax_type?: OwnerTaxType | null;
};

/** An existing owner to update. `id` must match one of the customer's owners. */
export type UpdateCustomerOwnerInput = {
    id: string;
    role?: OwnerRole;
    first_name?: string;
    last_name?: string;
    date_of_birth?: string;
    tax_id?: string;
    address_line_1?: string;
    address_line_2?: string | null;
    city?: string;
    state_province_region?: string;
    country?: Country;
    postal_code?: string;
    id_doc_country?: Country;
    id_doc_type?: IdentificationDocument;
    id_doc_front_file?: string;
    id_doc_back_file?: string | null;
    proof_of_address_doc_type?: ProofOfAddressDocType | null;
    proof_of_address_doc_file?: string | null;
    ownership_percentage?: number | null;
    title?: string | null;
    tax_type?: OwnerTaxType | null;
};

export type VirtualAccountPreapprovalStatus = "in_review" | "approved" | "rejected";

export type VirtualAccountPreapprovalBankingPartner = "jpmorgan" | "portage";

export type CustomerVirtualAccountPreapproval = {
    status: VirtualAccountPreapprovalStatus;
    banking_partners: VirtualAccountPreapprovalBankingPartner[];
    rejection_reason: string | null;
    reviewed_at: string | null;
};

export type CnaeConditionStatus = "pending" | "passed" | "failed" | "cancelled";

export type Cnae = {
    code: string;
    description: string;
};

export type CnaeSet = {
    primary: Cnae;
    secondary: Cnae[];
};

export type CustomerCnaeCondition = {
    status: CnaeConditionStatus;
    expected_cnaes: string[];
    cnae_at_approval: CnaeSet;
    result_cnae: CnaeSet | null;
    due_at: string;
    created_at: string;
    reviewed_at: string | null;
};

export type AdditionalInfoLabel =
    | "EIN_LETTER"
    | "KYC_PROVIDER_DOCUMENT"
    | "FLOW_OF_FUNDS"
    | "BANK_STATEMENT"
    | "TAX_RETURN"
    | "AUDITED_FINANCIALS"
    | "OPERATING_AGREEMENT"
    | "BOARD_RESOLUTION"
    | "CERTIFICATE_OF_GOOD_STANDING"
    | "BUSINESS_LICENSE"
    | "MSB_LICENSE"
    | "POWER_OF_ATTORNEY"
    | "TRUST_DEED"
    | "SHAREHOLDER_REGISTRY"
    | "BENEFICIAL_OWNER_DECLARATION"
    | "COMPLIANCE_QUESTIONNAIRE"
    | "PROOF_OF_EMPLOYMENT"
    | "REFERENCE_LETTER"
    | "OTHER";

export type AdditionalInfoItem = {
    label: AdditionalInfoLabel;
    /** A document URL (re-hosted on BlindPay storage) or a free-text note. */
    value: string;
};

export type IndividualWithStandardKYC = {
    id: string;
    is_tos_accepted: boolean | null;
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
    tax_id: string | null;
    address_line_1: string | null;
    address_line_2?: string | null;
    city: string | null;
    state_province_region: string | null;
    country: Country;
    postal_code: string | null;
    ip_address: string | null;
    image_url: string | null;
    phone_number: string | null;
    proof_of_address_doc_type: ProofOfAddressDocType | null;
    proof_of_address_doc_file: string | null;
    first_name: string | null;
    last_name: string | null;
    date_of_birth?: string | null;
    id_doc_country: Country | null;
    id_doc_type: IdentificationDocument | null;
    id_doc_front_file: string | null;
    id_doc_back_file: string | null;
    instance_id: string;
    tos_id: string | null;
    created_at: string | null;
    updated_at: string | null;
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
    cnae_condition?: CustomerCnaeCondition | null;
    virtual_account_preapproval?: CustomerVirtualAccountPreapproval | null;
    is_nested?: boolean | null;
    additional_info?: AdditionalInfoItem[] | null;
    business_type?: BusinessType | null;
    customer_id?: string;
    latitude?: number | null;
    longitude?: number | null;
};

export type IndividualWithEnhancedKYC = {
    id: string;
    is_tos_accepted: boolean | null;
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
    tax_id: string | null;
    address_line_1: string | null;
    address_line_2?: string | null;
    city: string | null;
    state_province_region: string | null;
    country: Country;
    postal_code: string | null;
    ip_address: string | null;
    image_url: string | null;
    phone_number: string | null;
    proof_of_address_doc_type: ProofOfAddressDocType | null;
    proof_of_address_doc_file: string | null;
    first_name: string | null;
    last_name: string | null;
    date_of_birth?: string | null;
    id_doc_country: Country | null;
    id_doc_type: IdentificationDocument | null;
    id_doc_front_file: string | null;
    id_doc_back_file: string | null;
    instance_id: string;
    source_of_funds_doc_type: SourceOfFundsDocType | null;
    source_of_funds_doc_file: string | null;
    purpose_of_transactions: PurposeOfTransactions | null;
    purpose_of_transactions_explanation: string | null;
    tos_id: string | null;
    created_at: string | null;
    updated_at: string | null;
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
    cnae_condition?: CustomerCnaeCondition | null;
    virtual_account_preapproval?: CustomerVirtualAccountPreapproval | null;
    is_nested?: boolean | null;
    additional_info?: AdditionalInfoItem[] | null;
    business_type?: BusinessType | null;
    customer_id?: string;
    latitude?: number | null;
    longitude?: number | null;
};

export type BusinessWithStandardKYB = {
    id: string;
    is_tos_accepted: boolean | null;
    is_fbo: boolean | null;
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
    tax_id: string | null;
    address_line_1: string | null;
    address_line_2?: string | null;
    city: string | null;
    state_province_region: string | null;
    country: Country;
    postal_code: string | null;
    ip_address: string | null;
    image_url: string | null;
    phone_number: string | null;
    proof_of_address_doc_type: ProofOfAddressDocType | null;
    proof_of_address_doc_file: string | null;
    legal_name: string | null;
    alternate_name: string | null;
    formation_date?: string | null;
    website: string | null;
    owners: Owner[] | null;
    incorporation_doc_file: string | null;
    proof_of_ownership_doc_file: string | null;
    external_id: string | null;
    instance_id: string;
    tos_id: string | null;
    created_at: string | null;
    updated_at: string | null;
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
    publicly_traded?: boolean | null;
    cnae_condition?: CustomerCnaeCondition | null;
    virtual_account_preapproval?: CustomerVirtualAccountPreapproval | null;
    is_nested?: boolean | null;
    additional_info?: AdditionalInfoItem[] | null;
    business_type?: BusinessType | null;
    customer_id?: string;
    latitude?: number | null;
    longitude?: number | null;
};

/** Legacy KYC tier carried by customers migrated from older tiers. It can't be created. */
export type IndividualWithLightKYC = StrictOmit<IndividualWithStandardKYC, "kyc_type"> & {
    kyc_type: Extract<KycType, "light">;
};

/** Legacy KYB tier carried by customers migrated from older tiers. It can't be created. */
export type BusinessWithLightKYB = StrictOmit<BusinessWithStandardKYB, "kyc_type"> & {
    kyc_type: Extract<KycType, "light">;
};

export type Customer =
    | IndividualWithStandardKYC
    | IndividualWithEnhancedKYC
    | IndividualWithLightKYC
    | BusinessWithStandardKYB
    | BusinessWithLightKYB;

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
    additional_info?: AdditionalInfoItem[] | null;
    latitude?: number | null;
    longitude?: number | null;
};

export type CreateIndividualWithStandardKYCResponse = {
    id: string;
    customer_id: string;
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
    additional_info?: AdditionalInfoItem[] | null;
    latitude?: number | null;
    longitude?: number | null;
};

export type CreateIndividualWithEnhancedKYCResponse = {
    id: string;
    customer_id: string;
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
    owners?: CreateCustomerOwnerInput[] | null;
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
    additional_info?: AdditionalInfoItem[] | null;
    latitude?: number | null;
    longitude?: number | null;
};

export type CreateBusinessWithStandardKYBResponse = {
    id: string;
    customer_id: string;
};

export type ListCustomersInput = PaginationParams & {
    full_name?: string;
    customer_name?: string;
    status?: KycStatus;
    customer_id?: string;
    bank_account_id?: string;
    country?: Country;
};

export type ListCustomersResponse =
    | {
          data: Customer[];
          pagination: PaginationMetadata;
      }
    | Customer[];

export type GetCustomerInput = string;

export type GetCustomerResponse = Customer;

export type UpdateCustomerInput = {
    customer_id: string;
    account_purpose?: AccountPurpose | null;
    address_line_1?: string | null;
    address_line_2?: string | null;
    alternate_name?: string | null;
    business_description?: string | null;
    business_industry?: BusinessIndustry | null;
    business_type?: BusinessType | null;
    city?: string | null;
    country: Country;
    date_of_birth?: string | null;
    email: string;
    estimated_annual_revenue?: EstimatedAnnualRevenue | null;
    external_id?: string | null;
    first_name?: string | null;
    formation_date?: string | null;
    id_doc_back_file?: string | null;
    id_doc_country?: Country | null;
    id_doc_front_file?: string | null;
    id_doc_type?: IdentificationDocument | null;
    image_url?: string | null;
    incorporation_doc_file?: string | null;
    ip_address?: string | null;
    last_name?: string | null;
    legal_name?: string | null;
    owners?: UpdateCustomerOwnerInput[] | null;
    phone_number?: string | null;
    postal_code?: string | null;
    proof_of_address_doc_file?: string | null;
    proof_of_address_doc_type?: ProofOfAddressDocType | null;
    proof_of_ownership_doc_file?: string | null;
    publicly_traded?: boolean | null;
    purpose_of_transactions?: PurposeOfTransactions | null;
    purpose_of_transactions_explanation?: string | null;
    selfie_file?: string | null;
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
    additional_info?: AdditionalInfoItem[] | null;
    latitude?: number | null;
    longitude?: number | null;
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
    | "individual_pay_stub"
    | "individual_employment_letter"
    | "individual_investment_statement"
    | "individual_crypto_exchange_statement"
    | "individual_blockchain_wallet_statement"
    | "business_bank_statement"
    | "business_financial_statements"
    | "business_accounts_receivable"
    | "business_contract"
    | "business_merchant_processor_statement"
    | "business_shareholder_loan"
    | "business_tax_return";

export type LimitIncreaseSupportingDocument = {
    type: LimitIncreaseRequestSupportingDocumentType;
    file: string;
};

export type GetLimitIncreaseRequestsResponse = Array<{
    id: string;
    customer_id: string;
    status: LimitIncreaseRequestStatus;
    daily: number | null;
    monthly: number | null;
    per_transaction: number | null;
    supporting_document_file: string | null;
    supporting_document_type: LimitIncreaseRequestSupportingDocumentType | null;
    supporting_documents?: LimitIncreaseSupportingDocument[] | null;
    created_at: string | null;
    updated_at: string | null;
    approved_per_transaction?: number | null;
    approved_daily?: number | null;
    approved_monthly?: number | null;
}>;

export type RequestLimitIncreaseInput = {
    customer_id: string;
    daily: number | null;
    monthly: number | null;
    per_transaction: number | null;
    supporting_document_file?: string;
    supporting_document_type?: LimitIncreaseRequestSupportingDocumentType;
    supporting_documents?: LimitIncreaseSupportingDocument[];
};

export type RequestLimitIncreaseResponse = {
    id: string;
};

export function createCustomersResource(instanceId: string, client: InternalApiClient) {
    return {
        list(params?: ListCustomersInput): Promise<BlindpayApiResponse<ListCustomersResponse>> {
            const queryParams = params ? `?${new URLSearchParams(params)}` : "";
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
        update({
            customer_id,
            ...data
        }: UpdateCustomerInput): Promise<BlindpayApiResponse<SuccessResponse>> {
            return client.put(`/instances/${instanceId}/customers/${customer_id}`, data);
        },
        delete(customer_id: DeleteCustomerInput): Promise<BlindpayApiResponse<SuccessResponse>> {
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

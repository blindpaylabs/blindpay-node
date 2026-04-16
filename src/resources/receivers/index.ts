import type {
    AccountClass,
    BlindpayApiResponse,
    Country,
    PaginationMetadata,
    PaginationParams,
} from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";
import type { StrictOmit } from "../../internal/helpers/strict-omit";

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

export type AccountPurpose =
    | "charitable_donations"
    | "ecommerce_retail_payments"
    | "investment_purposes"
    | "business_expenses"
    | "payments_to_friends_or_family_abroad"
    | "personal_or_living_expenses"
    | "protect_wealth"
    | "purchase_goods_and_services"
    | "receive_payments_for_goods_and_services"
    | "tax_optimization"
    | "third_party_money_transmission"
    | "other"
    | "payroll"
    | "treasury_management";

export type BusinessType =
    | "corporation"
    | "llc"
    | "partnership"
    | "sole_proprietorship"
    | "trust"
    | "non_profit";

export type BusinessIndustry =
    | "111998"
    | "112120"
    | "113310"
    | "115114"
    | "211120"
    | "212114"
    | "213112"
    | "221310"
    | "236115"
    | "236220"
    | "237310"
    | "238210"
    | "311421"
    | "312130"
    | "313110"
    | "315990"
    | "322220"
    | "325412"
    | "334111"
    | "334118"
    | "334210"
    | "336110"
    | "336111"
    | "336390"
    | "337121"
    | "339112"
    | "339910"
    | "339920"
    | "339930"
    | "423110"
    | "423430"
    | "423510"
    | "423690"
    | "423830"
    | "423840"
    | "423940"
    | "424210"
    | "424410"
    | "424480"
    | "424690"
    | "424990"
    | "444110"
    | "445110"
    | "445320"
    | "449210"
    | "454110"
    | "455110"
    | "455219"
    | "456110"
    | "457110"
    | "458110"
    | "458210"
    | "458310"
    | "459120"
    | "459210"
    | "481111"
    | "483111"
    | "484121"
    | "485210"
    | "488510"
    | "493110"
    | "511210"
    | "512250"
    | "513130"
    | "516120"
    | "517110"
    | "517111"
    | "517112"
    | "517410"
    | "518210"
    | "519130"
    | "522110"
    | "522210"
    | "522320"
    | "523110"
    | "523150"
    | "523920"
    | "523940"
    | "523999"
    | "524113"
    | "531110"
    | "531120"
    | "531130"
    | "531190"
    | "531210"
    | "531311"
    | "531312"
    | "531320"
    | "531390"
    | "532111"
    | "541110"
    | "541211"
    | "541214"
    | "541330"
    | "541430"
    | "541511"
    | "541512"
    | "541519"
    | "541611"
    | "541618"
    | "541715"
    | "541810"
    | "541922"
    | "541930"
    | "541940"
    | "541990"
    | "551112"
    | "561311"
    | "561422"
    | "561499"
    | "561510"
    | "561612"
    | "561730"
    | "561740"
    | "562111"
    | "562920"
    | "611110"
    | "611310"
    | "611410"
    | "611710"
    | "621111"
    | "621210"
    | "621399"
    | "621511"
    | "621910"
    | "622110"
    | "623110"
    | "623220"
    | "624410"
    | "711110"
    | "711211"
    | "711410"
    | "711510"
    | "712110"
    | "713110"
    | "713210"
    | "721110"
    | "722511"
    | "722513"
    | "811111"
    | "811210"
    | "812111"
    | "812112"
    | "812199"
    | "813110"
    | "813211"
    | "813219";

export type EstimatedAnnualRevenue =
    | "0_99999"
    | "100000_999999"
    | "1000000_9999999"
    | "10000000_49999999"
    | "50000000_249999999"
    | "2500000000_plus";

export type SourceOfWealth =
    | "business_dividends_or_profits"
    | "investments"
    | "asset_sales"
    | "client_investor_contributions"
    | "gambling"
    | "charitable_contributions"
    | "inheritance"
    | "affiliate_or_royalty_income";

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

export type ReceiverKycStatus =
    | "verifying"
    | "approved"
    | "rejected"
    | "deprecated"
    | "pending_review";

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
    receiver_id?: string;
};

export type IndividualWithStandardKYC = {
    id: string;
    is_tos_accepted: boolean;
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
    publicly_traded?: boolean | null;
};

export type IndividualWithEnhancedKYC = {
    id: string;
    is_tos_accepted: boolean;
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
    publicly_traded?: boolean | null;
};

export type BusinessWithStandardKYB = {
    id: string;
    is_tos_accepted: boolean;
    is_fbo: boolean;
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
};

export type CreateBusinessWithStandardKYBResponse = {
    id: string;
};

export type ListReceiversInput = PaginationParams & {
    full_name?: string;
    receiver_name?: string;
    status?: string;
    receiver_id?: string;
    bank_account_id?: string;
    country?: Country;
};

export type ListReceiversResponse = {
    data: Array<IndividualWithStandardKYC | IndividualWithEnhancedKYC | BusinessWithStandardKYB>;
    pagination: PaginationMetadata;
};

export type GetReceiverInput = string;

export type GetReceiverResponse =
    | IndividualWithStandardKYC
    | IndividualWithEnhancedKYC
    | BusinessWithStandardKYB;

export type UpdateReceiverInput = {
    receiver_id: string;
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
    approved_per_transaction?: number | null;
    approved_daily?: number | null;
    approved_monthly?: number | null;
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
        list(params?: ListReceiversInput): Promise<BlindpayApiResponse<ListReceiversResponse>> {
            const queryParams = params ? `?${new URLSearchParams(params)}` : "";
            return client.get(`/instances/${instanceId}/receivers${queryParams}`);
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
            return client.put(`/instances/${instanceId}/receivers/${receiver_id}`, data);
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

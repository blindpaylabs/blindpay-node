import type { AccountClass, BlindpayApiResponse, Country } from "../../../types";
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
    | "541511"
    | "541512"
    | "541519"
    | "518210"
    | "511210"
    | "541611"
    | "541618"
    | "541330"
    | "541990"
    | "522110"
    | "523110"
    | "523920"
    | "423430"
    | "423690"
    | "423110"
    | "423830"
    | "423840"
    | "423510"
    | "424210"
    | "424690"
    | "424990"
    | "454110"
    | "334111"
    | "334118"
    | "325412"
    | "339112"
    | "336111"
    | "336390"
    | "551112"
    | "561499"
    | "488510"
    | "484121"
    | "493110"
    | "424410"
    | "424480"
    | "315990"
    | "313110"
    | "213112"
    | "517110"
    | "541214";

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
};

export type CreateReceiverInput = {
    country: Country;
    email: string;
    kyc_type: KycType;
    type: AccountClass;
    account_purpose?: AccountPurpose | null;
    address_line_1?: string | null;
    address_line_2?: string | null;
    alternate_name?: string | null;
    business_description?: string | null;
    business_industry?: BusinessIndustry | null;
    business_type?: BusinessType | null;
    city?: string | null;
    date_of_birth?: string | null;
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
    owners?: Array<StrictOmit<Owner, "id">> | null;
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
};

export type CreateReceiverResponse = {
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
        create(data: CreateReceiverInput): Promise<BlindpayApiResponse<CreateReceiverResponse>> {
            return client.post(`/instances/${instanceId}/receivers`, data);
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

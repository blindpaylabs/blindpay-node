import type { BlindpayApiResponse, Country, Rail } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type BankDetailKey =
    | "type"
    | "name"
    | "pix_key"
    | "beneficiary_name"
    | "routing_number"
    | "account_number"
    | "account_type"
    | "account_class"
    | "address_line_1"
    | "address_line_2"
    | "city"
    | "state_province_region"
    | "country"
    | "postal_code"
    | "checkbook_account_id"
    | "checkbook_user_key"
    | "spei_protocol"
    | "spei_institution_code"
    | "spei_clabe"
    | "transfers_type"
    | "transfers_account"
    | "ach_cop_beneficiary_first_name"
    | "ach_cop_beneficiary_last_name"
    | "ach_cop_document_id"
    | "ach_cop_document_type"
    | "ach_cop_email"
    | "ach_cop_bank_code"
    | "ach_cop_bank_account"
    | "swift_code_bic"
    | "swift_account_holder_name"
    | "swift_account_number_iban"
    | "swift_beneficiary_address_line_1"
    | "swift_beneficiary_address_line_2"
    | "swift_beneficiary_country"
    | "swift_beneficiary_city"
    | "swift_beneficiary_state_province_region"
    | "swift_beneficiary_postal_code"
    | "swift_bank_name"
    | "swift_bank_address_line_1"
    | "swift_bank_address_line_2"
    | "swift_bank_country"
    | "swift_bank_city"
    | "swift_bank_state_province_region"
    | "swift_bank_postal_code"
    | "swift_intermediary_bank_swift_code_bic"
    | "swift_intermediary_bank_account_number_iban"
    | "swift_intermediary_bank_name"
    | "business_industry"
    | "date_of_birth"
    | "force_cpf_cnpj"
    | "onemoney_external_account_id"
    | "phone_number"
    | "pix_safe_bank_code"
    | "pix_safe_branch_code"
    | "pix_safe_cpf_cnpj"
    | "recipient_relationship"
    | "sepa_beneficiary_address_line_1"
    | "sepa_beneficiary_address_line_2"
    | "sepa_beneficiary_bic"
    | "sepa_beneficiary_city"
    | "sepa_beneficiary_country"
    | "sepa_beneficiary_legal_name"
    | "sepa_beneficiary_postal_code"
    | "sepa_beneficiary_state_province_region"
    | "sepa_iban"
    | "status"
    | "swift_ifsc_branch_code"
    | "swift_payment_code"
    | "tax_id"
    | "ted_bank_code"
    | "ted_branch_code"
    | "ted_cpf_cnpj"
    | "swift_intermediary_bank_country";

export type GetBankDetailsResponse = Array<{
    label: string;
    regex: string;
    key: BankDetailKey;
    items?: Array<{
        label: string;
        value: string;
        is_active?: boolean;
    }>;
    required: boolean | null;
}>;

export type GetRailsResponse = Array<{
    label: string;
    value: Rail;
    country: Country;
}>;

export type GetNaicsCodesResponse = Array<{
    label: string;
    value: string;
}>;

export type GetSwiftCodeBankDetailsInput = string;

export type GetSwiftCodeBankDetailsResponse = Array<{
    id: string;
    bank: string;
    city: string;
    branch: string;
    swiftCode: string;
    swiftCodeLink: string;
    country: string;
    countrySlug: string;
}>;

export function createAvailableResource(client: InternalApiClient) {
    return {
        getBankDetails(rail: Rail): Promise<BlindpayApiResponse<GetBankDetailsResponse>> {
            return client.get(`/available/bank-details?rail=${rail}`);
        },
        getRails(): Promise<BlindpayApiResponse<GetRailsResponse>> {
            return client.get("/available/rails");
        },
        getNaicsCodes(): Promise<BlindpayApiResponse<GetNaicsCodesResponse>> {
            return client.get("/available/naics");
        },
        getSwiftCodeBankDetails(
            swift: GetSwiftCodeBankDetailsInput
        ): Promise<BlindpayApiResponse<GetSwiftCodeBankDetailsResponse>> {
            return client.get(`/available/swift/${swift}`);
        },
    };
}

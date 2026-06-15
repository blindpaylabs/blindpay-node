import type {
    AccountClass,
    AchCopDocument,
    BankAccountType,
    BlindpayApiResponse,
    BusinessIndustry,
    Country,
    PaginationMetadata,
    PaginationParams,
    RecipientRelationship,
} from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type BankAccountStatus = "verifying" | "approved" | "rejected" | "deprecated";

export type SwiftPaymentCode = string; // The changelog shows 1025 values - too many to enumerate

export type CreateBankAccountInput = {
    type: string; // The changelog shows 11 values - need to define this enum
    name: string;
    status?: BankAccountStatus | null;
    recipient_relationship?: RecipientRelationship | null;
    swift_payment_code?: SwiftPaymentCode | null;
    pix_key?: string | null;
    force_cpf_cnpj?: boolean | null;
    beneficiary_name?: string | null;
    routing_number?: string | null;
    account_number?: string | null;
    account_type?: BankAccountType | null;
    account_class?: AccountClass | null;
    address_line_1?: string | null;
    address_line_2?: string | null;
    city?: string | null;
    state_province_region?: string | null;
    country?: Country | null;
    postal_code?: string | null;
    checkbook_account_id?: string | null;
    checkbook_user_key?: string | null;
    onemoney_external_account_id?: string | null;
    pix_safe_bank_code?: string | null;
    pix_safe_branch_code?: string | null;
    pix_safe_cpf_cnpj?: string | null;
    ted_bank_code?: string | null;
    ted_branch_code?: string | null;
    ted_cpf_cnpj?: string | null;
    spei_protocol?: "clabe" | "debitcard" | "phonenum" | null;
    spei_institution_code?: string | null;
    spei_clabe?: string | null;
    transfers_type?: "CVU" | "CBU" | "ALIAS" | null;
    transfers_account?: string | null;
    ach_cop_beneficiary_first_name?: string | null;
    ach_cop_beneficiary_last_name?: string | null;
    ach_cop_document_id?: string | null;
    ach_cop_document_type?: "CC" | "CE" | "NIT" | "PASS" | "PEP" | null;
    ach_cop_email?: string | null;
    ach_cop_bank_code?: string | null;
    ach_cop_bank_account?: string | null;
    swift_code_bic?: string | null;
    swift_account_holder_name?: string | null;
    swift_account_number_iban?: string | null;
    swift_beneficiary_address_line_1?: string | null;
    swift_beneficiary_address_line_2?: string | null;
    swift_beneficiary_country?: Country | null;
    swift_beneficiary_city?: string | null;
    swift_beneficiary_state_province_region?: string | null;
    swift_beneficiary_postal_code?: string | null;
    swift_bank_name?: string | null;
    swift_bank_address_line_1?: string | null;
    swift_bank_address_line_2?: string | null;
    swift_bank_country?: Country | null;
    swift_bank_city?: string | null;
    swift_bank_state_province_region?: string | null;
    swift_bank_postal_code?: string | null;
    swift_ifsc_branch_code?: string | null;
    swift_intermediary_bank_swift_code_bic?: unknown;
    swift_intermediary_bank_account_number_iban?: string | null;
    swift_intermediary_bank_name?: string | null;
    swift_intermediary_bank_country?: Country | null;
    sepa_iban?: string | null;
    sepa_beneficiary_bic?: string | null;
    sepa_beneficiary_legal_name?: string | null;
    sepa_beneficiary_address_line_1?: string | null;
    sepa_beneficiary_address_line_2?: string | null;
    sepa_beneficiary_city?: string | null;
    sepa_beneficiary_state_province_region?: string | null;
    sepa_beneficiary_postal_code?: string | null;
    sepa_beneficiary_country?: Country | null;
    business_industry?: BusinessIndustry | null;
    phone_number?: string | null;
    tax_id?: string | null;
    date_of_birth?: unknown;
};

export type BankAccount = {
    id: string;
    type: string;
    name: string;
    pix_key?: string | null;
    beneficiary_name?: string | null;
    routing_number?: string | null;
    account_number?: string | null;
    account_type?: BankAccountType | null;
    account_class?: AccountClass | null;
    address_line_1?: string | null;
    address_line_2?: string | null;
    city?: string | null;
    state_province_region?: string | null;
    country?: Country | null;
    postal_code?: string | null;
    spei_protocol?: "clabe" | "debitcard" | "phonenum" | null;
    spei_institution_code?: string | null;
    spei_clabe?: string | null;
    transfers_type?: "CVU" | "CBU" | "ALIAS" | null;
    transfers_account?: string | null;
    // ... and 53 more fields as noted in changelog
};

export type ListBankAccountsInput = PaginationParams;

export type ListBankAccountsResponse = {
    data: BankAccount[];
    pagination: PaginationMetadata;
};

export type CreateBankAccountResponse = BankAccount;

export type GetBankAccountInput = string;

export type GetBankAccountResponse = BankAccount;

export type DeleteBankAccountInput = string;

export function createCustomerBankAccountsResource(instanceId: string, client: InternalApiClient) {
    return {
        list(
            customer_id: string,
            params?: ListBankAccountsInput
        ): Promise<BlindpayApiResponse<ListBankAccountsResponse>> {
            const queryParams = params ? `?${new URLSearchParams(params)}` : "";
            return client.get(
                `/instances/${instanceId}/customers/${customer_id}/bank-accounts${queryParams}`
            );
        },
        create(
            customer_id: string,
            data: CreateBankAccountInput
        ): Promise<BlindpayApiResponse<CreateBankAccountResponse>> {
            return client.post(`/instances/${instanceId}/customers/${customer_id}/bank-accounts`, {
                ...data,
            });
        },
        get(
            customer_id: string,
            bank_account_id: GetBankAccountInput
        ): Promise<BlindpayApiResponse<GetBankAccountResponse>> {
            return client.get(
                `/instances/${instanceId}/customers/${customer_id}/bank-accounts/${bank_account_id}`
            );
        },
        delete(
            customer_id: string,
            bank_account_id: DeleteBankAccountInput
        ): Promise<BlindpayApiResponse<void>> {
            return client.delete(
                `/instances/${instanceId}/customers/${customer_id}/bank-accounts/${bank_account_id}`
            );
        },
    };
}
import type {
    AccountClass,
    AchCopDocument,
    ArgentinaTransfers,
    BankAccountType,
    BlindpayApiResponse,
    BusinessIndustry,
    Country,
    Rail,
    RequestOptions,
    SuccessResponse,
} from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";
import type { SpeiProtocol } from "../payouts";
import type { OfframpWalletNetwork } from "../wallets/offramp";

export type RecipientRelationship =
    | "first_party"
    | "employee"
    | "independent_contractor"
    | "vendor_or_supplier"
    | "subsidiary_or_affiliate"
    | "merchant_or_partner"
    | "customer"
    | "landlord"
    | "family"
    | "other";

export type BankAccountStatus = "verifying" | "approved" | "rejected" | "deprecated";

export type ListBankAccountsInput = {
    customer_id: string;
    status?: BankAccountStatus;
    type?: Rail;
    name?: string;
    bank_account_id?: string;
    country?: Country;
};

export type ListBankAccountsResponse = Array<{
    id: string;
    type: Rail;
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
    spei_protocol?: SpeiProtocol | null;
    spei_institution_code?: string | null;
    spei_clabe?: string | null;
    transfers_type?: "CVU" | "CBU" | "ALIAS" | null;
    transfers_account?: string | null;
    ach_cop_beneficiary_first_name?: string | null;
    ach_cop_beneficiary_last_name?: string | null;
    ach_cop_document_id?: string | null;
    ach_cop_document_type?: AchCopDocument | null;
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
    swift_intermediary_bank_swift_code_bic?: string | null;
    swift_intermediary_bank_account_number_iban?: string | null;
    swift_intermediary_bank_name?: string | null;
    swift_intermediary_bank_country?: Country | null;
    swift_intermediary_bank_routing_number?: string | null;
    pix_safe_bank_code?: string | null;
    pix_safe_branch_code?: string | null;
    pix_safe_cpf_cnpj?: string | null;
    tron_wallet_hash?: string | null;
    sepa_iban?: string | null;
    sepa_beneficiary_bic?: string | null;
    sepa_beneficiary_legal_name?: string | null;
    sepa_beneficiary_address_line_1?: string | null;
    sepa_beneficiary_address_line_2?: string | null;
    sepa_beneficiary_city?: string | null;
    sepa_beneficiary_state_province_region?: string | null;
    sepa_beneficiary_postal_code?: string | null;
    sepa_beneficiary_country?: Country | null;
    offramp_wallets?: Array<{
        address: string;
        id: string;
        network: OfframpWalletNetwork;
        external_id?: string | null;
        circle_wallet_id?: string | null;
    }> | null;
    business_industry?: BusinessIndustry | null;
    phone_number?: string | null;
    tax_id?: string | null;
    date_of_birth?: string | null;
    status?: BankAccountStatus | null;
    recipient_relationship?: RecipientRelationship | null;
    swift_payment_code?: string | null;
    ted_bank_code?: string | null;
    ted_branch_code?: string | null;
    ted_cpf_cnpj?: string | null;
    created_at: string | null;
    faster_payments_account_number?: string | null;
    faster_payments_beneficiary_address_line_1?: string | null;
    faster_payments_beneficiary_address_line_2?: string | null;
    faster_payments_beneficiary_city?: string | null;
    faster_payments_beneficiary_country?: Country | null;
    faster_payments_beneficiary_legal_name?: string | null;
    faster_payments_beneficiary_postal_code?: string | null;
    faster_payments_beneficiary_state_province_region?: string | null;
    faster_payments_sort_code?: string | null;
    plaid_connected_at?: string | null;
    swift_ifsc_branch_code?: string | null;
}>;

export type GetBankAccountInput = {
    customer_id: string;
    id: string;
};

export type BankAccount = ListBankAccountsResponse[number];

export type GetBankAccountResponse = BankAccount;

export type DeleteBankAccountInput = {
    customer_id: string;
    id: string;
};

export type CreatePixInput = {
    customer_id: string;
    name: string;
    pix_key: string | null;
    faster_payments_account_number?: string | null;
    faster_payments_beneficiary_address_line_1?: string | null;
    faster_payments_beneficiary_address_line_2?: string | null;
    faster_payments_beneficiary_city?: string | null;
    faster_payments_beneficiary_country?: Country | null;
    faster_payments_beneficiary_legal_name?: string | null;
    faster_payments_beneficiary_postal_code?: string | null;
    faster_payments_beneficiary_state_province_region?: string | null;
    faster_payments_sort_code?: string | null;
    force_cpf_cnpj?: boolean | null;
    swift_ifsc_branch_code?: string | null;
};

export type CreatePixResponse = {
    id: string;
    type: "pix";
    name: string;
    pix_key: string | null;
    created_at: string | null;
    faster_payments_account_number?: string | null;
    faster_payments_beneficiary_address_line_1?: string | null;
    faster_payments_beneficiary_address_line_2?: string | null;
    faster_payments_beneficiary_city?: string | null;
    faster_payments_beneficiary_country?: Country | null;
    faster_payments_beneficiary_legal_name?: string | null;
    faster_payments_beneficiary_postal_code?: string | null;
    faster_payments_beneficiary_state_province_region?: string | null;
    faster_payments_sort_code?: string | null;
    plaid_connected_at?: string | null;
    swift_ifsc_branch_code?: string | null;
};

export type CreatePixSafeInput = {
    customer_id: string;
    name: string;
    beneficiary_name: string | null;
    account_number: string | null;
    account_type: BankAccountType | null;
    pix_safe_bank_code: string | null;
    pix_safe_branch_code: string | null;
    pix_safe_cpf_cnpj: string | null;
    faster_payments_account_number?: string | null;
    faster_payments_beneficiary_address_line_1?: string | null;
    faster_payments_beneficiary_address_line_2?: string | null;
    faster_payments_beneficiary_city?: string | null;
    faster_payments_beneficiary_country?: Country | null;
    faster_payments_beneficiary_legal_name?: string | null;
    faster_payments_beneficiary_postal_code?: string | null;
    faster_payments_beneficiary_state_province_region?: string | null;
    faster_payments_sort_code?: string | null;
    force_cpf_cnpj?: boolean | null;
    swift_ifsc_branch_code?: string | null;
};

export type CreatePixSafeResponse = {
    id: string;
    type: "pix_safe";
    name: string;
    beneficiary_name: string | null;
    account_number: string | null;
    account_type: BankAccountType | null;
    pix_safe_bank_code: string | null;
    pix_safe_branch_code: string | null;
    pix_safe_cpf_cnpj: string | null;
    created_at: string | null;
    faster_payments_account_number?: string | null;
    faster_payments_beneficiary_address_line_1?: string | null;
    faster_payments_beneficiary_address_line_2?: string | null;
    faster_payments_beneficiary_city?: string | null;
    faster_payments_beneficiary_country?: Country | null;
    faster_payments_beneficiary_legal_name?: string | null;
    faster_payments_beneficiary_postal_code?: string | null;
    faster_payments_beneficiary_state_province_region?: string | null;
    faster_payments_sort_code?: string | null;
    plaid_connected_at?: string | null;
    swift_ifsc_branch_code?: string | null;
};

export type CreateArgentinaTransfersInput = {
    customer_id: string;
    name: string;
    beneficiary_name: string | null;
    transfers_account: string | null;
    transfers_type: ArgentinaTransfers | null;
    faster_payments_account_number?: string | null;
    faster_payments_beneficiary_address_line_1?: string | null;
    faster_payments_beneficiary_address_line_2?: string | null;
    faster_payments_beneficiary_city?: string | null;
    faster_payments_beneficiary_country?: Country | null;
    faster_payments_beneficiary_legal_name?: string | null;
    faster_payments_beneficiary_postal_code?: string | null;
    faster_payments_beneficiary_state_province_region?: string | null;
    faster_payments_sort_code?: string | null;
    force_cpf_cnpj?: boolean | null;
    swift_ifsc_branch_code?: string | null;
};

export type CreateArgentinaTransfersResponse = {
    id: string;
    type: "transfers_bitso";
    name: string;
    beneficiary_name: string | null;
    transfers_type: ArgentinaTransfers | null;
    transfers_account: string | null;
    created_at: string | null;
    faster_payments_account_number?: string | null;
    faster_payments_beneficiary_address_line_1?: string | null;
    faster_payments_beneficiary_address_line_2?: string | null;
    faster_payments_beneficiary_city?: string | null;
    faster_payments_beneficiary_country?: Country | null;
    faster_payments_beneficiary_legal_name?: string | null;
    faster_payments_beneficiary_postal_code?: string | null;
    faster_payments_beneficiary_state_province_region?: string | null;
    faster_payments_sort_code?: string | null;
    plaid_connected_at?: string | null;
    swift_ifsc_branch_code?: string | null;
};

export type CreateSpeiInput = {
    customer_id: string;
    beneficiary_name: string | null;
    name: string;
    spei_clabe: string | null;
    spei_institution_code: string | null;
    spei_protocol: SpeiProtocol | null;
    faster_payments_account_number?: string | null;
    faster_payments_beneficiary_address_line_1?: string | null;
    faster_payments_beneficiary_address_line_2?: string | null;
    faster_payments_beneficiary_city?: string | null;
    faster_payments_beneficiary_country?: Country | null;
    faster_payments_beneficiary_legal_name?: string | null;
    faster_payments_beneficiary_postal_code?: string | null;
    faster_payments_beneficiary_state_province_region?: string | null;
    faster_payments_sort_code?: string | null;
    force_cpf_cnpj?: boolean | null;
    swift_ifsc_branch_code?: string | null;
};

export type CreateSpeiResponse = {
    id: string;
    type: "spei_bitso";
    name: string;
    beneficiary_name: string | null;
    spei_protocol: SpeiProtocol | null;
    spei_institution_code: string | null;
    spei_clabe: string | null;
    created_at: string | null;
    faster_payments_account_number?: string | null;
    faster_payments_beneficiary_address_line_1?: string | null;
    faster_payments_beneficiary_address_line_2?: string | null;
    faster_payments_beneficiary_city?: string | null;
    faster_payments_beneficiary_country?: Country | null;
    faster_payments_beneficiary_legal_name?: string | null;
    faster_payments_beneficiary_postal_code?: string | null;
    faster_payments_beneficiary_state_province_region?: string | null;
    faster_payments_sort_code?: string | null;
    plaid_connected_at?: string | null;
    swift_ifsc_branch_code?: string | null;
};

export type CreateColombiaAchInput = {
    customer_id: string;
    name: string;
    account_type: BankAccountType | null;
    ach_cop_beneficiary_first_name: string | null;
    ach_cop_beneficiary_last_name: string | null;
    ach_cop_document_id: string | null;
    ach_cop_document_type: AchCopDocument | null;
    ach_cop_email: string | null;
    ach_cop_bank_code: string | null;
    ach_cop_bank_account: string | null;
    faster_payments_account_number?: string | null;
    faster_payments_beneficiary_address_line_1?: string | null;
    faster_payments_beneficiary_address_line_2?: string | null;
    faster_payments_beneficiary_city?: string | null;
    faster_payments_beneficiary_country?: Country | null;
    faster_payments_beneficiary_legal_name?: string | null;
    faster_payments_beneficiary_postal_code?: string | null;
    faster_payments_beneficiary_state_province_region?: string | null;
    faster_payments_sort_code?: string | null;
    force_cpf_cnpj?: boolean | null;
    swift_ifsc_branch_code?: string | null;
};

export type CreateColombiaAchResponse = {
    id: string;
    type: "ach_cop_bitso";
    name: string;
    account_type: BankAccountType | null;
    ach_cop_beneficiary_first_name: string | null;
    ach_cop_beneficiary_last_name: string | null;
    ach_cop_document_id: string | null;
    ach_cop_document_type: AchCopDocument | null;
    ach_cop_email: string | null;
    ach_cop_bank_code: string | null;
    ach_cop_bank_account: string | null;
    created_at: string | null;
    faster_payments_account_number?: string | null;
    faster_payments_beneficiary_address_line_1?: string | null;
    faster_payments_beneficiary_address_line_2?: string | null;
    faster_payments_beneficiary_city?: string | null;
    faster_payments_beneficiary_country?: Country | null;
    faster_payments_beneficiary_legal_name?: string | null;
    faster_payments_beneficiary_postal_code?: string | null;
    faster_payments_beneficiary_state_province_region?: string | null;
    faster_payments_sort_code?: string | null;
    plaid_connected_at?: string | null;
    swift_ifsc_branch_code?: string | null;
};

export type CreateAchInput = {
    customer_id: string;
    name: string;
    account_class: AccountClass | null;
    account_number: string | null;
    account_type: BankAccountType | null;
    beneficiary_name: string | null;
    routing_number: string | null;
    recipient_relationship: RecipientRelationship | null;
    address_line_1: string | null;
    city: string | null;
    state_province_region: string | null;
    country: Country | null;
    postal_code: string | null;
    address_line_2?: string | null;
    business_industry?: BusinessIndustry | null;
    phone_number?: string | null;
    tax_id?: string | null;
    date_of_birth?: string | null;
    faster_payments_account_number?: string | null;
    faster_payments_beneficiary_address_line_1?: string | null;
    faster_payments_beneficiary_address_line_2?: string | null;
    faster_payments_beneficiary_city?: string | null;
    faster_payments_beneficiary_country?: Country | null;
    faster_payments_beneficiary_legal_name?: string | null;
    faster_payments_beneficiary_postal_code?: string | null;
    faster_payments_beneficiary_state_province_region?: string | null;
    faster_payments_sort_code?: string | null;
    force_cpf_cnpj?: boolean | null;
    swift_ifsc_branch_code?: string | null;
};

export type CreateAchResponse = {
    id: string;
    type: "ach";
    name: string;
    beneficiary_name: string | null;
    routing_number: string | null;
    account_number: string | null;
    account_type: BankAccountType | null;
    account_class: AccountClass | null;
    recipient_relationship: RecipientRelationship | null;
    address_line_1: string | null;
    address_line_2: string | null;
    city: string | null;
    state_province_region: string | null;
    country: Country | null;
    postal_code: string | null;
    ach_cop_beneficiary_first_name: string | null;
    ach_cop_beneficiary_last_name: string | null;
    ach_cop_document_id: string | null;
    ach_cop_document_type: AchCopDocument | null;
    ach_cop_email: string | null;
    ach_cop_bank_code: string | null;
    ach_cop_bank_account: string | null;
    created_at: string | null;
    faster_payments_account_number?: string | null;
    faster_payments_beneficiary_address_line_1?: string | null;
    faster_payments_beneficiary_address_line_2?: string | null;
    faster_payments_beneficiary_city?: string | null;
    faster_payments_beneficiary_country?: Country | null;
    faster_payments_beneficiary_legal_name?: string | null;
    faster_payments_beneficiary_postal_code?: string | null;
    faster_payments_beneficiary_state_province_region?: string | null;
    faster_payments_sort_code?: string | null;
    plaid_connected_at?: string | null;
    swift_ifsc_branch_code?: string | null;
};

export type CreateWireInput = {
    customer_id: string;
    name: string;
    account_class: AccountClass | null;
    account_number: string | null;
    beneficiary_name: string | null;
    routing_number: string | null;
    recipient_relationship: RecipientRelationship | null;
    address_line_1: string | null;
    address_line_2?: string | null;
    city: string | null;
    state_province_region: string | null;
    country: Country | null;
    postal_code: string | null;
    business_industry?: BusinessIndustry | null;
    phone_number?: string | null;
    tax_id?: string | null;
    date_of_birth?: string | null;
    faster_payments_account_number?: string | null;
    faster_payments_beneficiary_address_line_1?: string | null;
    faster_payments_beneficiary_address_line_2?: string | null;
    faster_payments_beneficiary_city?: string | null;
    faster_payments_beneficiary_country?: Country | null;
    faster_payments_beneficiary_legal_name?: string | null;
    faster_payments_beneficiary_postal_code?: string | null;
    faster_payments_beneficiary_state_province_region?: string | null;
    faster_payments_sort_code?: string | null;
    force_cpf_cnpj?: boolean | null;
    swift_ifsc_branch_code?: string | null;
};

export type CreateWireResponse = {
    id: string;
    type: "wire";
    name: string;
    beneficiary_name: string | null;
    routing_number: string | null;
    account_number: string | null;
    account_class: AccountClass | null;
    recipient_relationship: RecipientRelationship | null;
    address_line_1: string | null;
    address_line_2: string | null;
    city: string | null;
    state_province_region: string | null;
    country: Country | null;
    postal_code: string | null;
    created_at: string | null;
    faster_payments_account_number?: string | null;
    faster_payments_beneficiary_address_line_1?: string | null;
    faster_payments_beneficiary_address_line_2?: string | null;
    faster_payments_beneficiary_city?: string | null;
    faster_payments_beneficiary_country?: Country | null;
    faster_payments_beneficiary_legal_name?: string | null;
    faster_payments_beneficiary_postal_code?: string | null;
    faster_payments_beneficiary_state_province_region?: string | null;
    faster_payments_sort_code?: string | null;
    plaid_connected_at?: string | null;
    swift_ifsc_branch_code?: string | null;
};

export type CreateInternationalSwiftInput = {
    customer_id: string;
    name: string;
    account_class: AccountClass | null;
    recipient_relationship: RecipientRelationship | null;
    swift_account_holder_name: string | null;
    swift_account_number_iban: string | null;
    swift_bank_address_line_1: string | null;
    swift_bank_address_line_2?: string | null;
    swift_bank_city: string | null;
    swift_bank_country: Country | null;
    swift_bank_name: string | null;
    swift_bank_postal_code: string | null;
    swift_bank_state_province_region: string | null;
    swift_beneficiary_address_line_1: string | null;
    swift_beneficiary_address_line_2?: string | null;
    swift_beneficiary_city: string | null;
    swift_beneficiary_country: Country | null;
    swift_beneficiary_postal_code: string | null;
    swift_beneficiary_state_province_region: string | null;
    swift_code_bic: string | null;
    swift_intermediary_bank_account_number_iban?: string | null;
    swift_intermediary_bank_country?: Country | null;
    swift_intermediary_bank_name?: string | null;
    swift_intermediary_bank_swift_code_bic?: string | null;
    swift_intermediary_bank_routing_number?: string | null;
    swift_payment_code?: string | null;
    business_industry?: BusinessIndustry | null;
    phone_number?: string | null;
    tax_id?: string | null;
    date_of_birth?: string | null;
    faster_payments_account_number?: string | null;
    faster_payments_beneficiary_address_line_1?: string | null;
    faster_payments_beneficiary_address_line_2?: string | null;
    faster_payments_beneficiary_city?: string | null;
    faster_payments_beneficiary_country?: Country | null;
    faster_payments_beneficiary_legal_name?: string | null;
    faster_payments_beneficiary_postal_code?: string | null;
    faster_payments_beneficiary_state_province_region?: string | null;
    faster_payments_sort_code?: string | null;
    force_cpf_cnpj?: boolean | null;
    swift_ifsc_branch_code?: string | null;
};

export type CreateInternationalSwiftResponse = {
    id: string;
    type: "international_swift";
    name: string;
    beneficiary_name: string | null;
    account_class: AccountClass | null;
    recipient_relationship: RecipientRelationship | null;
    address_line_1: string | null;
    address_line_2: string | null;
    city: string | null;
    state_province_region: string | null;
    country: Country | null;
    postal_code: string | null;
    swift_code_bic: string | null;
    swift_account_holder_name: string | null;
    swift_account_number_iban: string | null;
    swift_beneficiary_address_line_1: string | null;
    swift_beneficiary_address_line_2: string | null;
    swift_beneficiary_country: Country | null;
    swift_beneficiary_city: string | null;
    swift_beneficiary_state_province_region: string | null;
    swift_beneficiary_postal_code: string | null;
    swift_bank_name: string | null;
    swift_bank_address_line_1: string | null;
    swift_bank_address_line_2: string | null;
    swift_bank_country: Country | null;
    swift_bank_city: string | null;
    swift_bank_state_province_region: string | null;
    swift_bank_postal_code: string | null;
    swift_intermediary_bank_swift_code_bic: string | null;
    swift_intermediary_bank_account_number_iban: string | null;
    swift_intermediary_bank_name: string | null;
    swift_intermediary_bank_country: Country | null;
    swift_intermediary_bank_routing_number?: string | null;
    swift_payment_code: string | null;
    created_at: string | null;
    faster_payments_account_number?: string | null;
    faster_payments_beneficiary_address_line_1?: string | null;
    faster_payments_beneficiary_address_line_2?: string | null;
    faster_payments_beneficiary_city?: string | null;
    faster_payments_beneficiary_country?: Country | null;
    faster_payments_beneficiary_legal_name?: string | null;
    faster_payments_beneficiary_postal_code?: string | null;
    faster_payments_beneficiary_state_province_region?: string | null;
    faster_payments_sort_code?: string | null;
    plaid_connected_at?: string | null;
    swift_ifsc_branch_code?: string | null;
};

export type CreateRtpInput = {
    customer_id: string;
    name: string;
    account_class: AccountClass | null;
    beneficiary_name: string | null;
    routing_number: string | null;
    account_number: string | null;
    recipient_relationship: RecipientRelationship | null;
    address_line_1: string | null;
    address_line_2?: string | null;
    city: string | null;
    state_province_region: string | null;
    country: Country | null;
    postal_code: string | null;
    business_industry?: BusinessIndustry | null;
    phone_number?: string | null;
    tax_id?: string | null;
    date_of_birth?: string | null;
    faster_payments_account_number?: string | null;
    faster_payments_beneficiary_address_line_1?: string | null;
    faster_payments_beneficiary_address_line_2?: string | null;
    faster_payments_beneficiary_city?: string | null;
    faster_payments_beneficiary_country?: Country | null;
    faster_payments_beneficiary_legal_name?: string | null;
    faster_payments_beneficiary_postal_code?: string | null;
    faster_payments_beneficiary_state_province_region?: string | null;
    faster_payments_sort_code?: string | null;
    force_cpf_cnpj?: boolean | null;
    swift_ifsc_branch_code?: string | null;
};

export type CreateRtpResponse = {
    id: string;
    type: "rtp";
    name: string;
    beneficiary_name: string | null;
    routing_number: string | null;
    account_number: string | null;
    account_class: AccountClass | null;
    recipient_relationship: RecipientRelationship | null;
    address_line_1: string | null;
    address_line_2: string | null;
    city: string | null;
    state_province_region: string | null;
    country: Country | null;
    postal_code: string | null;
    created_at: string | null;
    faster_payments_account_number?: string | null;
    faster_payments_beneficiary_address_line_1?: string | null;
    faster_payments_beneficiary_address_line_2?: string | null;
    faster_payments_beneficiary_city?: string | null;
    faster_payments_beneficiary_country?: Country | null;
    faster_payments_beneficiary_legal_name?: string | null;
    faster_payments_beneficiary_postal_code?: string | null;
    faster_payments_beneficiary_state_province_region?: string | null;
    faster_payments_sort_code?: string | null;
    plaid_connected_at?: string | null;
    swift_ifsc_branch_code?: string | null;
};

export type CreateSepaInput = {
    customer_id: string;
    name: string;
    account_class: AccountClass | null;
    sepa_iban: string | null;
    sepa_beneficiary_bic: string | null;
    sepa_beneficiary_legal_name: string | null;
    sepa_beneficiary_address_line_1: string | null;
    sepa_beneficiary_address_line_2?: string | null;
    sepa_beneficiary_city: string | null;
    sepa_beneficiary_state_province_region?: string | null;
    sepa_beneficiary_postal_code: string | null;
    sepa_beneficiary_country: Country | null;
    faster_payments_account_number?: string | null;
    faster_payments_beneficiary_address_line_1?: string | null;
    faster_payments_beneficiary_address_line_2?: string | null;
    faster_payments_beneficiary_city?: string | null;
    faster_payments_beneficiary_country?: Country | null;
    faster_payments_beneficiary_legal_name?: string | null;
    faster_payments_beneficiary_postal_code?: string | null;
    faster_payments_beneficiary_state_province_region?: string | null;
    faster_payments_sort_code?: string | null;
    force_cpf_cnpj?: boolean | null;
    swift_ifsc_branch_code?: string | null;
};

export type CreateSepaResponse = {
    id: string;
    type: "sepa";
    name: string;
    account_class: AccountClass | null;
    recipient_relationship: RecipientRelationship | null;
    sepa_iban: string | null;
    sepa_beneficiary_bic: string | null;
    sepa_beneficiary_legal_name: string | null;
    sepa_beneficiary_address_line_1: string | null;
    sepa_beneficiary_address_line_2: string | null;
    sepa_beneficiary_city: string | null;
    sepa_beneficiary_state_province_region: string | null;
    sepa_beneficiary_postal_code: string | null;
    sepa_beneficiary_country: Country | null;
    created_at: string | null;
    faster_payments_account_number?: string | null;
    faster_payments_beneficiary_address_line_1?: string | null;
    faster_payments_beneficiary_address_line_2?: string | null;
    faster_payments_beneficiary_city?: string | null;
    faster_payments_beneficiary_country?: Country | null;
    faster_payments_beneficiary_legal_name?: string | null;
    faster_payments_beneficiary_postal_code?: string | null;
    faster_payments_beneficiary_state_province_region?: string | null;
    faster_payments_sort_code?: string | null;
    plaid_connected_at?: string | null;
    swift_ifsc_branch_code?: string | null;
};

export type CreateTedInput = {
    customer_id: string;
    name: string;
    beneficiary_name: string | null;
    ted_bank_code: string | null;
    ted_branch_code: string | null;
    ted_cpf_cnpj: string | null;
    account_number: string | null;
    account_type: BankAccountType | null;
    faster_payments_account_number?: string | null;
    faster_payments_beneficiary_address_line_1?: string | null;
    faster_payments_beneficiary_address_line_2?: string | null;
    faster_payments_beneficiary_city?: string | null;
    faster_payments_beneficiary_country?: Country | null;
    faster_payments_beneficiary_legal_name?: string | null;
    faster_payments_beneficiary_postal_code?: string | null;
    faster_payments_beneficiary_state_province_region?: string | null;
    faster_payments_sort_code?: string | null;
    force_cpf_cnpj?: boolean | null;
    swift_ifsc_branch_code?: string | null;
};

export type CreateTedResponse = {
    id: string;
    type: "ted";
    name: string;
    beneficiary_name: string | null;
    ted_bank_code: string | null;
    ted_branch_code: string | null;
    ted_cpf_cnpj: string | null;
    account_number: string | null;
    account_type: BankAccountType | null;
    created_at: string | null;
    faster_payments_account_number?: string | null;
    faster_payments_beneficiary_address_line_1?: string | null;
    faster_payments_beneficiary_address_line_2?: string | null;
    faster_payments_beneficiary_city?: string | null;
    faster_payments_beneficiary_country?: Country | null;
    faster_payments_beneficiary_legal_name?: string | null;
    faster_payments_beneficiary_postal_code?: string | null;
    faster_payments_beneficiary_state_province_region?: string | null;
    faster_payments_sort_code?: string | null;
    plaid_connected_at?: string | null;
    swift_ifsc_branch_code?: string | null;
};

export type CreateFasterPaymentsInput = {
    customer_id: string;
    name: string;
    account_class: AccountClass | null;
    faster_payments_sort_code: string | null;
    faster_payments_account_number: string | null;
    faster_payments_beneficiary_legal_name: string | null;
    faster_payments_beneficiary_address_line_1: string | null;
    faster_payments_beneficiary_address_line_2?: string | null;
    faster_payments_beneficiary_city: string | null;
    faster_payments_beneficiary_state_province_region?: string | null;
    faster_payments_beneficiary_postal_code?: string | null;
    faster_payments_beneficiary_country: Country | null;
};

export type CreateFasterPaymentsResponse = {
    id: string;
    type: "faster_payments";
    name: string;
    account_class: AccountClass | null;
    faster_payments_sort_code: string | null;
    faster_payments_account_number: string | null;
    faster_payments_beneficiary_legal_name: string | null;
    faster_payments_beneficiary_address_line_1: string | null;
    faster_payments_beneficiary_address_line_2: string | null;
    faster_payments_beneficiary_city: string | null;
    faster_payments_beneficiary_state_province_region: string | null;
    faster_payments_beneficiary_postal_code: string | null;
    faster_payments_beneficiary_country: Country | null;
    created_at: string | null;
};

export type CreatePlaidBankAccountInput = {
    customer_id: string;
    redirect_url?: string | null;
};

export type CreatePlaidBankAccountResponse = {
    url: string;
};

export function createBankAccountsResource(instanceId: string, client: InternalApiClient) {
    return {
        list({
            customer_id,
            ...params
        }: ListBankAccountsInput): Promise<BlindpayApiResponse<ListBankAccountsResponse>> {
            const queryParams = Object.keys(params).length
                ? `?${new URLSearchParams(params as Record<string, string>)}`
                : "";
            return client.get(
                `/instances/${instanceId}/customers/${customer_id}/bank-accounts${queryParams}`
            );
        },
        get({
            customer_id,
            id,
        }: GetBankAccountInput): Promise<BlindpayApiResponse<GetBankAccountResponse>> {
            return client.get(
                `/instances/${instanceId}/customers/${customer_id}/bank-accounts/${id}`
            );
        },
        delete(
            { customer_id, id }: DeleteBankAccountInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<SuccessResponse>> {
            return client.delete(
                `/instances/${instanceId}/customers/${customer_id}/bank-accounts/${id}`,
                options
            );
        },
        createPix(
            { customer_id, ...data }: CreatePixInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<CreatePixResponse>> {
            return client.post(
                `/instances/${instanceId}/customers/${customer_id}/bank-accounts`,
                {
                    type: "pix",
                    ...data,
                },
                options
            );
        },
        createPixSafe(
            { customer_id, ...data }: CreatePixSafeInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<CreatePixSafeResponse>> {
            return client.post(
                `/instances/${instanceId}/customers/${customer_id}/bank-accounts`,
                {
                    type: "pix_safe",
                    ...data,
                },
                options
            );
        },
        createArgentinaTransfers(
            { customer_id, ...data }: CreateArgentinaTransfersInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<CreateArgentinaTransfersResponse>> {
            return client.post(
                `/instances/${instanceId}/customers/${customer_id}/bank-accounts`,
                {
                    type: "transfers_bitso",
                    ...data,
                },
                options
            );
        },
        createSpei(
            { customer_id, ...data }: CreateSpeiInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<CreateSpeiResponse>> {
            return client.post(
                `/instances/${instanceId}/customers/${customer_id}/bank-accounts`,
                {
                    type: "spei_bitso",
                    ...data,
                },
                options
            );
        },
        createColombiaAch(
            { customer_id, ...data }: CreateColombiaAchInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<CreateColombiaAchResponse>> {
            return client.post(
                `/instances/${instanceId}/customers/${customer_id}/bank-accounts`,
                {
                    type: "ach_cop_bitso",
                    ...data,
                },
                options
            );
        },
        createAch(
            { customer_id, ...data }: CreateAchInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<CreateAchResponse>> {
            return client.post(
                `/instances/${instanceId}/customers/${customer_id}/bank-accounts`,
                {
                    type: "ach",
                    ...data,
                },
                options
            );
        },
        createWire(
            { customer_id, ...data }: CreateWireInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<CreateWireResponse>> {
            return client.post(
                `/instances/${instanceId}/customers/${customer_id}/bank-accounts`,
                {
                    type: "wire",
                    ...data,
                },
                options
            );
        },
        createInternationalSwift(
            { customer_id, ...data }: CreateInternationalSwiftInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<CreateInternationalSwiftResponse>> {
            return client.post(
                `/instances/${instanceId}/customers/${customer_id}/bank-accounts`,
                {
                    type: "international_swift",
                    ...data,
                },
                options
            );
        },
        createRtp(
            { customer_id, ...data }: CreateRtpInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<CreateRtpResponse>> {
            return client.post(
                `/instances/${instanceId}/customers/${customer_id}/bank-accounts`,
                {
                    type: "rtp",
                    ...data,
                },
                options
            );
        },
        createTed(
            { customer_id, ...data }: CreateTedInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<CreateTedResponse>> {
            return client.post(
                `/instances/${instanceId}/customers/${customer_id}/bank-accounts`,
                {
                    type: "ted",
                    ...data,
                },
                options
            );
        },
        createSepa(
            { customer_id, ...data }: CreateSepaInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<CreateSepaResponse>> {
            return client.post(
                `/instances/${instanceId}/customers/${customer_id}/bank-accounts`,
                {
                    type: "sepa",
                    ...data,
                },
                options
            );
        },
        createFasterPayments(
            { customer_id, ...data }: CreateFasterPaymentsInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<CreateFasterPaymentsResponse>> {
            return client.post(
                `/instances/${instanceId}/customers/${customer_id}/bank-accounts`,
                {
                    type: "faster_payments",
                    ...data,
                },
                options
            );
        },

        createPlaid(
            { customer_id, ...data }: CreatePlaidBankAccountInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<CreatePlaidBankAccountResponse>> {
            return client.post(
                `/instances/${instanceId}/customers/${customer_id}/bank-accounts/plaid`,
                data,
                options
            );
        },
    };
}

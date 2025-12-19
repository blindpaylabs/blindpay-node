import type {
    AccountClass,
    AchCopDocument,
    ArgentinaTransfers,
    BankAccountType,
    BlindpayApiResponse,
    Country,
    Rail,
} from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";
import type { SpeiProtocol } from "../payouts";
export type ListBankAccountsInput = string;

export type ListBankAccountsResponse = {
    data: Array<{
        id: string;
        type: Rail;
        name: string;
        pix_key?: string;
        beneficiary_name?: string;
        routing_number?: string;
        account_number?: string;
        account_type?: BankAccountType;
        account_class?: AccountClass;
        address_line_1?: string;
        address_line_2?: string;
        city?: string;
        state_province_region?: string;
        country?: Country;
        postal_code?: string;
        spei_protocol?: string;
        spei_institution_code?: string;
        spei_clabe?: string;
        transfers_type?: "CVU" | "CBU" | "ALIAS";
        transfers_account?: string;
        ach_cop_beneficiary_first_name?: string;
        ach_cop_beneficiary_last_name?: string;
        ach_cop_document_id?: string;
        ach_cop_document_type?: AchCopDocument;
        ach_cop_email?: string;
        ach_cop_bank_code?: string;
        ach_cop_bank_account?: string;
        swift_code_bic?: string;
        swift_account_holder_name?: string;
        swift_account_number_iban?: string;
        swift_beneficiary_address_line_1?: string;
        swift_beneficiary_address_line_2?: string;
        swift_beneficiary_country?: Country;
        swift_beneficiary_city?: string;
        swift_beneficiary_state_province_region?: string;
        swift_beneficiary_postal_code?: string;
        swift_bank_name?: string;
        swift_bank_address_line_1?: string;
        swift_bank_address_line_2?: string;
        swift_bank_country?: Country;
        swift_bank_city?: string;
        swift_bank_state_province_region?: string;
        swift_bank_postal_code?: string;
        swift_intermediary_bank_swift_code_bic?: string;
        swift_intermediary_bank_account_number_iban?: string;
        swift_intermediary_bank_name?: string;
        swift_intermediary_bank_country?: Country;
        tron_wallet_hash?: string;
        offramp_wallets?: Array<{
            address: string;
            id: string;
            network: "tron";
            external_id: string;
        }>;
        created_at: string;
    }>;
};

export type GetBankAccountInput = {
    receiver_id: string;
    id: string;
};

export type GetBankAccountResponse = {
    id: string;
    receiver_id: string;
    account_holder_name: string;
    account_number: string;
    routing_number: string;
    account_type: BankAccountType;
    bank_name: string;
    swift_code?: string | null;
    iban?: string | null;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
};

export type DeleteBankAccountInput = {
    receiver_id: string;
    id: string;
};

export type CreatePixInput = {
    receiver_id: string;
    name: string;
    pix_key: string;
};

export type CreatePixResponse = {
    id: string;
    type: "pix";
    name: string;
    pix_key: string;
    created_at: string;
};

export type CreateArgentinaTransfersInput = {
    receiver_id: string;
    name: string;
    beneficiary_name: string;
    transfers_account: string;
    transfers_type: ArgentinaTransfers;
};

export type CreateArgentinaTransfersResponse = {
    id: string;
    type: "transfers_bitso";
    name: string;
    beneficiary_name: string;
    transfers_type: ArgentinaTransfers;
    transfers_account: string;
    created_at: string;
};

export type CreateSpeiInput = {
    receiver_id: string;
    beneficiary_name: string;
    name: string;
    spei_clabe: string;
    spei_institution_code: string;
    spei_protocol: SpeiProtocol;
};

export type CreateSpeiResponse = {
    id: string;
    type: "spei_bitso";
    name: string;
    beneficiary_name: string;
    spei_protocol: SpeiProtocol;
    spei_institution_code: string;
    spei_clabe: string;
    created_at: string;
};

export type CreateColombiaAchInput = {
    receiver_id: string;
    name: string;
    account_type: BankAccountType;
    ach_cop_beneficiary_first_name: string;
    ach_cop_beneficiary_last_name: string;
    ach_cop_document_id: string;
    ach_cop_document_type: AchCopDocument;
    ach_cop_email: string;
    ach_cop_bank_code: string;
    ach_cop_bank_account: string;
};

export type CreateColombiaAchResponse = {
    id: string;
    type: "ach_cop_bitso";
    name: string;
    account_type: BankAccountType;
    ach_cop_beneficiary_first_name: string;
    ach_cop_beneficiary_last_name: string;
    ach_cop_document_id: string;
    ach_cop_document_type: AchCopDocument;
    ach_cop_email: string;
    ach_cop_bank_code: string;
    ach_cop_bank_account: string;
    created_at: string;
};

export type CreateAchInput = {
    receiver_id: string;
    name: string;
    account_class: AccountClass;
    account_number: string;
    account_type: BankAccountType;
    beneficiary_name: string;
    routing_number: string;
};

export type CreateAchResponse = {
    id: string;
    type: "ach";
    name: string;
    beneficiary_name: string;
    routing_number: string;
    account_number: string;
    account_type: BankAccountType;
    account_class: AccountClass;
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
    created_at: string;
};

export type CreateWireInput = {
    receiver_id: string;
    name: string;
    account_number: string;
    beneficiary_name: string;
    routing_number: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state_province_region: string;
    country: Country;
    postal_code: string;
};

export type CreateWireResponse = {
    id: string;
    type: "wire";
    name: string;
    beneficiary_name: string;
    routing_number: string;
    account_number: string;
    address_line_1: string;
    address_line_2: string;
    city: string;
    state_province_region: string;
    country: Country;
    postal_code: string;
    created_at: string;
};

export type CreateInternationalSwiftInput = {
    receiver_id: string;
    name: string;
    swift_account_holder_name: string;
    swift_account_number_iban: string;
    swift_bank_address_line_1: string;
    swift_bank_address_line_2?: string;
    swift_bank_city: string;
    swift_bank_country: Country;
    swift_bank_name: string;
    swift_bank_postal_code: string;
    swift_bank_state_province_region: string;
    swift_beneficiary_address_line_1: string;
    swift_beneficiary_address_line_2?: string;
    swift_beneficiary_city: string;
    swift_beneficiary_country: Country;
    swift_beneficiary_postal_code: string;
    swift_beneficiary_state_province_region: string;
    swift_code_bic: string;
    swift_intermediary_bank_account_number_iban: string | null;
    swift_intermediary_bank_country: Country | null;
    swift_intermediary_bank_name: string | null;
    swift_intermediary_bank_swift_code_bic: string | null;
};

export type CreateInternationalSwiftResponse = {
    id: string;
    type: "international_swift";
    name: string;
    beneficiary_name: string | null;
    address_line_1: string | null;
    address_line_2: string | null;
    city: string | null;
    state_province_region: string | null;
    country: Country | null;
    postal_code: string | null;
    swift_code_bic: string;
    swift_account_holder_name: string;
    swift_account_number_iban: string;
    swift_beneficiary_address_line_1: string;
    swift_beneficiary_address_line_2: string | null;
    swift_beneficiary_country: Country;
    swift_beneficiary_city: string;
    swift_beneficiary_state_province_region: string;
    swift_beneficiary_postal_code: string;
    swift_bank_name: string;
    swift_bank_address_line_1: string;
    swift_bank_address_line_2: string | null;
    swift_bank_country: Country;
    swift_bank_city: string;
    swift_bank_state_province_region: string;
    swift_bank_postal_code: string;
    swift_intermediary_bank_swift_code_bic: string | null;
    swift_intermediary_bank_account_number_iban: string | null;
    swift_intermediary_bank_name: string | null;
    swift_intermediary_bank_country: Country | null;
    created_at: string;
};

export type CreateRtpInput = {
    receiver_id: string;
    name: string;
    beneficiary_name: string;
    routing_number: string;
    account_number: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state_province_region: string;
    country: Country;
    postal_code: string;
};

export type CreateRtpResponse = {
    id: string;
    type: "rtp";
    name: string;
    beneficiary_name: string;
    routing_number: string;
    account_number: string;
    address_line_1: string;
    address_line_2: string | null;
    city: string;
    state_province_region: string;
    country: Country;
    postal_code: string;
    created_at: string;
};

export function createBankAccountsResource(instanceId: string, client: InternalApiClient) {
    return {
        list(
            receiver_id: ListBankAccountsInput
        ): Promise<BlindpayApiResponse<ListBankAccountsResponse>> {
            return client.get(`/instances/${instanceId}/receivers/${receiver_id}/bank-accounts`);
        },
        get({
            receiver_id,
            id,
        }: GetBankAccountInput): Promise<BlindpayApiResponse<GetBankAccountResponse>> {
            return client.get(
                `/instances/${instanceId}/receivers/${receiver_id}/bank-accounts/${id}`
            );
        },
        delete({ receiver_id, id }: DeleteBankAccountInput): Promise<BlindpayApiResponse<void>> {
            return client.delete(
                `/instances/${instanceId}/receivers/${receiver_id}/bank-accounts/${id}`
            );
        },
        createPix({
            receiver_id,
            ...data
        }: CreatePixInput): Promise<BlindpayApiResponse<CreatePixResponse>> {
            return client.post(`/instances/${instanceId}/receivers/${receiver_id}/bank-accounts`, {
                type: "pix",
                ...data,
            });
        },
        createArgentinaTransfers({
            receiver_id,
            ...data
        }: CreateArgentinaTransfersInput): Promise<
            BlindpayApiResponse<CreateArgentinaTransfersResponse>
        > {
            return client.post(`/instances/${instanceId}/receivers/${receiver_id}/bank-accounts`, {
                type: "transfers_bitso",
                ...data,
            });
        },
        createSpei({
            receiver_id,
            ...data
        }: CreateSpeiInput): Promise<BlindpayApiResponse<CreateSpeiResponse>> {
            return client.post(`/instances/${instanceId}/receivers/${receiver_id}/bank-accounts`, {
                type: "spei_bitso",
                ...data,
            });
        },
        createColombiaAch({
            receiver_id,
            ...data
        }: CreateColombiaAchInput): Promise<BlindpayApiResponse<CreateColombiaAchResponse>> {
            return client.post(`/instances/${instanceId}/receivers/${receiver_id}/bank-accounts`, {
                type: "ach_cop_bitso",
                ...data,
            });
        },
        createAch({
            receiver_id,
            ...data
        }: CreateAchInput): Promise<BlindpayApiResponse<CreateAchResponse>> {
            return client.post(`/instances/${instanceId}/receivers/${receiver_id}/bank-accounts`, {
                type: "ach",
                ...data,
            });
        },
        createWire({
            receiver_id,
            ...data
        }: CreateWireInput): Promise<BlindpayApiResponse<CreateWireResponse>> {
            return client.post(`/instances/${instanceId}/receivers/${receiver_id}/bank-accounts`, {
                type: "wire",
                ...data,
            });
        },
        createInternationalSwift({
            receiver_id,
            ...data
        }: CreateInternationalSwiftInput): Promise<
            BlindpayApiResponse<CreateInternationalSwiftResponse>
        > {
            return client.post(`/instances/${instanceId}/receivers/${receiver_id}/bank-accounts`, {
                type: "international_swift",
                ...data,
            });
        },
        createRtp({
            receiver_id,
            ...data
        }: CreateRtpInput): Promise<BlindpayApiResponse<CreateRtpResponse>> {
            return client.post(`/instances/${instanceId}/receivers/${receiver_id}/bank-accounts`, {
                type: "rtp",
                ...data,
            });
        },
    };
}

import type {
    BlindpayApiResponse,
    KycStatus,
    Network,
    StablecoinToken,
    SuccessResponse,
} from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type BankingPartner =
    | "jpmorgan"
    | "citi"
    | "hsbc"
    | "cfsb"
    | "portage"
    | "bre_b"
    | "portage_g"
    | "spei";

export type SoleProprietorDocType = "master_service_agreement" | "salary_slip" | "bank_statement";

export type VirtualAccountUsAccountType = "Personal checking" | "Business checking";

export type VirtualAccount = {
    id: string;
    banking_partner: BankingPartner | null;
    kyc_status: KycStatus | null;
    us?: {
        ach?: {
            routing_number: string;
            account_number: string;
        } | null;
        wire: {
            routing_number: string;
            account_number: string;
        };
        rtp?: {
            routing_number: string;
            account_number: string;
        } | null;
        swift_bic_code?: string | null;
        swift_account_number?: string | null;
        account_type?: VirtualAccountUsAccountType | null;
        beneficiary?: {
            name: string;
            address_line_1: string;
            address_line_2: string;
        } | null;
        receiving_bank?: {
            name: string;
            address_line_1: string;
            address_line_2?: string | null;
        } | null;
        swift_receiving_bank?: {
            name?: string | null;
            address_line_1?: string | null;
            address_line_2?: string | null;
        } | null;
        swift_intermediary_bank?: {
            name?: string | null;
            swift_code_bic?: string | null;
            routing_number?: string | null;
            address_line_1?: string | null;
            address_line_2?: string | null;
        } | null;
    } | null;
    token: StablecoinToken;
    blockchain_wallet_id: string | null;
    blockchain_wallet: { network: Network; address?: string | null } | null;
    co?: {
        bre_b: {
            key: string;
        };
        beneficiary?: {
            name: string;
        } | null;
    } | null;
    mx?: {
        spei: {
            clabe: string;
        };
        beneficiary?: {
            name: string;
        } | null;
    } | null;
    partner_fee_id?: string | null;
    customer_id?: string | null;
};

export type ListVirtualAccountsInput = string;

export type ListVirtualAccountsResponse = VirtualAccount[];

export type CreateVirtualAccountInput = {
    customer_id: string;
    banking_partner: BankingPartner;
    token: StablecoinToken;
    blockchain_wallet_id: string;
    sole_proprietor_doc_type?: SoleProprietorDocType | null;
    sole_proprietor_doc_file?: string | null;
    bre_b?: {
        gender: "male" | "female";
    } | null;
    partner_fee_id?: string | null;
};

export type CreateVirtualAccountResponse = VirtualAccount;

export type GetVirtualAccountInput = {
    customer_id: string;
    id: string;
};

export type GetVirtualAccountResponse = VirtualAccount;

export type UpdateVirtualAccountInput = {
    customer_id: string;
    id: string;
    token: StablecoinToken;
    blockchain_wallet_id: string;
    partner_fee_id?: string | null;
};

export function createVirtualAccountsResource(instanceId: string, client: InternalApiClient) {
    return {
        list(
            customer_id: ListVirtualAccountsInput
        ): Promise<BlindpayApiResponse<ListVirtualAccountsResponse>> {
            return client.get(`/instances/${instanceId}/customers/${customer_id}/virtual-accounts`);
        },
        get({
            customer_id,
            id,
        }: GetVirtualAccountInput): Promise<BlindpayApiResponse<GetVirtualAccountResponse>> {
            return client.get(
                `/instances/${instanceId}/customers/${customer_id}/virtual-accounts/${id}`
            );
        },
        create({
            customer_id,
            ...data
        }: CreateVirtualAccountInput): Promise<BlindpayApiResponse<CreateVirtualAccountResponse>> {
            return client.post(
                `/instances/${instanceId}/customers/${customer_id}/virtual-accounts`,
                data
            );
        },
        update({
            customer_id,
            id,
            ...data
        }: UpdateVirtualAccountInput): Promise<BlindpayApiResponse<SuccessResponse>> {
            return client.put(
                `/instances/${instanceId}/customers/${customer_id}/virtual-accounts/${id}`,
                data
            );
        },
    };
}

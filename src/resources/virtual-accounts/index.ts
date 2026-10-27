import type { BlindpayApiResponse, KycStatus, Network, StablecoinToken } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type BankingPartner = "jpmorgan" | "citi" | "hsbc" | "cfsb" | "portage" | "ssb";

export type SoleProprietorDocType = "master_service_agreement" | "salary_slip" | "bank_statement";

export type VirtualAccount = {
    id: string;
    banking_partner: BankingPartner | null;
    kyc_status: KycStatus | null;
    us: {
        ach: {
            routing_number: string;
            account_number: string;
        };
        wire: {
            routing_number: string;
            account_number: string;
        };
        rtp: {
            routing_number: string;
            account_number: string;
        };
        swift_bic_code: string;
        swift_account_number?: string | null;
        account_type: string;
        beneficiary: {
            name: string;
            address_line_1: string;
            address_line_2: string;
        };
        receiving_bank: {
            name: string;
            address_line_1: string;
            address_line_2: string;
        };
        swift_receiving_bank?: {
            name: string | null;
            address_line_1: string | null;
            address_line_2: string | null;
        } | null;
    };
    token: StablecoinToken;
    blockchain_wallet_id: string | null;
    blockchain_wallet: { network: Network; address: string } | null;
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
};

export type BrebSenderDocumentType = "CC" | "CE" | "NIT" | "TI" | "PA";

export type SimulateSpeiDepositInput = {
    customer_id: string;
    id: string;
    amount: number;
    sender_name?: string | null;
    sender_clabe?: string | null;
    sender_rfc_curp?: string | null;
    deposit_id?: string | null;
};

export type SimulateSpeiDepositResponse = {
    success: boolean;
};

export type SimulateBrebDepositInput = {
    customer_id: string;
    id: string;
    amount: number;
    sender_name?: string | null;
    sender_document_type?: BrebSenderDocumentType | null;
    sender_document_id?: string | null;
    deposit_id?: string | null;
};

export type SimulateBrebDepositResponse = {
    success: boolean;
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
        }: UpdateVirtualAccountInput): Promise<BlindpayApiResponse<void>> {
            return client.put(
                `/instances/${instanceId}/customers/${customer_id}/virtual-accounts/${id}`,
                data
            );
        },
        /** Development instances only. Simulates an MXN deposit arriving on the virtual account's CLABE. */
        simulateSpeiDeposit({
            customer_id,
            id,
            ...data
        }: SimulateSpeiDepositInput): Promise<BlindpayApiResponse<SimulateSpeiDepositResponse>> {
            return client.post(
                `/instances/${instanceId}/customers/${customer_id}/virtual-accounts/${id}/simulate-spei-deposit`,
                data
            );
        },
        /** Development instances only. Simulates a COP deposit arriving on the virtual account's Bre-B key. */
        simulateBrebDeposit({
            customer_id,
            id,
            ...data
        }: SimulateBrebDepositInput): Promise<BlindpayApiResponse<SimulateBrebDepositResponse>> {
            return client.post(
                `/instances/${instanceId}/customers/${customer_id}/virtual-accounts/${id}/simulate-breb-deposit`,
                data
            );
        },
    };
}

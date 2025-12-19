import type { BlindpayApiResponse, Network, StablecoinToken } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type BankingPartner = "jpmorgan" | "citi";

export type VirtualAccount = {
    id: string;
    banking_partner: BankingPartner;
    kyc_status: string;
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
    };
    token: StablecoinToken;
    blockchain_wallet_id: string;
    blockchain_wallet: { network: Network; address: string } | null;
};

export type ListVirtualAccountsInput = string;

export type ListVirtualAccountsResponse = VirtualAccount[];

export type CreateVirtualAccountInput = {
    receiver_id: string;
    banking_partner: BankingPartner;
    token: StablecoinToken;
    blockchain_wallet_id: string;
};

export type CreateVirtualAccountResponse = VirtualAccount;

export type GetVirtualAccountInput = {
    receiver_id: string;
    id: string;
};

export type GetVirtualAccountResponse = VirtualAccount;

export type UpdateVirtualAccountInput = {
    receiver_id: string;
    id: string;
    token: StablecoinToken;
    blockchain_wallet_id: string;
};

export function createVirtualAccountsResource(instanceId: string, client: InternalApiClient) {
    return {
        list(
            receiver_id: ListVirtualAccountsInput
        ): Promise<BlindpayApiResponse<ListVirtualAccountsResponse>> {
            return client.get(`/instances/${instanceId}/receivers/${receiver_id}/virtual-accounts`);
        },
        get({
            receiver_id,
            id,
        }: GetVirtualAccountInput): Promise<BlindpayApiResponse<GetVirtualAccountResponse>> {
            return client.get(
                `/instances/${instanceId}/receivers/${receiver_id}/virtual-accounts/${id}`
            );
        },
        create({
            receiver_id,
            ...data
        }: CreateVirtualAccountInput): Promise<BlindpayApiResponse<CreateVirtualAccountResponse>> {
            return client.post(
                `/instances/${instanceId}/receivers/${receiver_id}/virtual-accounts`,
                data
            );
        },
        update({
            receiver_id,
            id,
            ...data
        }: UpdateVirtualAccountInput): Promise<BlindpayApiResponse<void>> {
            return client.put(
                `/instances/${instanceId}/receivers/${receiver_id}/virtual-accounts/${id}`,
                data
            );
        },
    };
}

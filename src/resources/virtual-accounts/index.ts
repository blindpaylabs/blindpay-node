import type { BlindpayApiResponse, StablecoinToken } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type VirtualAccount = {
    id: string;
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
};

export type CreateVirtualAccountInput = {
    receiver_id: string;
    blockchain_wallet_id: string;
    token: StablecoinToken;
};

export type CreateVirtualAccountResponse = VirtualAccount;

export type GetVirtualAccountInput = string;

export type GetVirtualAccountResponse = VirtualAccount;

export type UpdateVirtualAccountInput = {
    receiver_id: string;
    blockchain_wallet_id: string;
    token: StablecoinToken;
};

export function createVirtualAccountsResource(instanceId: string, client: InternalApiClient) {
    return {
        update({
            receiver_id,
            ...data
        }: UpdateVirtualAccountInput): Promise<BlindpayApiResponse<void>> {
            return client.put(
                `/instances/${instanceId}/receivers/${receiver_id}/virtual-accounts`,
                data
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
        get(
            receiver_id: GetVirtualAccountInput
        ): Promise<BlindpayApiResponse<GetVirtualAccountResponse>> {
            return client.get(`/instances/${instanceId}/receivers/${receiver_id}/virtual-accounts`);
        },
    };
}

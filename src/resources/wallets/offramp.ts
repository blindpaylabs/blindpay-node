import type { BlindpayApiResponse } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type OfframpWallet = {
    id: string;
    external_id: string;
    instance_id: string;
    receiver_id: string;
    bank_account_id: string;
    network: "tron";
    address: string;
    created_at: string;
    updated_at: string;
};

export type ListOfframpWalletsInput = {
    instanceId: string;
    receiverId: string;
    bankAccountId: string;
};

export type ListOfframpWalletsResponse = OfframpWallet[];

export type CreateOfframpWalletInput = {
    receiverId: string;
    instanceId: string;
    bankAccountId: string;

    external_id: string;
    network: "tron";
};

export type CreateOfframpWalletResponse = {
    id: string;
    external_id: string;
    network: "tron";
    address: string;
};

export type GetOfframpWalletInput = {
    receiverId: string;
    instanceId: string;
    bankAccountId: string;
    id: string;
};

export type GetOfframpWalletResponse = OfframpWallet;

export function createOfframpWalletsResource(client: InternalApiClient) {
    return {
        list({
            instanceId,
        }: ListOfframpWalletsInput): Promise<BlindpayApiResponse<ListOfframpWalletsResponse>> {
            return client.get(`/instances/${instanceId}/offramp_wallets`);
        },
        create({
            receiverId,
            instanceId,
            bankAccountId,
            ...data
        }: CreateOfframpWalletInput): Promise<BlindpayApiResponse<CreateOfframpWalletResponse>> {
            return client.post(
                `/instances/${instanceId}/receivers/${receiverId}/bank-accounts/${bankAccountId}/offramp_wallets`,
                data
            );
        },
        get({
            receiverId,
            instanceId,
            bankAccountId,
            id,
        }: GetOfframpWalletInput): Promise<BlindpayApiResponse<GetOfframpWalletResponse>> {
            return client.get(
                `/instances/${instanceId}/receivers/${receiverId}/bank-accounts/${bankAccountId}/offramp_wallets/${id}`
            );
        },
    };
}

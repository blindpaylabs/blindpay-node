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
    receiver_id: string;
    bank_account_id: string;
};

export type ListOfframpWalletsResponse = OfframpWallet[];

export type CreateOfframpWalletInput = {
    receiver_id: string;
    bank_account_id: string;
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
    receiver_id: string;
    bank_account_id: string;
    id: string;
};

export type GetOfframpWalletResponse = OfframpWallet;

export function createOfframpWalletsResource(instanceId: string, client: InternalApiClient) {
    return {
        list({
            bank_account_id,
            receiver_id,
        }: ListOfframpWalletsInput): Promise<BlindpayApiResponse<ListOfframpWalletsResponse>> {
            return client.get(
                `/instances/${instanceId}/receivers/${receiver_id}/bank-accounts/${bank_account_id}/offramp-wallets`
            );
        },
        create({
            receiver_id,
            bank_account_id,
            ...data
        }: CreateOfframpWalletInput): Promise<BlindpayApiResponse<CreateOfframpWalletResponse>> {
            return client.post(
                `/instances/${instanceId}/receivers/${receiver_id}/bank-accounts/${bank_account_id}/offramp-wallets`,
                data
            );
        },
        get({
            receiver_id,
            bank_account_id,
            id,
        }: GetOfframpWalletInput): Promise<BlindpayApiResponse<GetOfframpWalletResponse>> {
            return client.get(
                `/instances/${instanceId}/receivers/${receiver_id}/bank-accounts/${bank_account_id}/offramp-wallets/${id}`
            );
        },
    };
}

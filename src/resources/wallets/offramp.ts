import type { BlindpayApiResponse } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type OfframpWalletNetwork =
    | "tron"
    | "solana"
    | "arbitrum"
    | "arbitrum_sepolia"
    | "base"
    | "base_sepolia"
    | "ethereum"
    | "polygon"
    | "polygon_amoy"
    | "sepolia"
    | "solana_devnet";

export type OfframpWallet = {
    id: string;
    external_id: string;
    instance_id: string;
    customer_id: string;
    bank_account_id: string;
    network: OfframpWalletNetwork;
    address: string;
    created_at: string;
    updated_at: string;
    circle_wallet_id?: string | null;
};

export type ListOfframpWalletsInput = {
    customer_id: string;
    bank_account_id: string;
};

export type ListOfframpWalletsResponse = OfframpWallet[];

export type CreateOfframpWalletInput = {
    customer_id: string;
    bank_account_id: string;
    external_id?: string | null;
    network: OfframpWalletNetwork;
};

export type CreateOfframpWalletResponse = {
    id: string;
    external_id?: string | null;
    circle_wallet_id?: string | null;
    network: OfframpWalletNetwork;
    address: string;
};

export type GetOfframpWalletInput = {
    customer_id: string;
    bank_account_id: string;
    id: string;
};

export type GetOfframpWalletResponse = OfframpWallet;

export function createOfframpWalletsResource(instanceId: string, client: InternalApiClient) {
    return {
        list({
            bank_account_id,
            customer_id,
        }: ListOfframpWalletsInput): Promise<BlindpayApiResponse<ListOfframpWalletsResponse>> {
            return client.get(
                `/instances/${instanceId}/customers/${customer_id}/bank-accounts/${bank_account_id}/offramp-wallets`
            );
        },
        create({
            customer_id,
            bank_account_id,
            ...data
        }: CreateOfframpWalletInput): Promise<BlindpayApiResponse<CreateOfframpWalletResponse>> {
            return client.post(
                `/instances/${instanceId}/customers/${customer_id}/bank-accounts/${bank_account_id}/offramp-wallets`,
                data
            );
        },
        get({
            customer_id,
            bank_account_id,
            id,
        }: GetOfframpWalletInput): Promise<BlindpayApiResponse<GetOfframpWalletResponse>> {
            return client.get(
                `/instances/${instanceId}/customers/${customer_id}/bank-accounts/${bank_account_id}/offramp-wallets/${id}`
            );
        },
    };
}

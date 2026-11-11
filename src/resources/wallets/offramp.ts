import type { BlindpayApiResponse, RequestOptions, SuccessResponse } from "../../../types";
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
    | "arc"
    | "arc_testnet"
    | "tempo"
    | "tempo_testnet"
    | "solana_devnet";

export type OfframpWallet = {
    id: string;
    external_id: string | null;
    instance_id: string;
    customer_id: string;
    bank_account_id: string;
    network: OfframpWalletNetwork;
    address: string;
    created_at: string | null;
    updated_at: string | null;
    circle_wallet_id?: string | null;
    partner_fee_id?: string | null;
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
    partner_fee_id?: string | null;
};

export type CreateOfframpWalletResponse = {
    id: string;
    external_id?: string | null;
    circle_wallet_id?: string | null;
    network: OfframpWalletNetwork;
    address: string;
    partner_fee_id?: string | null;
};

export type GetOfframpWalletInput = {
    customer_id: string;
    bank_account_id: string;
    id: string;
};

export type GetOfframpWalletResponse = OfframpWallet;

export type UpdateOfframpWalletInput = {
    customer_id: string;
    bank_account_id: string;
    id: string;
    /** Omit to leave the partner fee unchanged; `null` removes it. */
    partner_fee_id?: string | null;
};

export type UpdateOfframpWalletResponse = SuccessResponse;

export function createOfframpWalletsResource(instanceId: string, client: InternalApiClient) {
    return {
        list(
            { bank_account_id, customer_id }: ListOfframpWalletsInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<ListOfframpWalletsResponse>> {
            return client.get(
                `/instances/${instanceId}/customers/${encodeURIComponent(customer_id)}/bank-accounts/${encodeURIComponent(bank_account_id)}/offramp-wallets`,
                options
            );
        },
        create(
            { customer_id, bank_account_id, ...data }: CreateOfframpWalletInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<CreateOfframpWalletResponse>> {
            return client.post(
                `/instances/${instanceId}/customers/${encodeURIComponent(customer_id)}/bank-accounts/${encodeURIComponent(bank_account_id)}/offramp-wallets`,
                data,
                options
            );
        },
        get(
            { customer_id, bank_account_id, id }: GetOfframpWalletInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<GetOfframpWalletResponse>> {
            return client.get(
                `/instances/${instanceId}/customers/${encodeURIComponent(customer_id)}/bank-accounts/${encodeURIComponent(bank_account_id)}/offramp-wallets/${encodeURIComponent(id)}`,
                options
            );
        },

        update(
            { customer_id, bank_account_id, id, ...data }: UpdateOfframpWalletInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<UpdateOfframpWalletResponse>> {
            return client.put(
                `/instances/${instanceId}/customers/${encodeURIComponent(customer_id)}/bank-accounts/${encodeURIComponent(bank_account_id)}/offramp-wallets/${encodeURIComponent(id)}`,
                data,
                options
            );
        },
    };
}

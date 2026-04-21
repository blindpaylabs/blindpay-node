import type { BlindpayApiResponse, Network, StablecoinToken } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type CustodialWallet = {
    id: string;
    name: string;
    external_id: string | null;
    address: string | null;
    network: Network;
    created_at: string;
};

export type CreateCustodialWalletInput = {
    receiver_id: string;
    name: string;
    network: Network;
    external_id?: string | null;
};

export type CreateCustodialWalletResponse = CustodialWallet;

export type ListCustodialWalletsInput = string;

export type ListCustodialWalletsResponse = CustodialWallet[];

export type GetCustodialWalletInput = {
    receiver_id: string;
    id: string;
};

export type GetCustodialWalletResponse = CustodialWallet;

export type WalletTokenBalance = {
    address: string;
    id: string;
    symbol: StablecoinToken;
    amount: number;
};

export type GetCustodialWalletBalanceInput = {
    receiver_id: string;
    id: string;
};

export type GetCustodialWalletBalanceResponse = {
    USDC: WalletTokenBalance;
    USDT: WalletTokenBalance;
    USDB: WalletTokenBalance;
};

export type DeleteCustodialWalletInput = {
    receiver_id: string;
    id: string;
};

export function createCustodialWalletsResource(instanceId: string, client: InternalApiClient) {
    return {
        list(
            receiver_id: ListCustodialWalletsInput
        ): Promise<BlindpayApiResponse<ListCustodialWalletsResponse>> {
            return client.get(`/instances/${instanceId}/receivers/${receiver_id}/wallets`);
        },
        get({
            receiver_id,
            id,
        }: GetCustodialWalletInput): Promise<BlindpayApiResponse<GetCustodialWalletResponse>> {
            return client.get(`/instances/${instanceId}/receivers/${receiver_id}/wallets/${id}`);
        },
        create({
            receiver_id,
            ...data
        }: CreateCustodialWalletInput): Promise<
            BlindpayApiResponse<CreateCustodialWalletResponse>
        > {
            return client.post(`/instances/${instanceId}/receivers/${receiver_id}/wallets`, data);
        },
        getBalance({
            receiver_id,
            id,
        }: GetCustodialWalletBalanceInput): Promise<
            BlindpayApiResponse<GetCustodialWalletBalanceResponse>
        > {
            return client.get(
                `/instances/${instanceId}/receivers/${receiver_id}/wallets/${id}/balance`
            );
        },
        delete({
            receiver_id,
            id,
        }: DeleteCustodialWalletInput): Promise<BlindpayApiResponse<{ success: boolean }>> {
            return client.delete(`/instances/${instanceId}/receivers/${receiver_id}/wallets/${id}`);
        },
    };
}

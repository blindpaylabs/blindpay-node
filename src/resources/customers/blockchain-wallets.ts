import type { BlindpayApiResponse, Network, PaginationMetadata, PaginationParams } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type BlockchainWallet = {
    id: string;
    name: string;
    network: Network;
    address: string | null;
    signature_tx_hash: string | null;
    is_account_abstraction: boolean | null;
    receiver_id: string;
};

export type CreateBlockchainWalletInput = {
    name: string;
    network: Network;
    signature_tx_hash?: string | null;
    address?: string | null;
    is_account_abstraction?: boolean | null;
};

export type CreateBlockchainWalletResponse = BlockchainWallet;

export type ListBlockchainWalletsInput = PaginationParams;

export type ListBlockchainWalletsResponse = {
    data: BlockchainWallet[];
    pagination: PaginationMetadata;
};

export type GetBlockchainWalletInput = string;

export type GetBlockchainWalletResponse = BlockchainWallet;

export type DeleteBlockchainWalletInput = string;

export type BlockchainWalletMessage = {
    message: string;
};

export type GetBlockchainWalletMessageResponse = BlockchainWalletMessage;

export function createCustomerBlockchainWalletsResource(instanceId: string, client: InternalApiClient) {
    return {
        list(
            customer_id: string,
            params?: ListBlockchainWalletsInput
        ): Promise<BlindpayApiResponse<ListBlockchainWalletsResponse>> {
            const queryParams = params ? `?${new URLSearchParams(params)}` : "";
            return client.get(
                `/instances/${instanceId}/customers/${customer_id}/blockchain-wallets${queryParams}`
            );
        },
        create(
            customer_id: string,
            data: CreateBlockchainWalletInput
        ): Promise<BlindpayApiResponse<CreateBlockchainWalletResponse>> {
            return client.post(
                `/instances/${instanceId}/customers/${customer_id}/blockchain-wallets`,
                {
                    ...data,
                }
            );
        },
        get(
            customer_id: string,
            blockchain_wallet_id: GetBlockchainWalletInput
        ): Promise<BlindpayApiResponse<GetBlockchainWalletResponse>> {
            return client.get(
                `/instances/${instanceId}/customers/${customer_id}/blockchain-wallets/${blockchain_wallet_id}`
            );
        },
        delete(
            customer_id: string,
            blockchain_wallet_id: DeleteBlockchainWalletInput
        ): Promise<BlindpayApiResponse<void>> {
            return client.delete(
                `/instances/${instanceId}/customers/${customer_id}/blockchain-wallets/${blockchain_wallet_id}`
            );
        },
        getSignMessage(
            customer_id: string
        ): Promise<BlindpayApiResponse<GetBlockchainWalletMessageResponse>> {
            return client.get(
                `/instances/${instanceId}/customers/${customer_id}/blockchain-wallets/sign-message`
            );
        },
    };
}
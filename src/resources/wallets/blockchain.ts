import type { BlindpayApiResponse, Network } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type GetBlockchainWalletMessage = string;

export type GetBlockchainWalletMessageResponse = {
    message: string;
};

export type ListBlockchainWalletsInput = string;

export type ListBlockchainWalletsResponse = Array<{
    id: string;
    name: string;
    network: Network;
    address?: string;
    signature_tx_hash?: string;
    is_account_abstraction: boolean;
    customer_id: string;
}>;

export type CreateBlockchainWalletWithAddressInput = {
    customer_id: string;
    name: string;
    network: Network;
    address: string;
};

export type CreateBlockchainWalletWithHashInput = {
    customer_id: string;
    name: string;
    network: Network;
    signature_tx_hash: string;
};

export type GetBlockchainWalletInput = {
    customer_id: string;
    id: string;
};

export type DeleteBlockchainWalletInput = {
    customer_id: string;
    id: string;
};

export type GetBlockchainWalletResponse = {
    id: string;
    name: string;
    network: Network;
    address?: string;
    signature_tx_hash?: string;
    is_account_abstraction: boolean;
    customer_id: string;
};

export type CreateBlockchainWalletResponse = {
    id: string;
    name: string;
    network: Network;
    address?: string;
    signature_tx_hash?: string;
    is_account_abstraction: boolean;
    customer_id: string;
};

export type CreateAssetTrustlineInput = string;

export type CreateAssetTrustlineResponse = {
    xdr: string;
};

export type MintUsdbStellarInput = {
    address: string;
    amount: string;
    signedXdr: string;
};

export type PrepareSolanaDelegationTransactionInput = {
    token_address: string;
    amount: string;
    owner_address: string;
};

export type PrepareSolanaDelegationTransactionResponse = {
    success: boolean;
    transaction: string;
};

export type MintUsdbSolanaInput = {
    address: string;
    amount: string;
};

export type MintUsdbSolanaResponse = {
    success: boolean;
    signature: string;
    error: string;
};

export function createBlockchainWalletsResource(instanceId: string, client: InternalApiClient) {
    return {
        list(
            customer_id: ListBlockchainWalletsInput
        ): Promise<BlindpayApiResponse<ListBlockchainWalletsResponse>> {
            return client.get(
                `/instances/${instanceId}/customers/${customer_id}/blockchain-wallets`
            );
        },
        createWithAddress({
            customer_id,
            ...data
        }: CreateBlockchainWalletWithAddressInput): Promise<
            BlindpayApiResponse<CreateBlockchainWalletResponse>
        > {
            return client.post(
                `/instances/${instanceId}/customers/${customer_id}/blockchain-wallets`,
                {
                    ...data,
                    is_account_abstraction: true,
                }
            );
        },
        createWithHash({
            customer_id,
            ...data
        }: CreateBlockchainWalletWithHashInput): Promise<
            BlindpayApiResponse<CreateBlockchainWalletResponse>
        > {
            return client.post(
                `/instances/${instanceId}/customers/${customer_id}/blockchain-wallets`,
                {
                    ...data,
                    is_account_abstraction: false,
                }
            );
        },
        getWalletMessage(
            customer_id: GetBlockchainWalletMessage
        ): Promise<BlindpayApiResponse<GetBlockchainWalletMessageResponse>> {
            return client.get(
                `/instances/${instanceId}/customers/${customer_id}/blockchain-wallets/sign-message`
            );
        },
        get({
            customer_id,
            id,
        }: GetBlockchainWalletInput): Promise<BlindpayApiResponse<GetBlockchainWalletResponse>> {
            return client.get(
                `/instances/${instanceId}/customers/${customer_id}/blockchain-wallets/${id}`
            );
        },
        delete({
            customer_id,
            id,
        }: DeleteBlockchainWalletInput): Promise<BlindpayApiResponse<void>> {
            return client.delete(
                `/instances/${instanceId}/customers/${customer_id}/blockchain-wallets/${id}`
            );
        },
        createAssetTrustline(
            address: CreateAssetTrustlineInput
        ): Promise<BlindpayApiResponse<CreateAssetTrustlineResponse>> {
            return client.post(`/instances/${instanceId}/create-asset-trustline`, {
                address,
            });
        },
        mintUsdbStellar({ ...data }: MintUsdbStellarInput): Promise<BlindpayApiResponse<void>> {
            return client.post(`/instances/${instanceId}/mint-usdb-stellar`, data);
        },
        mintUsdbSolana({ ...data }: MintUsdbSolanaInput): Promise<BlindpayApiResponse<void>> {
            return client.post(`/instances/${instanceId}/mint-usdb-solana`, data);
        },
        prepareSolanaDelegationTransaction({
            ...data
        }: PrepareSolanaDelegationTransactionInput): Promise<
            BlindpayApiResponse<PrepareSolanaDelegationTransactionResponse>
        > {
            return client.post(`/instances/${instanceId}/prepare-delegate-solana`, data);
        },
    };
}

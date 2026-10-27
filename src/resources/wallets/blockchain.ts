import type { BlindpayApiResponse, Network, RequestOptions, SuccessResponse } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type GetBlockchainWalletMessage = string;

export type GetBlockchainWalletMessageResponse = {
    message: string;
};

export type ListBlockchainWalletsInput = string;

export type ListBlockchainWalletsResponse = Array<{
    id: string;
    name: string | null;
    network: Network | null;
    address?: string | null;
    signature_tx_hash?: string | null;
    is_account_abstraction: boolean | null;
    is_self_custody: boolean | null;
    customer_id: string;
}>;

export type CreateBlockchainWalletWithAddressInput = {
    customer_id: string;
    name: string;
    network: Network;
    address: string | null;
    is_self_custody?: boolean;
};

export type CreateBlockchainWalletWithHashInput = {
    customer_id: string;
    name: string;
    network: Network;
    signature_tx_hash: string | null;
    is_self_custody?: boolean;
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
    name: string | null;
    network: Network | null;
    address?: string | null;
    signature_tx_hash?: string | null;
    is_account_abstraction: boolean | null;
    is_self_custody: boolean | null;
    customer_id: string;
};

export type CreateBlockchainWalletResponse = {
    id: string;
    name: string | null;
    network: Network | null;
    address?: string | null;
    signature_tx_hash?: string | null;
    is_account_abstraction: boolean | null;
    is_self_custody: boolean | null;
    customer_id: string;
};

export type SetBlockchainWalletSelfCustodyInput = {
    customer_id: string;
    id: string;
    is_self_custody: boolean;
};

export type SetBlockchainWalletSelfCustodyResponse = GetBlockchainWalletResponse;

export type CreateAssetTrustlineInput = string;

export type CreateAssetTrustlineResponse = {
    xdr: string;
};

export type MintUsdbStellarInput = {
    address: string;
    amount: string;
    signedXdr?: string;
};

export type PrepareSolanaDelegationTransactionInput = {
    owner_address: string;
    quote_id?: string;
    token_address?: string;
    amount?: string;
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
    signature?: string;
    error?: string;
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
        createWithAddress(
            { customer_id, ...data }: CreateBlockchainWalletWithAddressInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<CreateBlockchainWalletResponse>> {
            return client.post(
                `/instances/${instanceId}/customers/${customer_id}/blockchain-wallets`,
                {
                    ...data,
                    is_account_abstraction: true,
                },
                options
            );
        },
        createWithHash(
            { customer_id, ...data }: CreateBlockchainWalletWithHashInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<CreateBlockchainWalletResponse>> {
            return client.post(
                `/instances/${instanceId}/customers/${customer_id}/blockchain-wallets`,
                {
                    ...data,
                    is_account_abstraction: false,
                },
                options
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
        delete(
            { customer_id, id }: DeleteBlockchainWalletInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<SuccessResponse>> {
            return client.delete(
                `/instances/${instanceId}/customers/${customer_id}/blockchain-wallets/${id}`,
                options
            );
        },
        setSelfCustody(
            { customer_id, id, ...data }: SetBlockchainWalletSelfCustodyInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<SetBlockchainWalletSelfCustodyResponse>> {
            return client.patch(
                `/instances/${instanceId}/customers/${customer_id}/blockchain-wallets/${id}`,
                data,
                options
            );
        },
        createAssetTrustline(
            address: CreateAssetTrustlineInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<CreateAssetTrustlineResponse>> {
            return client.post(
                `/instances/${instanceId}/create-asset-trustline`,
                {
                    address,
                },
                options
            );
        },
        mintUsdbStellar(
            { ...data }: MintUsdbStellarInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<SuccessResponse>> {
            return client.post(`/instances/${instanceId}/mint-usdb-stellar`, data, options);
        },
        mintUsdbSolana(
            { ...data }: MintUsdbSolanaInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<MintUsdbSolanaResponse>> {
            return client.post(`/instances/${instanceId}/mint-usdb-solana`, data, options);
        },
        prepareSolanaDelegationTransaction(
            { ...data }: PrepareSolanaDelegationTransactionInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<PrepareSolanaDelegationTransactionResponse>> {
            return client.post(`/instances/${instanceId}/prepare-delegate-solana`, data, options);
        },
    };
}

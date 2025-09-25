import type { BlindpayApiResponse, Network } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type GetBlockchainWalletMessage = {
    receiverId: string;
    instanceId: string;
};

export type GetBlockchainWalletMessageResponse = {
    message: string;
};

export type ListBlockchainWalletsInput = {
    instanceId: string;
    receiverId: string;
};

export type ListBlockchainWalletsResponse = Array<{
    id: string;
    name: string;
    network: Network;
    address?: string;
    signature_tx_hash?: string;
    is_account_abstraction: boolean;
    receiver_id: string;
}>;

export type CreateBlockchainWalletInput = {
    instanceId: string;
    receiverId: string;

    name: string;
    network: Network;
    address: string;
    is_account_abstraction?: boolean;
    signature_tx_hash?: string;
};

export type GetBlockchainWalletInput = {
    instanceId: string;
    receiverId: string;
    id: string;
};

export type DeleteBlockchainWalletInput = {
    instanceId: string;
    receiverId: string;
    id: string;
};

export type GetBlockchainWalletResponse = {
    id: string;
    name: string;
    network: Network;
    address?: string;
    signature_tx_hash?: string;
    is_account_abstraction: boolean;
    receiver_id: string;
};

export type CreateBlockchainWalletResponse = {
    id: string;
    name: string;
    network: Network;
    address?: string;
    signature_tx_hash?: string;
    is_account_abstraction: boolean;
    receiver_id: string;
};

export type CreateAssetTrustlineInput = {
    instanceId: string;
    address: string;
};

export type CreateAssetTrustlineResponse = {
    xdr: string;
};

export type MintUsdbStellarInput = {
    instanceId: string;
    address: string;
    amount: string;
    signedXdr: string;
};

export function createBlockchainWalletsResource(client: InternalApiClient) {
    return {
        list({
            instanceId,
            receiverId,
        }: ListBlockchainWalletsInput): Promise<
            BlindpayApiResponse<ListBlockchainWalletsResponse>
        > {
            return client.get(
                `/instances/${instanceId}/receivers/${receiverId}/blockchain-wallets`
            );
        },
        create({
            instanceId,
            ...data
        }: CreateBlockchainWalletInput): Promise<
            BlindpayApiResponse<CreateBlockchainWalletResponse>
        > {
            return client.post(`/instances/${instanceId}/blockchain-wallets`, data);
        },
        getWalletMessage({
            receiverId,
            instanceId,
        }: GetBlockchainWalletMessage): Promise<
            BlindpayApiResponse<GetBlockchainWalletMessageResponse>
        > {
            return client.get(
                `/instances/${instanceId}/receivers/${receiverId}/blockchain-wallets/sign-message`
            );
        },
        get({
            instanceId,
            receiverId,
            id,
        }: GetBlockchainWalletInput): Promise<BlindpayApiResponse<GetBlockchainWalletResponse>> {
            return client.get(
                `/instances/${instanceId}/receivers/${receiverId}/blockchain-wallets/${id}`
            );
        },
        delete({
            instanceId,
            receiverId,
            id,
        }: DeleteBlockchainWalletInput): Promise<BlindpayApiResponse<void>> {
            return client.delete(
                `/instances/${instanceId}/receivers/${receiverId}/blockchain-wallets/${id}`
            );
        },
        createAssetTrustline({
            instanceId,
            ...data
        }: CreateAssetTrustlineInput): Promise<BlindpayApiResponse<CreateAssetTrustlineResponse>> {
            return client.post(`/instances/${instanceId}/create-asset-trustline`, data);
        },
        mintUsdbStellar({
            instanceId,
            ...data
        }: MintUsdbStellarInput): Promise<BlindpayApiResponse<void>> {
            return client.post(`/instances/${instanceId}/mint-usdb-stellar`, data);
        },
    };
}

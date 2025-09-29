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
    receiver_id: string;
}>;

export type CreateBlockchainWalletWithAddressInput = {
    receiver_id: string;
    name: string;
    network: Network;
    address: string;
};

export type CreateBlockchainWalletWithHashInput = {
    receiver_id: string;
    name: string;
    network: Network;
    signature_tx_hash: string;
};

export type GetBlockchainWalletInput = {
    receiver_id: string;
    id: string;
};

export type DeleteBlockchainWalletInput = {
    receiver_id: string;
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

export type CreateAssetTrustlineInput = string;

export type CreateAssetTrustlineResponse = {
    xdr: string;
};

export type MintUsdbStellarInput = {
    address: string;
    amount: string;
    signedXdr: string;
};

export function createBlockchainWalletsResource(instanceId: string, client: InternalApiClient) {
    return {
        list(
            receiver_id: ListBlockchainWalletsInput
        ): Promise<BlindpayApiResponse<ListBlockchainWalletsResponse>> {
            return client.get(
                `/instances/${instanceId}/receivers/${receiver_id}/blockchain-wallets`
            );
        },
        createWithAddress({
            receiver_id,
            ...data
        }: CreateBlockchainWalletWithAddressInput): Promise<
            BlindpayApiResponse<CreateBlockchainWalletResponse>
        > {
            return client.post(
                `/instances/${instanceId}/receivers/${receiver_id}/blockchain-wallets`,
                {
                    ...data,
                    is_account_abstraction: true,
                }
            );
        },
        createWithHash({
            receiver_id,
            ...data
        }: CreateBlockchainWalletWithHashInput): Promise<
            BlindpayApiResponse<CreateBlockchainWalletResponse>
        > {
            return client.post(
                `/instances/${instanceId}/receivers/${receiver_id}/blockchain-wallets`,
                {
                    ...data,
                    is_account_abstraction: false,
                }
            );
        },
        getWalletMessage(
            receiver_id: GetBlockchainWalletMessage
        ): Promise<BlindpayApiResponse<GetBlockchainWalletMessageResponse>> {
            return client.get(
                `/instances/${instanceId}/receivers/${receiver_id}/blockchain-wallets/sign-message`
            );
        },
        get({
            receiver_id,
            id,
        }: GetBlockchainWalletInput): Promise<BlindpayApiResponse<GetBlockchainWalletResponse>> {
            return client.get(
                `/instances/${instanceId}/receivers/${receiver_id}/blockchain-wallets/${id}`
            );
        },
        delete({
            receiver_id,
            id,
        }: DeleteBlockchainWalletInput): Promise<BlindpayApiResponse<void>> {
            return client.delete(
                `/instances/${instanceId}/receivers/${receiver_id}/blockchain-wallets/${id}`
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
    };
}

import type { BlindpayApiResponse } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type ListPartnerFeesInput = {
    instanceId: string;
};

export type ListPartnerFeesResponse = Array<{
    id: string;
    instance_id: string;
    name: string;
    payout_percentage_fee: number;
    payout_flat_fee: number;
    payin_percentage_fee: number;
    payin_flat_fee: number;
    evm_wallet_address: string;
    stellar_wallet_address: string;
}>;

export type CreatePartnerFeeInput = {
    instanceId: string;
    virtual_account_set?: boolean | null;
    evm_wallet_address: string;
    name: string;
    payin_flat_fee: number;
    payin_percentage_fee: number;
    payout_flat_fee: number;
    payout_percentage_fee: number;
    stellar_wallet_address?: string | null;
};

export type CreatePartnerFeeResponse = {
    id: string;
    instance_id: string;
    name: string;
    payout_percentage_fee: number;
    payout_flat_fee: number;
    payin_percentage_fee: number;
    payin_flat_fee: number;
    evm_wallet_address?: string;
    stellar_wallet_address?: string;
};

export type GetPartnerFeeInput = {
    instanceId: string;
    id: string;
};

export type GetPartnerFeeResponse = {
    id: string;
    instance_id: string;
    evm_wallet_address: string;
    name: string;
    payin_flat_fee: number;
    payin_percentage_fee: number;
    payout_flat_fee: number;
    payout_percentage_fee: number;
    stellar_wallet_address?: string | null;
};

export type DeletePartnerFeeInput = {
    instanceId: string;
    id: string;
};

export function createPartnerFeesResource(client: InternalApiClient) {
    return {
        list({
            instanceId,
        }: ListPartnerFeesInput): Promise<BlindpayApiResponse<ListPartnerFeesResponse>> {
            return client.get(`/instances/${instanceId}/partner-fees`);
        },
        create({
            instanceId,
            ...data
        }: CreatePartnerFeeInput): Promise<BlindpayApiResponse<CreatePartnerFeeResponse>> {
            return client.post(`/instances/${instanceId}/partner-fees`, data);
        },
        get({
            instanceId,
            id,
        }: GetPartnerFeeInput): Promise<BlindpayApiResponse<GetPartnerFeeResponse>> {
            return client.get(`/instances/${instanceId}/partner-fees/${id}`);
        },
        delete({ instanceId, id }: DeletePartnerFeeInput): Promise<BlindpayApiResponse<void>> {
            return client.delete(`/instances/${instanceId}/partner-fees/${id}`);
        },
    };
}

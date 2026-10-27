import type { BlindpayApiResponse, RequestOptions, SuccessResponse } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type ListPartnerFeesResponse = Array<{
    id: string;
    instance_id: string;
    name: string;
    payout_percentage_fee: number;
    payout_flat_fee: number;
    payin_percentage_fee: number;
    payin_flat_fee: number;
}>;

export type CreatePartnerFeeInput = {
    virtual_account_set?: boolean | null;
    name: string;
    payin_flat_fee: number;
    payin_percentage_fee: number;
    payout_flat_fee: number;
    payout_percentage_fee: number;
};

export type CreatePartnerFeeResponse = {
    id: string;
    instance_id: string;
    name: string;
    payout_percentage_fee: number;
    payout_flat_fee: number;
    payin_percentage_fee: number;
    payin_flat_fee: number;
};

export type GetPartnerFeeInput = string;

export type GetPartnerFeeResponse = {
    id: string;
    instance_id: string;
    name: string;
    payin_flat_fee: number;
    payin_percentage_fee: number;
    payout_flat_fee: number;
    payout_percentage_fee: number;
};

export type DeletePartnerFeeInput = string;

export function createPartnerFeesResource(instanceId: string, client: InternalApiClient) {
    return {
        list(): Promise<BlindpayApiResponse<ListPartnerFeesResponse>> {
            return client.get(`/instances/${instanceId}/partner-fees`);
        },
        create(
            { ...data }: CreatePartnerFeeInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<CreatePartnerFeeResponse>> {
            return client.post(`/instances/${instanceId}/partner-fees`, data, options);
        },
        get(id: GetPartnerFeeInput): Promise<BlindpayApiResponse<GetPartnerFeeResponse>> {
            return client.get(`/instances/${instanceId}/partner-fees/${id}`);
        },
        delete(
            id: DeletePartnerFeeInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<SuccessResponse>> {
            return client.delete(`/instances/${instanceId}/partner-fees/${id}`, options);
        },
    };
}

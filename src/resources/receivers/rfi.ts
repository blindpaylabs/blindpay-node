import type { BlindpayApiResponse, ReceiverType, RfiSection } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type RfiStatus = "pending" | "submitted" | "expired" | "cancelled";

export type Rfi = {
    id: string;
    receiver_id: string;
    instance_id: string;
    status: RfiStatus;
    request: RfiSection[];
    response: Record<string, unknown>;
    expires_at: string;
    submitted_at: string | null;
    created_at: string;
    receiver_type: ReceiverType;
    receiver_aiprise_session_id: string | null;
    receiver_kyc_status: string;
};

export type GetRfiInput = string;

export type GetRfiResponse = Rfi;

export type SubmitRfiInput = {
    receiver_id: string;
    response: Record<string, unknown>;
};

export type SubmitRfiResponse = {
    success: boolean;
};

export function createRfiResource(instanceId: string, client: InternalApiClient) {
    return {
        get(receiver_id: GetRfiInput): Promise<BlindpayApiResponse<GetRfiResponse>> {
            return client.get(`/instances/${instanceId}/receivers/${receiver_id}/rfi`);
        },
        submit({
            receiver_id,
            ...data
        }: SubmitRfiInput): Promise<BlindpayApiResponse<SubmitRfiResponse>> {
            return client.post(`/instances/${instanceId}/receivers/${receiver_id}/rfi`, data);
        },
    };
}

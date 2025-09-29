import type { BlindpayApiResponse } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type InstanceMemberRole =
    | "owner"
    | "admin"
    | "finance"
    | "checker"
    | "operations"
    | "developer"
    | "viewer";

export type GetInstanceMembersResponse = Array<{
    id: string;
    email: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    image_url: string;
    created_at: string;
    role: InstanceMemberRole;
}>;

export type UpdateInstanceInput = {
    name: string;
    receiver_invite_redirect_urL?: string;
};

export type DeleteInstanceMemberInput = string;

export type UpdateInstanceMemberRoleInput = {
    memberId: string;
    role: InstanceMemberRole;
};

export function createInstancesResource(instanceId: string, client: InternalApiClient) {
    return {
        getMembers(): Promise<BlindpayApiResponse<GetInstanceMembersResponse>> {
            return client.get(`/instances/${instanceId}/members`);
        },
        update({ ...data }: UpdateInstanceInput): Promise<BlindpayApiResponse<void>> {
            return client.put(`/instances/${instanceId}`, data);
        },
        delete(): Promise<BlindpayApiResponse<void>> {
            return client.delete(`/instances/${instanceId}`);
        },
        deleteMember(memberId: DeleteInstanceMemberInput): Promise<BlindpayApiResponse<void>> {
            return client.delete(`/instances/${instanceId}/members/${memberId}`);
        },
        updateMemberRole({
            memberId,
            role,
        }: UpdateInstanceMemberRoleInput): Promise<BlindpayApiResponse<void>> {
            return client.put(`/instances/${instanceId}/members/${memberId}`, { role });
        },
    };
}

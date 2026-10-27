import type { BlindpayApiResponse, SuccessResponse } from "../../../types";
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
    middle_name: string | null;
    last_name: string;
    image_url: string;
    created_at: string | null;
    role: InstanceMemberRole;
    has_passkey?: boolean | null;
}>;

export type InstanceType = "production" | "development";

export type InstanceOnboardingStep =
    | "initial"
    | "business_details"
    | "business_profile"
    | "documents"
    | "applicant"
    | "completed"
    | "blocked";

export type Instance = {
    id: string;
    name: string;
    type: InstanceType;
    onboarding_step: InstanceOnboardingStep;
};

export type GetInstanceResponse = Instance;

export type UpdateInstanceInput = {
    name: string;
    customer_invite_redirect_url?: string | null;
    email_notifications?: boolean;
    require_passkey?: boolean;
    accent_color?: string | null;
    logo_url?: string | null;
    partner_tos_link?: string | null;
    partner_tos_screenshot?: string | null;
    partner_tos_terms_accepted?: boolean;
    compliance_emails?: string[] | null;
    customer_rfi_emails_enabled?: boolean;
};

export type DeleteInstanceMemberInput = string;

export type UpdateInstanceMemberRoleInput = {
    memberId: string;
    role: InstanceMemberRole;
};

export type MigrateInstanceOwnershipInput = {
    user_id: string;
};

export type MigrateInstanceOwnershipResponse = SuccessResponse;

export function createInstancesResource(instanceId: string, client: InternalApiClient) {
    return {
        get(): Promise<BlindpayApiResponse<GetInstanceResponse>> {
            return client.get(`/instances/${instanceId}`);
        },
        getMembers(): Promise<BlindpayApiResponse<GetInstanceMembersResponse>> {
            return client.get(`/instances/${instanceId}/members`);
        },
        update({ ...data }: UpdateInstanceInput): Promise<BlindpayApiResponse<SuccessResponse>> {
            return client.put(`/instances/${instanceId}`, data);
        },
        delete(): Promise<BlindpayApiResponse<SuccessResponse>> {
            return client.delete(`/instances/${instanceId}`);
        },
        deleteMember(
            memberId: DeleteInstanceMemberInput
        ): Promise<BlindpayApiResponse<SuccessResponse>> {
            return client.delete(`/instances/${instanceId}/members/${memberId}`);
        },
        updateMemberRole({
            memberId,
            role,
        }: UpdateInstanceMemberRoleInput): Promise<BlindpayApiResponse<SuccessResponse>> {
            return client.put(`/instances/${instanceId}/members/${memberId}`, { user_role: role });
        },
        migrateOwnership({
            ...data
        }: MigrateInstanceOwnershipInput): Promise<
            BlindpayApiResponse<MigrateInstanceOwnershipResponse>
        > {
            return client.post(`/instances/${instanceId}/ownership`, data);
        },
    };
}

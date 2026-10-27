import type { AccountClass, BlindpayApiResponse, RequestOptions } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type RfiStatus = "pending" | "submitted" | "expired" | "cancelled";

export type RfiDocumentType =
    | "ADDRESS_PROOF_DOCUMENT"
    | "SOURCE_OF_FUNDS_DOCUMENT"
    | "BANK_STATEMENT_DOCUMENT"
    | "USER_SELFIE"
    | "TAX_CERTIFICATE"
    | "VISA_DOCUMENT"
    | "OTHER";

export type RfiField = {
    key: string;
    label: string;
    regex?: string;
    required: boolean;
    items?: Array<{
        label: string;
        value: string;
    }>;
    multiple?: boolean;
    aiprise_document_type?: RfiDocumentType;
};

export type RfiSection = {
    title: string;
    description: string;
    supporting_document?: string;
    fields: RfiField[];
};

/** Answers keyed by RfiField.key: a text value, or a list of uploaded file URLs. */
export type RfiResponse = Record<string, string | string[]>;

export type InstanceRfi = {
    id: string;
    instance_id: string;
    status: RfiStatus;
    request: RfiSection[];
    response: RfiResponse;
    expires_at: string;
    submitted_at: string | null;
    created_at: string;
};

export type CustomerRfi = {
    id: string;
    customer_id: string;
    instance_id: string;
    status: RfiStatus;
    request: RfiSection[];
    response: RfiResponse;
    expires_at: string;
    submitted_at: string | null;
    created_at: string;
    customer_type?: AccountClass;
    customer_aiprise_session_id?: string | null;
    customer_aiprise_user_profile_id?: string | null;
    customer_kyc_status?: string;
};

export type SubmitRfiResponse =
    | { success: true }
    | { success: false; reason: "no_pending_rfi" | "already_resolved" };

export type GetInstanceRfiResponse = InstanceRfi | null;

export type SubmitInstanceRfiInput = {
    response: RfiResponse;
};

export type GetCustomerRfiInput = string;

export type GetCustomerRfiResponse = CustomerRfi | null;

export type SubmitCustomerRfiInput = {
    customer_id: string;
    response: RfiResponse;
};

export function createInstanceRfiResource(instanceId: string, client: InternalApiClient) {
    return {
        /** Returns the open (pending) RFI for this instance, or null if there is none. */
        get(): Promise<BlindpayApiResponse<GetInstanceRfiResponse>> {
            return client.get(`/instances/${instanceId}/rfi`);
        },
        /** On `{ success: false }` there is no pending RFI: refetch with `get` instead of retrying. */
        submit(
            { response }: SubmitInstanceRfiInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<SubmitRfiResponse>> {
            return client.post(`/instances/${instanceId}/rfi`, response, options);
        },
    };
}

export function createCustomerRfiResource(instanceId: string, client: InternalApiClient) {
    return {
        /** Returns the open (pending) RFI for this customer, or null if there is none. */
        get(customerId: GetCustomerRfiInput): Promise<BlindpayApiResponse<GetCustomerRfiResponse>> {
            return client.get(`/instances/${instanceId}/customers/${customerId}/rfi`);
        },
        /** On success the customer's kyc_status flips back to verifying. On `{ success: false }`, refetch with `get` instead of retrying. */
        submit(
            { customer_id, response }: SubmitCustomerRfiInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<SubmitRfiResponse>> {
            return client.post(
                `/instances/${instanceId}/customers/${customer_id}/rfi`,
                response,
                options
            );
        },
    };
}

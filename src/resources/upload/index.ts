import type { BlindpayApiResponse, RequestOptions } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";
import { toQueryString } from "../../internal/query";

export type UploadBucket = "avatar" | "onboarding" | "limit_increase" | "documents";

export type UploadInput = {
    file: File | Blob;
    bucket: UploadBucket;
    instance_id?: string;
};

export type UploadResponse = {
    file_url: string;
};

export type UploadAnalyzeDocumentType =
    | "proof_of_address"
    | "identity_document"
    | "incorporation_document"
    | "proof_of_ownership"
    | "source_of_funds"
    | "selfie"
    | "bank_statement"
    | "tax_return"
    | "proof_of_income"
    | "financial_statement"
    | "invoice"
    | "transaction_document"
    | "passport"
    | "pay_stub"
    | "employment_letter"
    | "investment"
    | "crypto_exchange"
    | "blockchain_wallet"
    | "contract"
    | "accounts_receivable"
    | "merchant_processor"
    | "shareholder_loan";

export type UploadAnalyzeApprovalRate = "low" | "medium" | "high";

export type UploadAnalyzeInput = {
    file: File | Blob;
    type: UploadAnalyzeDocumentType;
    metadata?: string;
    instance_id?: string;
};

export type UploadAnalyzeResponse = {
    approval_rate: UploadAnalyzeApprovalRate;
    description: string;
};

export type PresignInput = {
    file_url: string;
    instance_id?: string;
};

export type PresignResponse = {
    file_url: string;
    expires_at: string;
};

/**
 * @param _baseUrl Unused: uploads go through `client`, which owns the base URL. Kept so the
 * exported factory's signature doesn't change.
 * @param _headers Unused, for the same reason.
 */
export function createUploadResource(
    instanceId: string,
    _baseUrl: string,
    _headers: Record<string, string>,
    client: InternalApiClient
) {
    return {
        upload(
            { file, bucket, instance_id }: UploadInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<UploadResponse>> {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("bucket", bucket);

            return client.postMultipart(
                `/upload${toQueryString({ instance_id: instance_id ?? instanceId })}`,
                formData,
                options
            );
        },
        analyze(
            { file, type, metadata, instance_id }: UploadAnalyzeInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<UploadAnalyzeResponse>> {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", type);
            if (metadata !== undefined) {
                formData.append("metadata", metadata);
            }

            return client.postMultipart(
                `/upload/analyze${toQueryString({ instance_id: instance_id ?? instanceId })}`,
                formData,
                options
            );
        },
        presign(
            { instance_id, ...data }: PresignInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<PresignResponse>> {
            return client.post(
                `/presign${toQueryString({ instance_id: instance_id ?? instanceId })}`,
                data,
                options
            );
        },
    };
}

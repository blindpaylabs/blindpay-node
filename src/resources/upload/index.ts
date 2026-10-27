import type { BlindpayApiResponse } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";
import { toErrorResponse } from "../../internal/error-response";

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
    instance_id: string;
};

export type PresignResponse = {
    file_url: string;
    expires_at: string;
};

export function createUploadResource(
    baseUrl: string,
    headers: Record<string, string>,
    client: InternalApiClient
) {
    async function postMultipart<T>(
        path: string,
        formData: FormData,
        instance_id?: string
    ): Promise<BlindpayApiResponse<T>> {
        const queryParams = instance_id ? `?${new URLSearchParams({ instance_id })}` : "";

        const { "Content-Type": _, ...headersWithoutContentType } = headers;

        const response = await fetch(`${baseUrl}${path}${queryParams}`, {
            method: "POST",
            headers: headersWithoutContentType,
            body: formData,
        });

        if (!response.ok) {
            return { data: null, error: toErrorResponse(await response.json()) };
        }

        const data = await response.json();

        return {
            data,
            error: null,
        };
    }

    return {
        upload({
            file,
            bucket,
            instance_id,
        }: UploadInput): Promise<BlindpayApiResponse<UploadResponse>> {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("bucket", bucket);

            return postMultipart("/upload", formData, instance_id);
        },
        analyze({
            file,
            type,
            metadata,
            instance_id,
        }: UploadAnalyzeInput): Promise<BlindpayApiResponse<UploadAnalyzeResponse>> {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", type);
            if (metadata !== undefined) {
                formData.append("metadata", metadata);
            }

            return postMultipart("/upload/analyze", formData, instance_id);
        },
        presign({
            instance_id,
            ...data
        }: PresignInput): Promise<BlindpayApiResponse<PresignResponse>> {
            return client.post(`/presign?${new URLSearchParams({ instance_id })}`, data);
        },
    };
}

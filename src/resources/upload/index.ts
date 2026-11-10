import type { BlindpayApiResponse, RequestOptions } from "../../../types";
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
    instance_id?: string;
};

export type PresignResponse = {
    file_url: string;
    expires_at: string;
};

const NOT_JSON = Symbol("not JSON");

/** Parses the body once; an empty body is `null` and an unparsable one is `NOT_JSON`. */
async function readJsonBody(response: Response): Promise<unknown> {
    const text = await response.text();
    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch {
        return NOT_JSON;
    }
}

function statusLine(response: Response): string {
    return response.statusText
        ? `HTTP ${response.status} ${response.statusText}`
        : `HTTP ${response.status}`;
}

async function toMultipartResult<T>(response: Response): Promise<BlindpayApiResponse<T>> {
    const body = await readJsonBody(response);
    if (!response.ok) {
        const error = body === NOT_JSON ? { message: statusLine(response) } : toErrorResponse(body);
        return { data: null, error };
    }
    if (body === NOT_JSON) {
        return {
            data: null,
            error: { message: `HTTP ${response.status}: the response body is not valid JSON` },
        };
    }
    return { data: body as T, error: null };
}

function messageOf(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (error && typeof error === "object" && "message" in error) {
        const { message } = error as { message: unknown };
        if (typeof message === "string") return message;
    }
    return "Unknown error";
}

export function createUploadResource(
    instanceId: string,
    baseUrl: string,
    headers: Record<string, string>,
    client: InternalApiClient
) {
    /**
     * Multipart requests skip `client` (it only sends JSON), so this keeps the same contract:
     * failures resolve to `{ data: null, error }` and never reject.
     */
    async function postMultipart<T>(
        path: string,
        formData: FormData,
        instance_id: string
    ): Promise<BlindpayApiResponse<T>> {
        const queryParams = `?${new URLSearchParams({ instance_id })}`;

        const { "Content-Type": _, ...headersWithoutContentType } = headers;

        try {
            const response = await fetch(`${baseUrl}${path}${queryParams}`, {
                method: "POST",
                headers: headersWithoutContentType,
                body: formData,
            });
            return await toMultipartResult<T>(response);
        } catch (error) {
            return { data: null, error: { message: messageOf(error) } };
        }
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

            return postMultipart("/upload", formData, instance_id ?? instanceId);
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

            return postMultipart("/upload/analyze", formData, instance_id ?? instanceId);
        },
        presign(
            { instance_id, ...data }: PresignInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<PresignResponse>> {
            return client.post(
                `/presign?${new URLSearchParams({ instance_id: instance_id ?? instanceId })}`,
                data,
                options
            );
        },
    };
}

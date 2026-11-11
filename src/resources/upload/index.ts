import type { BlindpayApiResponse, RequestOptions } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";
import { toQueryString } from "../../internal/query";

export type UploadBucket = "avatar" | "onboarding" | "limit_increase" | "documents";

export type UploadInput = {
    /** A `File` or `Blob`, or the raw bytes (`Uint8Array`, e.g. a `Buffer`, or `ArrayBuffer`). */
    file: File | Blob | Uint8Array | ArrayBuffer;
    /** Name sent with the file. Defaults to a `File`'s own name, `"blob"` for a `Blob`, `"upload"` for bytes. */
    filename?: string;
    /** MIME type, e.g. `"application/pdf"`. Defaults to the `Blob`'s own type, `application/octet-stream` for bytes. */
    contentType?: string;
    bucket: UploadBucket;
    /** @deprecated Uploads always go to the client's own instance (the API rejects any other with 401); leave this out. */
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
    /** A `File` or `Blob`, or the raw bytes (`Uint8Array`, e.g. a `Buffer`, or `ArrayBuffer`). */
    file: File | Blob | Uint8Array | ArrayBuffer;
    /** Name sent with the file. Defaults to a `File`'s own name, `"blob"` for a `Blob`, `"upload"` for bytes. */
    filename?: string;
    /** MIME type, e.g. `"application/pdf"`. Defaults to the `Blob`'s own type, `application/octet-stream` for bytes. */
    contentType?: string;
    type: UploadAnalyzeDocumentType;
    /** A JSON string with context for the analysis. */
    metadata?: string;
    /** @deprecated Uploads always go to the client's own instance (the API rejects any other with 401); leave this out. */
    instance_id?: string;
};

export type UploadAnalyzeResponse = {
    approval_rate: UploadAnalyzeApprovalRate;
    description: string;
};

export type PresignInput = {
    file_url: string;
    /** @deprecated Uploads always go to the client's own instance (the API rejects any other with 401); leave this out. */
    instance_id?: string;
};

export type PresignResponse = {
    file_url: string;
    expires_at: string;
};

/** The multipart `file` part's content, name and type (shared by upload and analyze). */
type FilePart = Pick<UploadInput, "file" | "filename" | "contentType">;

/** Appends `file` to `form` as the multipart `file` part, named and typed as `FilePart` says. */
function appendFile(form: FormData, { file, filename, contentType }: FilePart): void {
    if (!(file instanceof Blob)) {
        const bytes = new Blob([file as BlobPart], {
            type: contentType ?? "application/octet-stream",
        });
        form.append("file", bytes, filename ?? "upload");
        return;
    }
    const blob =
        contentType && contentType !== file.type ? new Blob([file], { type: contentType }) : file;
    const ownName = "name" in file && typeof file.name === "string" ? file.name : undefined;
    const name = filename ?? ownName;
    if (name === undefined) form.append("file", blob);
    else form.append("file", blob, name);
}

/**
 * @param _baseUrl @deprecated Unused: uploads go through `client`, which owns the base URL.
 *   Kept so the exported factory's signature doesn't change; removed in the next major.
 * @param _headers @deprecated Unused, for the same reason.
 */
export function createUploadResource(
    instanceId: string,
    _baseUrl: string,
    _headers: Record<string, string>,
    client: InternalApiClient
) {
    return {
        upload(
            { bucket, instance_id, ...file }: UploadInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<UploadResponse>> {
            const formData = new FormData();
            appendFile(formData, file);
            formData.append("bucket", bucket);

            return client.postMultipart(
                `/upload${toQueryString({ instance_id: instance_id ?? instanceId })}`,
                formData,
                options
            );
        },
        analyze(
            { type, metadata, instance_id, ...file }: UploadAnalyzeInput,
            options?: RequestOptions
        ): Promise<BlindpayApiResponse<UploadAnalyzeResponse>> {
            const formData = new FormData();
            appendFile(formData, file);
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

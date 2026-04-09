import type { BlindpayApiResponse } from "../../../types";

export type UploadBucket = "avatar" | "onboarding" | "limit_increase";

export type UploadInput = {
    file: File | Blob;
    bucket: UploadBucket;
    instance_id?: string;
};

export type UploadResponse = {
    file_url: string;
};

export function createUploadResource(baseUrl: string, headers: Record<string, string>) {
    return {
        async upload({
            file,
            bucket,
            instance_id,
        }: UploadInput): Promise<BlindpayApiResponse<UploadResponse>> {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("bucket", bucket);

            const queryParams = instance_id ? `?instance_id=${instance_id}` : "";

            const { "Content-Type": _, ...headersWithoutContentType } = headers;

            const response = await fetch(`${baseUrl}/upload${queryParams}`, {
                method: "POST",
                headers: headersWithoutContentType,
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                return {
                    data: null,
                    error: {
                        message: error?.message ?? "Unknown error",
                    },
                };
            }

            const data = await response.json();

            return {
                data,
                error: null,
            };
        },
    };
}

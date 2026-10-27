import type { BlindpayApiResponse, RequestOptions } from "../../types";

/**
 *
 * Internal API client interface that resources use to make HTTP requests.
 * This interface is not exposed to SDK users.
 */
export interface InternalApiClient {
    get: <T>(path: string) => Promise<BlindpayApiResponse<T>>;
    post: <T>(
        path: string,
        body: Record<string, unknown>,
        options?: RequestOptions
    ) => Promise<BlindpayApiResponse<T>>;
    put: <T>(
        path: string,
        body: Record<string, unknown>,
        options?: RequestOptions
    ) => Promise<BlindpayApiResponse<T>>;
    patch: <T>(
        path: string,
        body: Record<string, unknown>,
        options?: RequestOptions
    ) => Promise<BlindpayApiResponse<T>>;
    delete: <T>(path: string, options?: RequestOptions) => Promise<BlindpayApiResponse<T>>;
}

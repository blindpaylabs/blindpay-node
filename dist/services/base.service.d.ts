import { ErrorResponse } from "../types/error-response";
export declare abstract class BaseService {
    protected readonly baseUrl: string;
    protected readonly headers: Headers;
    protected abstract endpoint: string;
    constructor(baseUrl: string, headers: Headers);
    protected request<T>(method: string, path: string, body?: unknown): Promise<{
        data: T | null;
        error: ErrorResponse | null;
    }>;
    get<T>(path: string): Promise<{
        data: T | null;
        error: ErrorResponse | null;
    }>;
    post<T>(path: string, body: unknown): Promise<{
        data: T | null;
        error: ErrorResponse | null;
    }>;
    put<T>(path: string, body: unknown): Promise<{
        data: T | null;
        error: ErrorResponse | null;
    }>;
    patch<T>(path: string, body: unknown): Promise<{
        data: T | null;
        error: ErrorResponse | null;
    }>;
    delete<T>(path: string): Promise<{
        data: T | null;
        error: ErrorResponse | null;
    }>;
}

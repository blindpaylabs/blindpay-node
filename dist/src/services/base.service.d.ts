import { ErrorResponse } from "../types/error-response";
export declare abstract class BaseService {
    protected readonly baseUrl: string;
    protected readonly headers: Headers;
    protected readonly instanceId?: string | undefined;
    protected abstract BASE_PATH: string;
    constructor(baseUrl: string, headers: Headers, instanceId?: string | undefined);
    protected replaceParams(path: string, params: Record<string, string>): string;
    protected validateInstanceId(instanceId: string): void;
    protected replaceInstanceId(path: string, instanceId?: string): string;
    private request;
    protected _get<T>(path: string): Promise<{
        data: T | null;
        error: ErrorResponse | null;
    }>;
    protected _post<T>(path: string, body: unknown): Promise<{
        data: T | null;
        error: ErrorResponse | null;
    }>;
    protected _put<T>(path: string, body: unknown): Promise<{
        data: T | null;
        error: ErrorResponse | null;
    }>;
    protected _patch<T>(path: string, body: unknown): Promise<{
        data: T | null;
        error: ErrorResponse | null;
    }>;
    protected _delete<T>(path: string): Promise<{
        data: T | null;
        error: ErrorResponse | null;
    }>;
}

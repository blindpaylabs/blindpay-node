import { BaseService } from "./base.service";
import { ApiKey } from "../types/api-key";
import { CreateApiKeyRequest, CreateApiKeyResponse } from "../types/create-api-key";
import { ErrorResponse } from "../types/error-response";
export declare class ApiKeysService extends BaseService {
    protected endpoint: string;
    createApiKey(requestBody: CreateApiKeyRequest, instanceId?: string): Promise<{
        data: CreateApiKeyResponse | null;
        error: ErrorResponse | null;
    }>;
    getApiKeys(instanceId?: string): Promise<{
        data: ApiKey[] | null;
        error: ErrorResponse | null;
    }>;
}

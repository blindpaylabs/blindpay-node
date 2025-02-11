import { BaseService } from "./base.service";
import { BaseResponse } from "../types/util-types";
import { ApiKey, CreateApiKeyRequest, CreateApiKeyResponse, DeleteApiKeyResponse } from "../types/api-key.types";
export declare class ApiKeysService extends BaseService {
    protected readonly BASE_PATH = "/instances/{instance_id}/api-keys";
    private static readonly API_KEY_PATH;
    /**
     * Creates a new API key for an instance
     * @param requestBody - The API key creation data
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing the created API key or an error
     */
    createApiKey(requestBody: CreateApiKeyRequest, instanceId?: string): Promise<BaseResponse<CreateApiKeyResponse>>;
    /**
     * Retrieves all API keys for an instance
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing an array of API keys or an error
     */
    getApiKeys(instanceId?: string): Promise<BaseResponse<ApiKey[]>>;
    /**
     * Retrieves a specific API key
     * @param apiKeyId - The API key ID (15 characters)
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing the API key or an error
     */
    getApiKey(apiKeyId: string, instanceId?: string): Promise<BaseResponse<ApiKey>>;
    /**
     * Deletes a specific API key
     * @param apiKeyId - The API key ID (15 characters)
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing a success response or an error
     */
    deleteApiKey(apiKeyId: string, instanceId: string): Promise<BaseResponse<DeleteApiKeyResponse>>;
    /**
     * Validates API key ID format
     * @param apiKeyId - The API key ID to validate
     * @throws Error if the API key ID is invalid
     */
    private validateApiKeyId;
}

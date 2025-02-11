import { BaseService } from "./base.service";
import { BaseResponse } from "../types/util-types";
import {
  ApiKey,
  CreateApiKeyRequest,
  CreateApiKeyResponse,
  DeleteApiKeyResponse,
} from "../types/api-key.types";

export class ApiKeysService extends BaseService {
  protected readonly BASE_PATH = "/instances/{instance_id}/api-keys";
  private static readonly API_KEY_PATH =
    "/instances/{instance_id}/api-keys/{id}";

  /**
   * Creates a new API key for an instance
   * @param requestBody - The API key creation data
   * @param instanceId - The instance ID (15 characters)
   * @returns A promise containing the created API key or an error
   */
  async createApiKey(
    requestBody: CreateApiKeyRequest,
    instanceId?: string
  ): Promise<BaseResponse<CreateApiKeyResponse>> {
    const instance = instanceId || this.instanceId || "";
    this.validateInstanceId(instance);

    const path = this.replaceParams(this.BASE_PATH, {
      instance_id: instance,
    });

    return this._post<CreateApiKeyResponse>(path, requestBody);
  }

  /**
   * Retrieves all API keys for an instance
   * @param instanceId - The instance ID (15 characters)
   * @returns A promise containing an array of API keys or an error
   */
  async getApiKeys(instanceId?: string): Promise<BaseResponse<ApiKey[]>> {
    const instance = instanceId || this.instanceId || "";
    this.validateInstanceId(instance);

    const path = this.replaceParams(this.BASE_PATH, {
      instance_id: instance,
    });

    return this._get<ApiKey[]>(path);
  }

  /**
   * Retrieves a specific API key
   * @param apiKeyId - The API key ID (15 characters)
   * @param instanceId - The instance ID (15 characters)
   * @returns A promise containing the API key or an error
   */
  async getApiKey(
    apiKeyId: string,
    instanceId?: string
  ): Promise<BaseResponse<ApiKey>> {
    const instance = instanceId || this.instanceId || "";
    this.validateInstanceId(instance);
    this.validateApiKeyId(apiKeyId);

    const path = this.replaceParams(ApiKeysService.API_KEY_PATH, {
      instance_id: instance,
      id: apiKeyId,
    });

    return this._get<ApiKey>(path);
  }

  /**
   * Deletes a specific API key
   * @param apiKeyId - The API key ID (15 characters)
   * @param instanceId - The instance ID (15 characters)
   * @returns A promise containing a success response or an error
   */
  async deleteApiKey(
    apiKeyId: string,
    instanceId: string
  ): Promise<BaseResponse<DeleteApiKeyResponse>> {
    const instance = instanceId || this.instanceId || "";
    this.validateInstanceId(instance);
    this.validateApiKeyId(apiKeyId);

    const path = this.replaceParams(ApiKeysService.API_KEY_PATH, {
      instance_id: instance,
      id: apiKeyId,
    });

    return this._delete<DeleteApiKeyResponse>(path);
  }

  /**
   * Validates API key ID format
   * @param apiKeyId - The API key ID to validate
   * @throws Error if the API key ID is invalid
   */
  private validateApiKeyId(apiKeyId: string): void {
    if (!apiKeyId || apiKeyId.length !== 15) {
      throw new Error("API Key ID must be exactly 15 characters long");
    }
    if (!apiKeyId.startsWith("ap_")) {
      throw new Error("API Key ID must start with 'ap_'");
    }
  }
}

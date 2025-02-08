import { BaseService } from "./base.service";
import { ApiKey } from "../types/api-key";
import {
  CreateApiKeyRequest,
  CreateApiKeyResponse,
} from "../types/create-api-key";
import { ErrorResponse } from "../types/error-response";

export class ApiKeysService extends BaseService {
  protected endpoint = "/instances/{instance_id}/api-keys";

  async createApiKey(
    requestBody: CreateApiKeyRequest,
    instanceId?: string
  ): Promise<{
    data: CreateApiKeyResponse | null;
    error: ErrorResponse | null;
  }> {
    const path = this.replaceInstanceId(this.endpoint, instanceId);
    return this._post<CreateApiKeyResponse>(path, requestBody);
  }

  async getApiKeys(
    instanceId?: string
  ): Promise<{ data: ApiKey[] | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(this.endpoint, instanceId);
    return this._get<ApiKey[]>(path);
  }
}

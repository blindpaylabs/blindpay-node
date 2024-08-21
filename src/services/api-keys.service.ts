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
    instanceId: string,
    requestBody: CreateApiKeyRequest
  ): Promise<{
    data: CreateApiKeyResponse | null;
    error: ErrorResponse | null;
  }> {
    const path = this.endpoint.replace("{instance_id}", instanceId);
    return this.post<CreateApiKeyResponse>(path, requestBody);
  }

  async getApiKeys(
    instanceId: string
  ): Promise<{ data: ApiKey[] | null; error: ErrorResponse | null }> {
    const path = this.endpoint.replace("{instance_id}", instanceId);
    return this.get<ApiKey[]>(path);
  }
}

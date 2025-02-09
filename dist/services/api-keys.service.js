"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeysService = void 0;
const base_service_1 = require("./base.service");
class ApiKeysService extends base_service_1.BaseService {
    BASE_PATH = "/instances/{instance_id}/api-keys";
    static API_KEY_PATH = "/instances/{instance_id}/api-keys/{id}";
    /**
     * Creates a new API key for an instance
     * @param requestBody - The API key creation data
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing the created API key or an error
     */
    async createApiKey(requestBody, instanceId) {
        const instance = instanceId || this.instanceId || "";
        this.validateInstanceId(instance);
        const path = this.replaceParams(this.BASE_PATH, {
            instance_id: instance,
        });
        return this._post(path, requestBody);
    }
    /**
     * Retrieves all API keys for an instance
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing an array of API keys or an error
     */
    async getApiKeys(instanceId) {
        const instance = instanceId || this.instanceId || "";
        this.validateInstanceId(instance);
        const path = this.replaceParams(this.BASE_PATH, {
            instance_id: instance,
        });
        return this._get(path);
    }
    /**
     * Retrieves a specific API key
     * @param apiKeyId - The API key ID (15 characters)
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing the API key or an error
     */
    async getApiKey(apiKeyId, instanceId) {
        const instance = instanceId || this.instanceId || "";
        this.validateInstanceId(instance);
        this.validateApiKeyId(apiKeyId);
        const path = this.replaceParams(ApiKeysService.API_KEY_PATH, {
            instance_id: instance,
            id: apiKeyId,
        });
        return this._get(path);
    }
    /**
     * Deletes a specific API key
     * @param apiKeyId - The API key ID (15 characters)
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing a success response or an error
     */
    async deleteApiKey(apiKeyId, instanceId) {
        const instance = instanceId || this.instanceId || "";
        this.validateInstanceId(instance);
        this.validateApiKeyId(apiKeyId);
        const path = this.replaceParams(ApiKeysService.API_KEY_PATH, {
            instance_id: instance,
            id: apiKeyId,
        });
        return this._delete(path);
    }
    /**
     * Validates instance ID format
     * @param instanceId - The instance ID to validate
     * @throws Error if the instance ID is invalid
     */
    validateInstanceId(instanceId) {
        if (!instanceId || instanceId.length !== 15) {
            throw new Error("Instance ID must be exactly 15 characters long");
        }
        if (!instanceId.startsWith("in_")) {
            throw new Error("Instance ID must start with 'in_'");
        }
    }
    /**
     * Validates API key ID format
     * @param apiKeyId - The API key ID to validate
     * @throws Error if the API key ID is invalid
     */
    validateApiKeyId(apiKeyId) {
        if (!apiKeyId || apiKeyId.length !== 15) {
            throw new Error("API Key ID must be exactly 15 characters long");
        }
        if (!apiKeyId.startsWith("ap_")) {
            throw new Error("API Key ID must start with 'ap_'");
        }
    }
    /**
     * Replaces all parameters in a path string
     * @param path - The path template
     * @param params - Object containing parameter values
     * @returns The path with replaced parameters
     */
    replaceParams(path, params) {
        let result = path;
        Object.entries(params).forEach(([key, value]) => {
            result = result.replace(`{${key}}`, value);
        });
        return result;
    }
}
exports.ApiKeysService = ApiKeysService;

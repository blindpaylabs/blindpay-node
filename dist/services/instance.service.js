"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceService = void 0;
const base_service_1 = require("./base.service");
class InstanceService extends base_service_1.BaseService {
    BASE_PATH = "/instances";
    static INSTANCE_PATH = "/instances/{id}";
    static INSTANCE_MEMBERS_PATH = "/instances/{id}/members";
    /**
     * Updates a specific instance
     * @param requestBody - The instance update data
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing the update response or an error
     */
    async updateInstance(requestBody, instanceId) {
        const intance = instanceId || this.instanceId || "";
        this.validateInstanceId(intance);
        const path = this.replaceParams(InstanceService.INSTANCE_PATH, {
            id: intance,
        });
        return this._put(path, requestBody);
    }
    /**
     * Deletes a specific instance
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing a success response or an error
     */
    async deleteInstance(instanceId) {
        const instance = instanceId || this.instanceId || "";
        this.validateInstanceId(instance);
        const path = this.replaceParams(InstanceService.INSTANCE_PATH, {
            id: instance,
        });
        return this._delete(path);
    }
    /**
     * Retrieves all members of a specific instance
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing an array of instance members or an error
     */
    async getInstanceMembers(instanceId) {
        const instance = instanceId || this.instanceId || "";
        this.validateInstanceId(instance);
        const path = this.replaceParams(InstanceService.INSTANCE_MEMBERS_PATH, {
            id: instance,
        });
        return this._get(path);
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
exports.InstanceService = InstanceService;

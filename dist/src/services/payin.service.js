"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayinService = void 0;
const base_service_1 = require("./base.service");
/**
 * Service for managing payins, including creation, retrieval, and tracking of payments
 * across different payment networks and systems.
 */
class PayinService extends base_service_1.BaseService {
    BASE_PATH = "/instances/{instance_id}/payins";
    EXTERNAL_PATH = "/e/payins";
    /**
     * Retrieves a specific payin by its ID
     * @param payinId - The unique identifier of the payin
     * @param instanceId - Optional instance ID (15 characters). If not provided, uses the default from the service
     * @returns A promise containing the payin details or an error
     * @throws Error if the instance ID is provided and invalid
     */
    async retrievePayin(payinId, instanceId) {
        const path = this.replaceInstanceId(`${this.BASE_PATH}/{id}`, instanceId).replace("{id}", payinId);
        return this._get(path);
    }
    /**
     * Retrieves all payins for an instance
     * @param instanceId - Optional instance ID (15 characters). If not provided, uses the default from the service
     * @returns A promise containing an array of payins or an error
     * @throws Error if the instance ID is provided and invalid
     */
    async retrievePayins(limit, offset, instanceId) {
        const path = this.replaceInstanceId(this.BASE_PATH, instanceId);
        return this._get(path, {
            limit: limit?.toString() ?? "25",
            offset: offset?.toString() ?? "0",
        });
    }
    /**
     * Retrieves tracking information for a specific payin using the external tracking endpoint
     * This method can be used to track payins without requiring an instance ID
     * @param payinId - The unique identifier of the payin to track
     * @returns A promise containing the payin tracking details or an error
     */
    async retrievePayinTrack(payinId) {
        const path = `${this.EXTERNAL_PATH}/{id}`.replace("{id}", payinId);
        return this._get(path);
    }
    /**
     * Creates a new EVM (Ethereum Virtual Machine) payin for an instance
     * @param payin - The payin details conforming to the EVM payment network requirements
     * @param instanceId - Optional instance ID (15 characters). If not provided, uses the default from the service
     * @returns A promise containing the created payin details or an error
     * @throws Error if the instance ID is provided and invalid
     */
    async createPayin(payin, instanceId) {
        const path = `${this.replaceInstanceId(this.BASE_PATH, instanceId)}/evm`;
        return this._post(path, payin);
    }
    /**
     * Exports payins for an instance in CSV format
     * @param instanceId - Optional instance ID (15 characters). If not provided, uses the default from the service
     * @returns A promise containing the CSV data or an error
     * @throws Error if the instance ID is provided and invalid
     */
    async exportPayins(instanceId) {
        const path = this.replaceInstanceId("/instances/{instance_id}/export/payins", instanceId);
        return this._get(path);
    }
}
exports.PayinService = PayinService;

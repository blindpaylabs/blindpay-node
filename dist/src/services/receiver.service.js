"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiverService = void 0;
const base_service_1 = require("./base.service");
class ReceiverService extends base_service_1.BaseService {
    BASE_PATH = "/instances/{instance_id}/receivers";
    static RECEIVER_PATH = "/instances/{instance_id}/receivers/{id}";
    /**
     * Creates a new receiver
     * @param data - The receiver data
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing the created receiver ID or an error
     */
    async createReceiver(data, instanceId) {
        this.validateInstanceId(instanceId);
        const path = this.replaceInstanceId(this.BASE_PATH, instanceId);
        return this._post(path, data);
    }
    /**
     * Retrieves all receivers for an instance
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing an array of receivers or an error
     */
    async getReceivers(instanceId) {
        this.validateInstanceId(instanceId);
        const path = this.replaceInstanceId(this.BASE_PATH, instanceId);
        return this._get(path);
    }
    /**
     * Retrieves a specific receiver
     * @param instanceId - The instance ID (15 characters)
     * @param receiverId - The receiver ID (15 characters)
     * @returns A promise containing the receiver data or an error
     */
    async getReceiver(instanceId, receiverId) {
        this.validateInstanceId(instanceId);
        this.validateReceiverId(receiverId);
        const path = this.replaceParams(ReceiverService.RECEIVER_PATH, {
            instance_id: instanceId,
            id: receiverId,
        });
        return this._get(path);
    }
    /**
     * Updates a receiver's information
     * @param instanceId - The instance ID (15 characters)
     * @param receiverId - The receiver ID (15 characters)
     * @param data - The updated receiver data
     * @returns A promise containing a success response or an error
     */
    async updateReceiver(instanceId, receiverId, data) {
        this.validateInstanceId(instanceId);
        this.validateReceiverId(receiverId);
        const path = this.replaceParams(ReceiverService.RECEIVER_PATH, {
            instance_id: instanceId,
            id: receiverId,
        });
        return this._put(path, data);
    }
    /**
     * Deletes a receiver
     * @param instanceId - The instance ID (15 characters)
     * @param receiverId - The receiver ID (15 characters)
     * @returns A promise containing a success response or an error
     */
    async deleteReceiver(instanceId, receiverId) {
        this.validateInstanceId(instanceId);
        this.validateReceiverId(receiverId);
        const path = this.replaceParams(ReceiverService.RECEIVER_PATH, {
            instance_id: instanceId,
            id: receiverId,
        });
        return this._delete(path);
    }
    /**
     * Validates receiver ID format
     * @param receiverId - The receiver ID to validate
     * @throws Error if the receiver ID is invalid
     */
    validateReceiverId(receiverId) {
        if (!receiverId || receiverId.length !== 15) {
            throw new Error("Receiver ID must be exactly 15 characters long");
        }
    }
}
exports.ReceiverService = ReceiverService;

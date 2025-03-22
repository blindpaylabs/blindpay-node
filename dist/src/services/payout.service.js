"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutService = void 0;
const base_service_1 = require("./base.service");
/**
 * Service for managing payouts, including creation, retrieval, and tracking of payments
 * across different payment networks and systems.
 */
class PayoutService extends base_service_1.BaseService {
    BASE_PATH = "/instances/{instance_id}/payouts";
    EXTERNAL_PATH = "/e/payouts";
    /**
     * Retrieves a specific payout by its ID
     * @param payoutId - The unique identifier of the payout
     * @param instanceId - Optional instance ID (15 characters). If not provided, uses the default from the service
     * @returns A promise containing the payout details or an error
     * @throws Error if the instance ID is provided and invalid
     */
    async retrievePayout(payoutId, instanceId) {
        const path = this.replaceInstanceId(`${this.BASE_PATH}/{id}`, instanceId).replace("{id}", payoutId);
        return this._get(path);
    }
    /**
     * Retrieves all payouts for an instance
     * @param instanceId - Optional instance ID (15 characters). If not provided, uses the default from the service
     * @returns A promise containing an array of payouts or an error
     * @throws Error if the instance ID is provided and invalid
     */
    async retrievePayouts(limit, offset, instanceId) {
        const path = this.replaceInstanceId(this.BASE_PATH, instanceId);
        return this._get(path, {
            limit: limit?.toString() ?? "25",
            offset: offset?.toString() ?? "0",
        });
    }
    /**
     * Retrieves tracking information for a specific payout using the external tracking endpoint
     * This method can be used to track payouts without requiring an instance ID
     * @param payoutId - The unique identifier of the payout to track
     * @returns A promise containing the payout tracking details or an error
     */
    async retrievePayoutTrack(payoutId) {
        const path = `${this.EXTERNAL_PATH}/{id}`.replace("{id}", payoutId);
        return this._get(path);
    }
    /**
     * Creates a new EVM (Ethereum Virtual Machine) payout for an instance
     * @param payout - The payout details conforming to the EVM payment network requirements
     * @param instanceId - Optional instance ID (15 characters). If not provided, uses the default from the service
     * @returns A promise containing the created payout details or an error
     * @throws Error if the instance ID is provided and invalid
     */
    async createPayout(payout, instanceId) {
        const path = `${this.replaceInstanceId(this.BASE_PATH, instanceId)}/evm`;
        return this._post(path, payout);
    }
}
exports.PayoutService = PayoutService;

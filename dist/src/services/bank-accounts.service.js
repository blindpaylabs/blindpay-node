"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankAccountsService = void 0;
const base_service_1 = require("./base.service");
class BankAccountsService extends base_service_1.BaseService {
    BASE_PATH = "/instances/{instance_id}/receivers/{receiver_id}/bank-accounts";
    static BANK_ACCOUNT_PATH = "/instances/{instance_id}/receivers/{receiver_id}/bank-accounts/{id}";
    /**
     * Creates a new bank account for a receiver
     * @param receiverId - The receiver ID (15 characters)
     * @param requestBody - The bank account creation data
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing the created bank account or an error
     */
    async createBankAccount(receiverId, requestBody, instanceId) {
        const intance = instanceId || this.instanceId || "";
        this.validateInstanceId(intance);
        this.validateReceiverId(receiverId);
        const path = this.replaceParams(this.BASE_PATH, {
            instance_id: intance,
            receiver_id: receiverId,
        });
        return this._post(path, requestBody);
    }
    /**
     * Retrieves all bank accounts for a receiver
     * @param receiverId - The receiver ID (15 characters)
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing an array of bank accounts or an error
     */
    async getBankAccounts(receiverId, instanceId) {
        const intance = instanceId || this.instanceId || "";
        this.validateInstanceId(intance);
        this.validateReceiverId(receiverId);
        const path = this.replaceParams(this.BASE_PATH, {
            instance_id: intance,
            receiver_id: receiverId,
        });
        return this._get(path);
    }
    /**
     * Retrieves a specific bank account
     * @param receiverId - The receiver ID (15 characters)
     * @param bankAccountId - The bank account ID (15 characters)
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing the bank account or an error
     */
    async getBankAccount(receiverId, bankAccountId, instanceId) {
        const instance = instanceId || this.instanceId || "";
        this.validateInstanceId(instance);
        this.validateReceiverId(receiverId);
        this.validateBankAccountId(bankAccountId);
        const path = this.replaceParams(BankAccountsService.BANK_ACCOUNT_PATH, {
            instance_id: instance,
            receiver_id: receiverId,
            id: bankAccountId,
        });
        return this._get(path);
    }
    /**
     * Deletes a specific bank account
     * @param receiverId - The receiver ID (15 characters)
     * @param bankAccountId - The bank account ID (15 characters)
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing a success response or an error
     */
    async deleteBankAccount(receiverId, bankAccountId, instanceId) {
        const instance = instanceId || this.instanceId || "";
        this.validateInstanceId(instance);
        this.validateReceiverId(receiverId);
        this.validateBankAccountId(bankAccountId);
        const path = this.replaceParams(BankAccountsService.BANK_ACCOUNT_PATH, {
            instance_id: instance,
            receiver_id: receiverId,
            id: bankAccountId,
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
    /**
     * Validates bank account ID format
     * @param bankAccountId - The bank account ID to validate
     * @throws Error if the bank account ID is invalid
     */
    validateBankAccountId(bankAccountId) {
        if (!bankAccountId || bankAccountId.length !== 15) {
            throw new Error("Bank Account ID must be exactly 15 characters long");
        }
        if (!bankAccountId.startsWith("ba_")) {
            throw new Error("Bank Account ID must start with 'ba_'");
        }
    }
}
exports.BankAccountsService = BankAccountsService;

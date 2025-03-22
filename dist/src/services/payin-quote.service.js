"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayinQuoteService = void 0;
const base_service_1 = require("./base.service");
/**
 * Service for managing payin quotes.
 * Provides functionality to create payin quotes.
 */
class PayinQuoteService extends base_service_1.BaseService {
    BASE_PATH = "/instances/{instance_id}/payin-quotes";
    /**
     * Creates a new payin quote
     * @param quoteData - The quote details including source and target currencies,
     *                    amounts, and any additional parameters required for the quote
     * @param instanceId - Optional instance ID (15 characters). If not provided,
     *                    uses the default from the service
     * @returns A promise containing the created quote details or an error
     * @throws Error if the instance ID is provided and invalid
     */
    async createQuote(quoteData, instanceId) {
        const path = this.replaceInstanceId(this.BASE_PATH, instanceId);
        return this._post(path, quoteData);
    }
}
exports.PayinQuoteService = PayinQuoteService;

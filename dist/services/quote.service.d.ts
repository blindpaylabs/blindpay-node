import { BaseService } from "./base.service";
import { FX, Quote } from "../types/quote-types";
import { ErrorResponse } from "../types/error-response";
/**
 * Service for managing quotes and foreign exchange (FX) rate operations.
 * Provides functionality to create quotes and check current FX rates.
 */
export declare class QuoteService extends BaseService {
    protected BASE_PATH: string;
    /**
     * Creates a new quote for currency exchange
     * @param quoteData - The quote details including source and target currencies,
     *                    amounts, and any additional parameters required for the quote
     * @param instanceId - Optional instance ID (15 characters). If not provided,
     *                    uses the default from the service
     * @returns A promise containing the created quote details or an error
     * @throws Error if the instance ID is provided and invalid
     */
    createQuote(quoteData: Quote, instanceId?: string): Promise<{
        data: Quote | null;
        error: ErrorResponse | null;
    }>;
    /**
     * Retrieves current foreign exchange (FX) rate information
     * @param checkData - The FX check parameters including the currency pair
     *                   and other relevant information for the rate check
     * @param instanceId - Optional instance ID (15 characters). If not provided,
     *                    uses the default from the service
     * @returns A promise containing the current FX rate information as a quote or an error
     * @throws Error if the instance ID is provided and invalid
     */
    getFXRate(checkData: FX, instanceId?: string): Promise<{
        data: Quote | null;
        error: ErrorResponse | null;
    }>;
}

import { BaseService } from "./base.service";
import { PayinQuote } from "../types/payin-quote-types";
import { ErrorResponse } from "../types/error-response";
/**
 * Service for managing payin quotes.
 * Provides functionality to create payin quotes.
 */
export declare class PayinQuoteService extends BaseService {
    protected BASE_PATH: string;
    /**
     * Creates a new payin quote
     * @param quoteData - The quote details including source and target currencies,
     *                    amounts, and any additional parameters required for the quote
     * @param instanceId - Optional instance ID (15 characters). If not provided,
     *                    uses the default from the service
     * @returns A promise containing the created quote details or an error
     * @throws Error if the instance ID is provided and invalid
     */
    createQuote(quoteData: PayinQuote, instanceId?: string): Promise<{
        data: PayinQuote | null;
        error: ErrorResponse | null;
    }>;
}

import { BaseService } from "./base.service";
import { PayinQuote } from "../types/payin-quote-types";
import { ErrorResponse } from "../types/error-response";

/**
 * Service for managing payin quotes.
 * Provides functionality to create payin quotes.
 */
export class PayinQuoteService extends BaseService {
  protected BASE_PATH = "/instances/{instance_id}/payin-quotes";

  /**
   * Creates a new payin quote
   * @param quoteData - The quote details including source and target currencies,
   *                    amounts, and any additional parameters required for the quote
   * @param instanceId - Optional instance ID (15 characters). If not provided,
   *                    uses the default from the service
   * @returns A promise containing the created quote details or an error
   * @throws Error if the instance ID is provided and invalid
   */
  async createQuote(
    quoteData: PayinQuote,
    instanceId?: string
  ): Promise<{ data: PayinQuote | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(this.BASE_PATH, instanceId);
    return this._post<PayinQuote>(path, quoteData);
  }
}

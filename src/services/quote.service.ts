import { BaseService } from "./base.service";
import {
  CreateQuoteIn,
  CreateQuoteOut,
  CheckQuoteIn,
  CheckQuoteOut,
} from "../types/quote-types";
import { ErrorResponse } from "../types/error-response";

export class QuoteService extends BaseService {
  protected endpoint = "/instances/{instance_id}/quotes";

  async createQuote(
    instanceId: string,
    quoteData: CreateQuoteIn
  ): Promise<{ data: CreateQuoteOut | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(this.endpoint, instanceId);
    return this._post<CreateQuoteOut>(path, quoteData);
  }

  async checkQuote(
    instanceId: string,
    checkData: CheckQuoteIn
  ): Promise<{ data: CheckQuoteOut | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(`${this.endpoint}/check`, instanceId);
    return this._post<CheckQuoteOut>(path, checkData);
  }
}

import { BaseService } from "./base.service";
import { FX, Quote } from "../types/quote-types";
import { ErrorResponse } from "../types/error-response";

export class QuoteService extends BaseService {
  protected BASE_PATH = "/instances/{instance_id}/quotes";

  async createQuote(
    quoteData: Quote,
    instanceId?: string
  ): Promise<{ data: Quote | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(this.BASE_PATH, instanceId);
    return this._post<Quote>(path, quoteData);
  }

  async getFXRate(
    checkData: FX,
    instanceId?: string
  ): Promise<{ data: Quote | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(`${this.BASE_PATH}/check`, instanceId);
    return this._post<Quote>(path, checkData);
  }
}

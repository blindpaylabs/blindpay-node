import { BaseService } from "./base.service";
import { AvailableCountry } from "../types/available-country";
import { AvailableCurrency } from "../types/available-currency";
import { BankDetail } from "../types/bank-detail";
import { ErrorResponse } from "../types/error-response";

export class AvailableService extends BaseService {
  protected endpoint = "/available";

  async getAvailableCountries(): Promise<{
    data: AvailableCountry[] | null;
    error: ErrorResponse | null;
  }> {
    const path = `${this.endpoint}/countries`;
    return this._get<AvailableCountry[]>(path);
  }

  async getAvailableCurrencies(country: string): Promise<{
    data: AvailableCurrency[] | null;
    error: ErrorResponse | null;
  }> {
    const path = `${this.endpoint}/currencies?country=${country}`;
    return this._get<AvailableCurrency[]>(path);
  }

  async getBankDetails(
    currency: string
  ): Promise<{ data: BankDetail[] | null; error: ErrorResponse | null }> {
    const path = `${this.endpoint}/bank-details?currency=${currency}`;
    return this._get<BankDetail[]>(path);
  }
}

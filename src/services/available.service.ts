import { BaseService } from "./base.service";
import {
  AvailableCountry,
  AvailableCurrency,
  BankDetail,
  AvailableRail,
} from "../types/available.types";
import { BaseResponse, TransferType } from "../types/util-types";

export class AvailableService extends BaseService {
  protected readonly BASE_PATH = "/available";

  /**
   * Retrieves available countries
   * @returns A promise containing an array of available countries or an error
   */
  async getAvailableCountries(): Promise<BaseResponse<AvailableCountry[]>> {
    const path = `${this.BASE_PATH}/countries`;
    return this._get<AvailableCountry[]>(path);
  }

  /**
   * Retrieves available currencies for a specific country
   * @param country - The country code
   * @returns A promise containing an array of available currencies or an error
   */
  async getAvailableCurrencies(
    country: string
  ): Promise<BaseResponse<AvailableCurrency[]>> {
    const path = `${this.BASE_PATH}/currencies?country=${encodeURIComponent(
      country
    )}`;
    return this._get<AvailableCurrency[]>(path);
  }

  /**
   * Retrieves bank details for a specific rail type
   * @param rail - The rail type (wire, ach, pix, etc.)
   * @returns A promise containing an array of bank details or an error
   */
  async getBankDetails(
    rail: TransferType
  ): Promise<BaseResponse<BankDetail[]>> {
    if (!Object.values(TransferType).includes(rail)) {
      throw new Error("Invalid rail type");
    }

    const path = `${this.BASE_PATH}/bank-details?rail=${encodeURIComponent(
      rail
    )}`;
    return this._get<BankDetail[]>(path);
  }

  /**
   * Retrieves available rails
   * @returns A promise containing an array of available rails or an error
   */
  async getAvailableRails(): Promise<BaseResponse<AvailableRail[]>> {
    const path = `${this.BASE_PATH}/rails`;
    return this._get<AvailableRail[]>(path);
  }

  /**
   * Creates a URL-encoded query string from parameters
   * @param params - Object containing query parameters
   * @returns A URL-encoded query string
   */
  private createQueryString(params: Record<string, string>): string {
    return Object.entries(params)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");
  }
}

import { BaseService } from "./base.service";
import { AvailableCountry, AvailableCurrency, BankDetail, AvailableRail } from "../types/available.types";
import { BaseResponse, TransferType } from "../types/util-types";
export declare class AvailableService extends BaseService {
    protected readonly BASE_PATH = "/available";
    /**
     * Retrieves available countries
     * @returns A promise containing an array of available countries or an error
     */
    getAvailableCountries(): Promise<BaseResponse<AvailableCountry[]>>;
    /**
     * Retrieves available currencies for a specific country
     * @param country - The country code
     * @returns A promise containing an array of available currencies or an error
     */
    getAvailableCurrencies(country: string): Promise<BaseResponse<AvailableCurrency[]>>;
    /**
     * Retrieves bank details for a specific rail type
     * @param rail - The rail type (wire, ach, pix, etc.)
     * @returns A promise containing an array of bank details or an error
     */
    getBankDetails(rail: TransferType): Promise<BaseResponse<BankDetail[]>>;
    /**
     * Retrieves available rails
     * @returns A promise containing an array of available rails or an error
     */
    getAvailableRails(): Promise<BaseResponse<AvailableRail[]>>;
}

import { BaseService } from "./base.service";
import { AvailableCountry } from "../types/available-country";
import { AvailableCurrency } from "../types/available-currency";
import { BankDetail } from "../types/bank-detail";
import { ErrorResponse } from "../types/error-response";
export declare class AvailableService extends BaseService {
    protected endpoint: string;
    getAvailableCountries(): Promise<{
        data: AvailableCountry[] | null;
        error: ErrorResponse | null;
    }>;
    getAvailableCurrencies(country: string): Promise<{
        data: AvailableCurrency[] | null;
        error: ErrorResponse | null;
    }>;
    getBankDetails(currency: string): Promise<{
        data: BankDetail[] | null;
        error: ErrorResponse | null;
    }>;
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableService = void 0;
const base_service_1 = require("./base.service");
const util_types_1 = require("../types/util-types");
class AvailableService extends base_service_1.BaseService {
    BASE_PATH = "/available";
    /**
     * Retrieves available countries
     * @returns A promise containing an array of available countries or an error
     */
    async getAvailableCountries() {
        const path = `${this.BASE_PATH}/countries`;
        return this._get(path);
    }
    /**
     * Retrieves available currencies for a specific country
     * @param country - The country code
     * @returns A promise containing an array of available currencies or an error
     */
    async getAvailableCurrencies(country) {
        const path = `${this.BASE_PATH}/currencies?country=${encodeURIComponent(country)}`;
        return this._get(path);
    }
    /**
     * Retrieves bank details for a specific rail type
     * @param rail - The rail type (wire, ach, pix, etc.)
     * @returns A promise containing an array of bank details or an error
     */
    async getBankDetails(rail) {
        if (!Object.values(util_types_1.TransferType).includes(rail)) {
            throw new Error("Invalid rail type");
        }
        const path = `${this.BASE_PATH}/bank-details?rail=${encodeURIComponent(rail)}`;
        return this._get(path);
    }
    /**
     * Retrieves available rails
     * @returns A promise containing an array of available rails or an error
     */
    async getAvailableRails() {
        const path = `${this.BASE_PATH}/rails`;
        return this._get(path);
    }
    /**
     * Creates a URL-encoded query string from parameters
     * @param params - Object containing query parameters
     * @returns A URL-encoded query string
     */
    createQueryString(params) {
        return Object.entries(params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join("&");
    }
}
exports.AvailableService = AvailableService;

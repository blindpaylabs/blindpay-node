"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableService = void 0;
const base_service_1 = require("./base.service");
class AvailableService extends base_service_1.BaseService {
    constructor() {
        super(...arguments);
        this.endpoint = "/available";
    }
    getAvailableCountries() {
        return __awaiter(this, void 0, void 0, function* () {
            const path = `${this.endpoint}/countries`;
            return this._get(path);
        });
    }
    getAvailableCurrencies(country) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = `${this.endpoint}/currencies?country=${country}`;
            return this._get(path);
        });
    }
    getBankDetails(currency) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = `${this.endpoint}/bank-details?currency=${currency}`;
            return this._get(path);
        });
    }
}
exports.AvailableService = AvailableService;

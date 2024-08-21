"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blindpay = void 0;
const api_keys_service_1 = require("./services/api-keys.service");
const bank_accounts_service_1 = require("./services/bank-accounts.service");
const available_service_1 = require("./services/available.service");
const defaultBaseUrl = "https://api.blindpay.com";
const defaultUserAgent = `blindpay-sdk:1.0.0`;
class Blindpay {
    constructor(key, baseUrl = defaultBaseUrl) {
        this.key = key;
        if (!key) {
            throw new Error('Missing API key. Pass it to the constructor `new Blindpay("bp_123")`');
        }
        this.baseUrl = baseUrl;
        this.headers = new Headers({
            Authorization: `Bearer ${this.key}`,
            "User-Agent": defaultUserAgent,
            "Content-Type": "application/json",
        });
        this.apiKeys = new api_keys_service_1.ApiKeysService(this.baseUrl, this.headers);
        this.bankAccounts = new bank_accounts_service_1.BankAccountsService(this.baseUrl, this.headers);
        this.available = new available_service_1.AvailableService(this.baseUrl, this.headers);
    }
}
exports.Blindpay = Blindpay;

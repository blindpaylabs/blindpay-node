"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blindpay = void 0;
const api_keys_service_1 = require("./services/api-keys.service");
const available_service_1 = require("./services/available.service");
const bank_accounts_service_1 = require("./services/bank-accounts.service");
const instance_service_1 = require("./services/instance.service");
const onboarding_service_1 = require("./services/onboarding.service");
const payout_service_1 = require("./services/payout.service");
const quote_service_1 = require("./services/quote.service");
const receiver_service_1 = require("./services/receiver.service");
const defaultBaseUrl = "https://api.blindpay.com/v1";
const defaultUserAgent = `blindpay-sdk:1.0.0`;
class Blindpay {
    constructor(key, instanceId, baseUrl) {
        this.key = key;
        this.instanceId = instanceId;
        if (!key) {
            throw new Error('Missing API key. Pass it to the constructor `new Blindpay("bp_123")`');
        }
        this.baseUrl = baseUrl || defaultBaseUrl;
        this.instanceId = instanceId;
        this.headers = new Headers({
            Authorization: `Bearer ${this.key}`,
            "User-Agent": defaultUserAgent,
            "Content-Type": "application/json",
        });
        this.apiKeys = new api_keys_service_1.ApiKeysService(this.baseUrl, this.headers, this.instanceId);
        this.bankAccounts = new bank_accounts_service_1.BankAccountsService(this.baseUrl, this.headers, this.instanceId);
        this.available = new available_service_1.AvailableService(this.baseUrl, this.headers, this.instanceId);
        this.instances = new instance_service_1.InstanceService(this.baseUrl, this.headers, this.instanceId);
        this.onboardings = new onboarding_service_1.OnboardingService(this.baseUrl, this.headers, this.instanceId);
        this.payouts = new payout_service_1.PayoutService(this.baseUrl, this.headers, this.instanceId);
        this.quotes = new quote_service_1.QuoteService(this.baseUrl, this.headers, this.instanceId);
        this.receivers = new receiver_service_1.ReceiverService(this.baseUrl, this.headers, this.instanceId);
    }
}
exports.Blindpay = Blindpay;

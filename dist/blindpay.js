"use strict";
exports.__esModule = true;
exports.Blindpay = void 0;
var api_keys_service_1 = require("./services/api-keys.service");
var available_service_1 = require("./services/available.service");
var bank_accounts_service_1 = require("./services/bank-accounts.service");
var instance_service_1 = require("./services/instance.service");
var onboarding_service_1 = require("./services/onboarding.service");
var payout_service_1 = require("./services/payout.service");
var quote_service_1 = require("./services/quote.service");
var receiver_service_1 = require("./services/receiver.service");
var defaultBaseUrl = "https://api.blindpay.com/v1";
var defaultUserAgent = "blindpay-sdk:1.0.0";
var Blindpay = /** @class */ (function () {
    function Blindpay(key, instanceId, baseUrl) {
        this.key = key;
        this.instanceId = instanceId;
        if (!key) {
            throw new Error('Missing API key. Pass it to the constructor `new Blindpay("bp_123")`');
        }
        this.baseUrl = baseUrl || defaultBaseUrl;
        this.instanceId = instanceId;
        this.headers = new Headers({
            Authorization: "Bearer ".concat(this.key),
            "User-Agent": defaultUserAgent,
            "Content-Type": "application/json"
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
    return Blindpay;
}());
exports.Blindpay = Blindpay;

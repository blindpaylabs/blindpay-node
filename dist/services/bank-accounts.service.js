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
exports.BankAccountsService = void 0;
const base_service_1 = require("./base.service");
class BankAccountsService extends base_service_1.BaseService {
    constructor() {
        super(...arguments);
        this.endpoint = "/instances/{instance_id}/receivers/{receiver_id}/bank-accounts";
    }
    createBankAccount(instanceId, receiverId, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.replaceInstanceId(this.endpoint, instanceId).replace("{receiver_id}", receiverId);
            return this._post(path, requestBody);
        });
    }
    getBankAccounts(instanceId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.replaceInstanceId(this.endpoint, instanceId).replace("{receiver_id}", receiverId);
            return this._get(path);
        });
    }
    deleteBankAccount(instanceId, receiverId, bankAccountId) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.replaceInstanceId(this.endpoint, instanceId)
                .replace("{receiver_id}", receiverId)
                .concat(`/${bankAccountId}`);
            return this._delete(path);
        });
    }
}
exports.BankAccountsService = BankAccountsService;

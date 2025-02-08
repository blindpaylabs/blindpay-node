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
exports.ReceiverService = void 0;
const base_service_1 = require("./base.service");
class ReceiverService extends base_service_1.BaseService {
    constructor() {
        super(...arguments);
        this.endpoint = "/instances/{instance_id}/receivers";
    }
    createReceiver(instanceId, receiverData) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.replaceInstanceId(this.endpoint, instanceId);
            return this._post(path, receiverData);
        });
    }
    getReceivers(instanceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.replaceInstanceId(this.endpoint, instanceId);
            return this._get(path);
        });
    }
    getReceiver(instanceId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.replaceInstanceId(`${this.endpoint}/{id}`, instanceId).replace("{id}", receiverId);
            return this._get(path);
        });
    }
    updateReceiver(instanceId, receiverId, addressData) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.replaceInstanceId(`${this.endpoint}/{id}/address`, instanceId).replace("{id}", receiverId);
            return this._put(path, addressData);
        });
    }
}
exports.ReceiverService = ReceiverService;

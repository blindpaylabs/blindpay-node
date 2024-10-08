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
exports.OnboardingService = void 0;
const base_service_1 = require("./base.service");
class OnboardingService extends base_service_1.BaseService {
    constructor() {
        super(...arguments);
        this.endpoint = "/instances/{instance_id}/onboarding";
    }
    replaceInstanceId(path, instanceId) {
        return path.replace("{instance_id}", instanceId);
    }
    upsertBusinessDetails(instanceId, details) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.replaceInstanceId(`${this.endpoint}/business_details`, instanceId);
            return this.put(path, details);
        });
    }
    getBusinessDetails(instanceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.replaceInstanceId(`${this.endpoint}/business_details`, instanceId);
            return this.get(path);
        });
    }
    upsertBusinessProfile(instanceId, profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.replaceInstanceId(`${this.endpoint}/business_profile`, instanceId);
            return this.put(path, profile);
        });
    }
    getBusinessProfile(instanceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.replaceInstanceId(`${this.endpoint}/business_profile`, instanceId);
            return this.get(path);
        });
    }
    upsertOwnershipDocuments(instanceId, documents) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.replaceInstanceId(`${this.endpoint}/ownership_documents`, instanceId);
            return this.put(path, documents);
        });
    }
    getOwnershipDocuments(instanceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.replaceInstanceId(`${this.endpoint}/ownership_documents`, instanceId);
            return this.get(path);
        });
    }
    upsertApplicant(instanceId, applicant) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.replaceInstanceId(`${this.endpoint}/applicant`, instanceId);
            return this.put(path, applicant);
        });
    }
    getApplicant(instanceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.replaceInstanceId(`${this.endpoint}/applicant`, instanceId);
            return this.get(path);
        });
    }
    startKYB(instanceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.replaceInstanceId(`${this.endpoint}/kyb`, instanceId);
            return this.post(path, {});
        });
    }
    getCompliance(instanceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.replaceInstanceId(`${this.endpoint}/compliance`, instanceId);
            return this.get(path);
        });
    }
    getAccessToken(instanceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.replaceInstanceId(`${this.endpoint}/access_token`, instanceId);
            return this.get(path);
        });
    }
    completeSumsubSdk(instanceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.replaceInstanceId(`${this.endpoint}/sumsub_sdk`, instanceId);
            return this.post(path, {});
        });
    }
    completeOnboarding(instanceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.replaceInstanceId(`${this.endpoint}/complete`, instanceId);
            return this.post(path, {});
        });
    }
}
exports.OnboardingService = OnboardingService;

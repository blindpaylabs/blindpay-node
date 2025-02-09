"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnboardingService = void 0;
const base_service_1 = require("./base.service");
/**
 * Service for managing the onboarding process of instances, including business details,
 * profiles, ownership documents, applicant information, and compliance checks.
 */
class OnboardingService extends base_service_1.BaseService {
    BASE_PATH = "/instances/{instance_id}/onboarding";
    /**
     * Creates or updates business details for an instance
     * @param details - The business details to create or update
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing a success response or an error
     * @throws Error if the instance ID is invalid
     */
    async upsertBusinessDetails(details, instanceId) {
        const path = this.replaceInstanceId(`${this.BASE_PATH}/business_details`, instanceId);
        return this._put(path, details);
    }
    /**
     * Retrieves the business details for an instance
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing the business details or an error
     * @throws Error if the instance ID is invalid
     */
    async getBusinessDetails(instanceId) {
        const path = this.replaceInstanceId(`${this.BASE_PATH}/business_details`, instanceId);
        return this._get(path);
    }
    /**
     * Creates or updates the business profile for an instance
     * @param profile - The business profile data to create or update
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing a success response or an error
     * @throws Error if the instance ID is invalid
     */
    async upsertBusinessProfile(profile, instanceId) {
        const path = this.replaceInstanceId(`${this.BASE_PATH}/business_profile`, instanceId);
        return this._put(path, profile);
    }
    /**
     * Retrieves the business profile for an instance
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing the business profile or an error
     * @throws Error if the instance ID is invalid
     */
    async getBusinessProfile(instanceId) {
        const path = this.replaceInstanceId(`${this.BASE_PATH}/business_profile`, instanceId);
        return this._get(path);
    }
    /**
     * Creates or updates ownership documents for an instance
     * @param documents - The ownership documents to create or update
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing a success response or an error
     * @throws Error if the instance ID is invalid
     */
    async upsertOwnershipDocuments(documents, instanceId) {
        const path = this.replaceInstanceId(`${this.BASE_PATH}/ownership_documents`, instanceId);
        return this._put(path, documents);
    }
    /**
     * Retrieves the ownership documents for an instance
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing the ownership documents or an error
     * @throws Error if the instance ID is invalid
     */
    async getOwnershipDocuments(instanceId) {
        const path = this.replaceInstanceId(`${this.BASE_PATH}/ownership_documents`, instanceId);
        return this._get(path);
    }
    /**
     * Creates or updates applicant information for an instance
     * @param applicant - The applicant information to create or update
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing a success response or an error
     * @throws Error if the instance ID is invalid
     */
    async upsertApplicant(applicant, instanceId) {
        const path = this.replaceInstanceId(`${this.BASE_PATH}/applicant`, instanceId);
        return this._put(path, applicant);
    }
    /**
     * Retrieves the applicant information for an instance
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing the applicant information or an error
     * @throws Error if the instance ID is invalid
     */
    async getApplicant(instanceId) {
        const path = this.replaceInstanceId(`${this.BASE_PATH}/applicant`, instanceId);
        return this._get(path);
    }
    /**
     * Initiates the Know Your Business (KYB) process for an instance
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing a success response or an error
     * @throws Error if the instance ID is invalid
     */
    async startKYB(instanceId) {
        const path = this.replaceInstanceId(`${this.BASE_PATH}/kyb`, instanceId);
        return this._post(path, {});
    }
    /**
     * Retrieves the compliance information for an instance
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing the compliance information or an error
     * @throws Error if the instance ID is invalid
     */
    async getCompliance(instanceId) {
        const path = this.replaceInstanceId(`${this.BASE_PATH}/compliance`, instanceId);
        return this._get(path);
    }
    /**
     * Retrieves the access token for an instance
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing the access token or an error
     * @throws Error if the instance ID is invalid
     */
    async getAccessToken(instanceId) {
        const path = this.replaceInstanceId(`${this.BASE_PATH}/access_token`, instanceId);
        return this._get(path);
    }
    /**
     * Marks the SumSub SDK flow as completed for an instance
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing a success response or an error
     * @throws Error if the instance ID is invalid
     */
    async completeSumsubSdk(instanceId) {
        const path = this.replaceInstanceId(`${this.BASE_PATH}/sumsub_sdk`, instanceId);
        return this._post(path, {});
    }
    /**
     * Marks the onboarding process as complete for an instance
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing a success response or an error
     * @throws Error if the instance ID is invalid
     */
    async completeOnboarding(instanceId) {
        const path = this.replaceInstanceId(`${this.BASE_PATH}/complete`, instanceId);
        return this._post(path, {});
    }
}
exports.OnboardingService = OnboardingService;

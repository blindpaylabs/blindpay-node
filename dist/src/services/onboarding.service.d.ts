import { BaseService } from "./base.service";
import { BusinessDetailsIn, BusinessDetailsOut, BusinessProfileIn, BusinessProfileOut, OwnershipDocumentsIn, OwnershipDocumentsOut, ApplicantIn, ApplicantOut, ComplianceOut, AccessTokenOut } from "../types/onboarding-types";
import { ErrorResponse } from "../types/error-response";
import { SuccessResponse } from "../types/success-response";
/**
 * Service for managing the onboarding process of instances, including business details,
 * profiles, ownership documents, applicant information, and compliance checks.
 */
export declare class OnboardingService extends BaseService {
    protected BASE_PATH: string;
    /**
     * Creates or updates business details for an instance
     * @param details - The business details to create or update
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing a success response or an error
     * @throws Error if the instance ID is invalid
     */
    upsertBusinessDetails(details: BusinessDetailsIn, instanceId?: string): Promise<{
        data: SuccessResponse | null;
        error: ErrorResponse | null;
    }>;
    /**
     * Retrieves the business details for an instance
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing the business details or an error
     * @throws Error if the instance ID is invalid
     */
    getBusinessDetails(instanceId?: string): Promise<{
        data: BusinessDetailsOut | null;
        error: ErrorResponse | null;
    }>;
    /**
     * Creates or updates the business profile for an instance
     * @param profile - The business profile data to create or update
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing a success response or an error
     * @throws Error if the instance ID is invalid
     */
    upsertBusinessProfile(profile: BusinessProfileIn, instanceId?: string): Promise<{
        data: SuccessResponse | null;
        error: ErrorResponse | null;
    }>;
    /**
     * Retrieves the business profile for an instance
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing the business profile or an error
     * @throws Error if the instance ID is invalid
     */
    getBusinessProfile(instanceId?: string): Promise<{
        data: BusinessProfileOut | null;
        error: ErrorResponse | null;
    }>;
    /**
     * Creates or updates ownership documents for an instance
     * @param documents - The ownership documents to create or update
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing a success response or an error
     * @throws Error if the instance ID is invalid
     */
    upsertOwnershipDocuments(documents: OwnershipDocumentsIn, instanceId?: string): Promise<{
        data: SuccessResponse | null;
        error: ErrorResponse | null;
    }>;
    /**
     * Retrieves the ownership documents for an instance
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing the ownership documents or an error
     * @throws Error if the instance ID is invalid
     */
    getOwnershipDocuments(instanceId?: string): Promise<{
        data: OwnershipDocumentsOut | null;
        error: ErrorResponse | null;
    }>;
    /**
     * Creates or updates applicant information for an instance
     * @param applicant - The applicant information to create or update
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing a success response or an error
     * @throws Error if the instance ID is invalid
     */
    upsertApplicant(applicant: ApplicantIn, instanceId?: string): Promise<{
        data: SuccessResponse | null;
        error: ErrorResponse | null;
    }>;
    /**
     * Retrieves the applicant information for an instance
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing the applicant information or an error
     * @throws Error if the instance ID is invalid
     */
    getApplicant(instanceId?: string): Promise<{
        data: ApplicantOut | null;
        error: ErrorResponse | null;
    }>;
    /**
     * Initiates the Know Your Business (KYB) process for an instance
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing a success response or an error
     * @throws Error if the instance ID is invalid
     */
    startKYB(instanceId: string): Promise<{
        data: SuccessResponse | null;
        error: ErrorResponse | null;
    }>;
    /**
     * Retrieves the compliance information for an instance
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing the compliance information or an error
     * @throws Error if the instance ID is invalid
     */
    getCompliance(instanceId?: string): Promise<{
        data: ComplianceOut | null;
        error: ErrorResponse | null;
    }>;
    /**
     * Retrieves the access token for an instance
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing the access token or an error
     * @throws Error if the instance ID is invalid
     */
    getAccessToken(instanceId?: string): Promise<{
        data: AccessTokenOut | null;
        error: ErrorResponse | null;
    }>;
    /**
     * Marks the SumSub SDK flow as completed for an instance
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing a success response or an error
     * @throws Error if the instance ID is invalid
     */
    completeSumsubSdk(instanceId?: string): Promise<{
        data: SuccessResponse | null;
        error: ErrorResponse | null;
    }>;
    /**
     * Marks the onboarding process as complete for an instance
     * @param instanceId - The instance ID (15 characters)
     * @returns A promise containing a success response or an error
     * @throws Error if the instance ID is invalid
     */
    completeOnboarding(instanceId?: string): Promise<{
        data: SuccessResponse | null;
        error: ErrorResponse | null;
    }>;
}

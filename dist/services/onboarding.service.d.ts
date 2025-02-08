import { BaseService } from "./base.service";
import { BusinessDetailsIn, BusinessDetailsOut, BusinessProfileIn, BusinessProfileOut, OwnershipDocumentsIn, OwnershipDocumentsOut, ApplicantIn, ApplicantOut, ComplianceOut, AccessTokenOut } from "../types/onboarding-types";
import { ErrorResponse } from "../types/error-response";
import { SuccessResponse } from "../types/success-response";
export declare class OnboardingService extends BaseService {
    protected endpoint: string;
    upsertBusinessDetails(instanceId: string, details: BusinessDetailsIn): Promise<{
        data: SuccessResponse | null;
        error: ErrorResponse | null;
    }>;
    getBusinessDetails(instanceId: string): Promise<{
        data: BusinessDetailsOut | null;
        error: ErrorResponse | null;
    }>;
    upsertBusinessProfile(instanceId: string, profile: BusinessProfileIn): Promise<{
        data: SuccessResponse | null;
        error: ErrorResponse | null;
    }>;
    getBusinessProfile(instanceId: string): Promise<{
        data: BusinessProfileOut | null;
        error: ErrorResponse | null;
    }>;
    upsertOwnershipDocuments(instanceId: string, documents: OwnershipDocumentsIn): Promise<{
        data: SuccessResponse | null;
        error: ErrorResponse | null;
    }>;
    getOwnershipDocuments(instanceId: string): Promise<{
        data: OwnershipDocumentsOut | null;
        error: ErrorResponse | null;
    }>;
    upsertApplicant(instanceId: string, applicant: ApplicantIn): Promise<{
        data: SuccessResponse | null;
        error: ErrorResponse | null;
    }>;
    getApplicant(instanceId: string): Promise<{
        data: ApplicantOut | null;
        error: ErrorResponse | null;
    }>;
    startKYB(instanceId: string): Promise<{
        data: SuccessResponse | null;
        error: ErrorResponse | null;
    }>;
    getCompliance(instanceId: string): Promise<{
        data: ComplianceOut | null;
        error: ErrorResponse | null;
    }>;
    getAccessToken(instanceId: string): Promise<{
        data: AccessTokenOut | null;
        error: ErrorResponse | null;
    }>;
    completeSumsubSdk(instanceId: string): Promise<{
        data: SuccessResponse | null;
        error: ErrorResponse | null;
    }>;
    completeOnboarding(instanceId: string): Promise<{
        data: SuccessResponse | null;
        error: ErrorResponse | null;
    }>;
}

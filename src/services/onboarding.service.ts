import { BaseService } from "./base.service";
import {
  BusinessDetailsIn,
  BusinessDetailsOut,
  BusinessProfileIn,
  BusinessProfileOut,
  OwnershipDocumentsIn,
  OwnershipDocumentsOut,
  ApplicantIn,
  ApplicantOut,
  ComplianceOut,
  AccessTokenOut,
} from "../types/onboarding-types";
import { ErrorResponse } from "../types/error-response";
import { SuccessResponse } from "../types/success-response";

/**
 * Service for managing the onboarding process of instances, including business details,
 * profiles, ownership documents, applicant information, and compliance checks.
 */
export class OnboardingService extends BaseService {
  protected BASE_PATH = "/instances/{instance_id}/onboarding";

  /**
   * Creates or updates business details for an instance
   * @param details - The business details to create or update
   * @param instanceId - The instance ID (15 characters)
   * @returns A promise containing a success response or an error
   * @throws Error if the instance ID is invalid
   */
  async upsertBusinessDetails(
    details: BusinessDetailsIn,
    instanceId?: string
  ): Promise<{ data: SuccessResponse | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.BASE_PATH}/business_details`,
      instanceId
    );
    return this._put<SuccessResponse>(path, details);
  }

  /**
   * Retrieves the business details for an instance
   * @param instanceId - The instance ID (15 characters)
   * @returns A promise containing the business details or an error
   * @throws Error if the instance ID is invalid
   */
  async getBusinessDetails(
    instanceId?: string
  ): Promise<{ data: BusinessDetailsOut | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.BASE_PATH}/business_details`,
      instanceId
    );
    return this._get<BusinessDetailsOut>(path);
  }

  /**
   * Creates or updates the business profile for an instance
   * @param profile - The business profile data to create or update
   * @param instanceId - The instance ID (15 characters)
   * @returns A promise containing a success response or an error
   * @throws Error if the instance ID is invalid
   */
  async upsertBusinessProfile(
    profile: BusinessProfileIn,
    instanceId?: string
  ): Promise<{ data: SuccessResponse | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.BASE_PATH}/business_profile`,
      instanceId
    );
    return this._put<SuccessResponse>(path, profile);
  }

  /**
   * Retrieves the business profile for an instance
   * @param instanceId - The instance ID (15 characters)
   * @returns A promise containing the business profile or an error
   * @throws Error if the instance ID is invalid
   */
  async getBusinessProfile(
    instanceId?: string
  ): Promise<{ data: BusinessProfileOut | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.BASE_PATH}/business_profile`,
      instanceId
    );
    return this._get<BusinessProfileOut>(path);
  }

  /**
   * Creates or updates ownership documents for an instance
   * @param documents - The ownership documents to create or update
   * @param instanceId - The instance ID (15 characters)
   * @returns A promise containing a success response or an error
   * @throws Error if the instance ID is invalid
   */
  async upsertOwnershipDocuments(
    documents: OwnershipDocumentsIn,
    instanceId?: string
  ): Promise<{ data: SuccessResponse | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.BASE_PATH}/ownership_documents`,
      instanceId
    );
    return this._put<SuccessResponse>(path, documents);
  }

  /**
   * Retrieves the ownership documents for an instance
   * @param instanceId - The instance ID (15 characters)
   * @returns A promise containing the ownership documents or an error
   * @throws Error if the instance ID is invalid
   */
  async getOwnershipDocuments(instanceId?: string): Promise<{
    data: OwnershipDocumentsOut | null;
    error: ErrorResponse | null;
  }> {
    const path = this.replaceInstanceId(
      `${this.BASE_PATH}/ownership_documents`,
      instanceId
    );
    return this._get<OwnershipDocumentsOut>(path);
  }

  /**
   * Creates or updates applicant information for an instance
   * @param applicant - The applicant information to create or update
   * @param instanceId - The instance ID (15 characters)
   * @returns A promise containing a success response or an error
   * @throws Error if the instance ID is invalid
   */
  async upsertApplicant(
    applicant: ApplicantIn,
    instanceId?: string
  ): Promise<{ data: SuccessResponse | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.BASE_PATH}/applicant`,
      instanceId
    );
    return this._put<SuccessResponse>(path, applicant);
  }

  /**
   * Retrieves the applicant information for an instance
   * @param instanceId - The instance ID (15 characters)
   * @returns A promise containing the applicant information or an error
   * @throws Error if the instance ID is invalid
   */
  async getApplicant(
    instanceId?: string
  ): Promise<{ data: ApplicantOut | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.BASE_PATH}/applicant`,
      instanceId
    );
    return this._get<ApplicantOut>(path);
  }

  /**
   * Initiates the Know Your Business (KYB) process for an instance
   * @param instanceId - The instance ID (15 characters)
   * @returns A promise containing a success response or an error
   * @throws Error if the instance ID is invalid
   */
  async startKYB(
    instanceId: string
  ): Promise<{ data: SuccessResponse | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(`${this.BASE_PATH}/kyb`, instanceId);
    return this._post<SuccessResponse>(path, {});
  }

  /**
   * Retrieves the compliance information for an instance
   * @param instanceId - The instance ID (15 characters)
   * @returns A promise containing the compliance information or an error
   * @throws Error if the instance ID is invalid
   */
  async getCompliance(
    instanceId?: string
  ): Promise<{ data: ComplianceOut | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.BASE_PATH}/compliance`,
      instanceId
    );
    return this._get<ComplianceOut>(path);
  }

  /**
   * Retrieves the access token for an instance
   * @param instanceId - The instance ID (15 characters)
   * @returns A promise containing the access token or an error
   * @throws Error if the instance ID is invalid
   */
  async getAccessToken(
    instanceId?: string
  ): Promise<{ data: AccessTokenOut | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.BASE_PATH}/access_token`,
      instanceId
    );
    return this._get<AccessTokenOut>(path);
  }

  /**
   * Marks the SumSub SDK flow as completed for an instance
   * @param instanceId - The instance ID (15 characters)
   * @returns A promise containing a success response or an error
   * @throws Error if the instance ID is invalid
   */
  async completeSumsubSdk(
    instanceId?: string
  ): Promise<{ data: SuccessResponse | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.BASE_PATH}/sumsub_sdk`,
      instanceId
    );
    return this._post<SuccessResponse>(path, {});
  }

  /**
   * Marks the onboarding process as complete for an instance
   * @param instanceId - The instance ID (15 characters)
   * @returns A promise containing a success response or an error
   * @throws Error if the instance ID is invalid
   */
  async completeOnboarding(
    instanceId?: string
  ): Promise<{ data: SuccessResponse | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.BASE_PATH}/complete`,
      instanceId
    );
    return this._post<SuccessResponse>(path, {});
  }
}

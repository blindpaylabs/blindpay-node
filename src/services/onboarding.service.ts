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
  SuccessResponse,
} from "../types/onboarding-types";
import { ErrorResponse } from "../types/error-response";

export class OnboardingService extends BaseService {
  protected endpoint = "/instances/{instance_id}/onboarding";

  private replaceInstanceId(path: string, instanceId: string): string {
    return path.replace("{instance_id}", instanceId);
  }

  async upsertBusinessDetails(
    instanceId: string,
    details: BusinessDetailsIn
  ): Promise<{ data: SuccessResponse | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.endpoint}/business_details`,
      instanceId
    );
    return this.put<SuccessResponse>(path, details);
  }

  async getBusinessDetails(
    instanceId: string
  ): Promise<{ data: BusinessDetailsOut | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.endpoint}/business_details`,
      instanceId
    );
    return this.get<BusinessDetailsOut>(path);
  }

  async upsertBusinessProfile(
    instanceId: string,
    profile: BusinessProfileIn
  ): Promise<{ data: SuccessResponse | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.endpoint}/business_profile`,
      instanceId
    );
    return this.put<SuccessResponse>(path, profile);
  }

  async getBusinessProfile(
    instanceId: string
  ): Promise<{ data: BusinessProfileOut | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.endpoint}/business_profile`,
      instanceId
    );
    return this.get<BusinessProfileOut>(path);
  }

  async upsertOwnershipDocuments(
    instanceId: string,
    documents: OwnershipDocumentsIn
  ): Promise<{ data: SuccessResponse | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.endpoint}/ownership_documents`,
      instanceId
    );
    return this.put<SuccessResponse>(path, documents);
  }

  async getOwnershipDocuments(instanceId: string): Promise<{
    data: OwnershipDocumentsOut | null;
    error: ErrorResponse | null;
  }> {
    const path = this.replaceInstanceId(
      `${this.endpoint}/ownership_documents`,
      instanceId
    );
    return this.get<OwnershipDocumentsOut>(path);
  }

  async upsertApplicant(
    instanceId: string,
    applicant: ApplicantIn
  ): Promise<{ data: SuccessResponse | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.endpoint}/applicant`,
      instanceId
    );
    return this.put<SuccessResponse>(path, applicant);
  }

  async getApplicant(
    instanceId: string
  ): Promise<{ data: ApplicantOut | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.endpoint}/applicant`,
      instanceId
    );
    return this.get<ApplicantOut>(path);
  }

  async startKYB(
    instanceId: string
  ): Promise<{ data: SuccessResponse | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(`${this.endpoint}/kyb`, instanceId);
    return this.post<SuccessResponse>(path, {});
  }

  async getCompliance(
    instanceId: string
  ): Promise<{ data: ComplianceOut | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.endpoint}/compliance`,
      instanceId
    );
    return this.get<ComplianceOut>(path);
  }

  async getAccessToken(
    instanceId: string
  ): Promise<{ data: AccessTokenOut | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.endpoint}/access_token`,
      instanceId
    );
    return this.get<AccessTokenOut>(path);
  }

  async completeSumsubSdk(
    instanceId: string
  ): Promise<{ data: SuccessResponse | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.endpoint}/sumsub_sdk`,
      instanceId
    );
    return this.post<SuccessResponse>(path, {});
  }

  async completeOnboarding(
    instanceId: string
  ): Promise<{ data: SuccessResponse | null; error: ErrorResponse | null }> {
    const path = this.replaceInstanceId(
      `${this.endpoint}/complete`,
      instanceId
    );
    return this.post<SuccessResponse>(path, {});
  }
}

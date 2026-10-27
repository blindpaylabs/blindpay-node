import type { BlindpayApiResponse, Country } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";
import type { IdentificationDocument, OwnerRole, ProofOfAddressDocType } from "../customers";

export type InstanceEntityType =
    | "cooperative"
    | "corporation"
    | "company"
    | "partnership"
    | "sole_proprietor"
    | "trust"
    | "other";

export type InstanceOnboardingScenario = "custodial" | "custodial_mtl" | "non_custodial" | "other";

export type InstanceBusinessIndustry =
    | "wallet"
    | "exchange"
    | "dapp"
    | "neo_bank"
    | "gaming"
    | "marketplace"
    | "saas"
    | "social"
    | "infra"
    | "gambling"
    | "other";

export type InstanceEstimatedVolumePerMonth =
    | "up_to_100"
    | "up_to_500"
    | "up_to_1000"
    | "up_to_10000"
    | "more_than_10000";

export type GetInstanceBusinessDetailsResponse = {
    legal_name?: string;
    tax_id?: string;
    formation_date?: string;
    trading_names?: string[];
    address_line_1?: string;
    address_line_2?: string | null;
    city?: string;
    state_province_region?: string;
    postal_code?: string;
    country?: Country;
    entity_type?: InstanceEntityType;
    state_of_incorporation?: string;
};

export type GetInstanceBusinessProfileResponse = {
    scenario?: InstanceOnboardingScenario;
    scenario_description?: string | null;
    has_kyc_screening?: boolean | null;
    is_regulated?: boolean | null;
    business_industry?: InstanceBusinessIndustry;
    website?: string | null;
    top_volume_by_country?: Country[];
    estimated_volume_per_month?: InstanceEstimatedVolumePerMonth;
};

export type InstanceOnboardingOwner = {
    id?: string;
    instance_id?: string;
    role?: OwnerRole;
    first_name?: string;
    last_name?: string;
    ownership_percentage?: number | null;
    date_of_birth?: string;
    tax_id?: string;
    address_line_1?: string;
    address_line_2?: string | null;
    city?: string;
    state_province_region?: string;
    country?: Country;
    postal_code?: string;
    id_doc_country?: Country;
    id_doc_type?: IdentificationDocument;
    id_doc_front_file?: string | null;
    id_doc_back_file?: string | null;
    proof_of_address_doc_type?: ProofOfAddressDocType | null;
    proof_of_address_doc_file?: string | null;
};

export type GetInstanceOwnershipDocumentsResponse = {
    incorporation_doc_file?: string | null;
    proof_of_ownership_doc_file?: string | null;
    proof_of_address_doc_type?: ProofOfAddressDocType | null;
    proof_of_address_doc_file?: string | null;
    owners?: InstanceOnboardingOwner[] | null;
};

export function createInstanceOnboardingResource(instanceId: string, client: InternalApiClient) {
    return {
        getBusinessDetails(): Promise<BlindpayApiResponse<GetInstanceBusinessDetailsResponse>> {
            return client.get(`/instances/${instanceId}/onboarding/business_details`);
        },
        getBusinessProfile(): Promise<BlindpayApiResponse<GetInstanceBusinessProfileResponse>> {
            return client.get(`/instances/${instanceId}/onboarding/business_profile`);
        },
        getOwnershipDocuments(): Promise<
            BlindpayApiResponse<GetInstanceOwnershipDocumentsResponse>
        > {
            return client.get(`/instances/${instanceId}/onboarding/ownership_documents`);
        },
    };
}

export interface BusinessDetailsIn {
    name: string;
    type: string;
    address: string;
}
export interface BusinessDetailsOut {
    name: string;
    type: string;
    address: string;
}
export interface BusinessProfileIn {
    profile_name: string;
}
export interface BusinessProfileOut {
    profile_name: string;
}
export interface OwnershipDocumentsIn {
    document_name: string;
    document_type: string;
}
export interface OwnershipDocumentsOut {
    document_name: string;
    document_type: string;
}
export interface ApplicantIn {
    first_name: string;
    last_name: string;
}
export interface ApplicantOut {
    first_name: string;
    last_name: string;
}
export interface ComplianceOut {
    status: string;
}
export interface AccessTokenOut {
    token: string;
    expires_at: string;
}

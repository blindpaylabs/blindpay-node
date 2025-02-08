export interface CreateInstanceRequest {
    name: string;
    type: string;
}
export interface CreateInstanceResponse {
    id: string;
    onboarding_step: string;
}

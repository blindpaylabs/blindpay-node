export interface CreateApiKeyRequest {
    name: string;
    permission: string;
}
export interface CreateApiKeyResponse {
    id: string;
    token: string;
    created_at: string;
    updated_at: string;
}

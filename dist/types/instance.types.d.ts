export interface UpdateInstanceRequest {
    name: string;
    receiver_invite_redirect_url?: string | null;
}
export interface UpdateInstanceResponse {
    success: boolean;
}
export interface DeleteInstanceResponse {
    success: boolean;
}
export interface InstanceMember {
    id: string;
    email: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    image_url?: string;
    created_at: string;
    role: string;
}

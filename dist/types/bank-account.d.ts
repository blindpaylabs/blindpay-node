import { Generated } from "./generated";
import { ErrorResponse } from "./error-response";
export interface BaseResponse<T> {
    data: T | null;
    error: ErrorResponse | null;
}
export interface BankAccount {
    id: string;
    instance_id: string;
    receiver_id: string;
    bank_country: string;
    bank_details: string;
    blockchain_address: string;
    brex_vendor_id: string | null;
    created_at: Generated<string>;
    currency: string;
    deleted_at: string | null;
    name: string;
    updated_at: Generated<string>;
}
export interface BankDetail {
    label: string;
    regex: string;
    key: string;
    required: boolean;
    items?: Array<{
        label: string;
        value: string;
    }>;
}
export interface CreateBankAccountRequest {
    bank_country: string;
    bank_details: Record<string, string>;
    currency: string;
    name: string;
}
export interface CreateBankAccountResponse {
    id: string;
    bank_details: string;
    blockchain_address: string;
    created_at: string;
    deleted_at: string | null;
    name: string;
    receiver_id: string;
    updated_at: string;
}
export interface DeleteBankAccountResponse {
    success: boolean;
}

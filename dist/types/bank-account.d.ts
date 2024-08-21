import { Generated } from "./generated";
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

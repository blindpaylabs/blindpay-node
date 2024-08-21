export type Generated<T> = T | undefined;
export interface ApiKey {
    created_at: Generated<string>;
    deleted_at: string | null;
    id: string;
    instance_id: string;
    last_used_at: Generated<string>;
    name: string;
    permission: string;
    token: string;
    updated_at: Generated<string>;
}
export interface ApiKeyInstanceMap {
    api_key_id: string;
    created_at: Generated<string>;
    deleted_at: string | null;
    id: string;
    instance_id: string;
    updated_at: Generated<string>;
}
export interface BankAccount {
    bank_country: string;
    bank_details: string;
    blockchain_address: string;
    brex_vendor_id: string | null;
    created_at: Generated<string>;
    currency: string;
    deleted_at: string | null;
    id: string;
    instance_id: string;
    name: string;
    receiver_id: string;
    updated_at: Generated<string>;
}
export interface Fee {
    BRL: string | null;
    created_at: Generated<string>;
    id: string;
    instance_id: string;
    updated_at: Generated<string>;
    USD: string | null;
}
export interface Instance {
    created_at: Generated<string>;
    deleted_at: string | null;
    id: string;
    name: string;
    onboarding_step: string;
    type: string;
    updated_at: Generated<string>;
}
export interface Onboarding {
    address_line_1: string | null;
    address_line_2: string | null;
    applicant_authorized: number | null;
    applicant_id: string | null;
    business_industry: string | null;
    city: string | null;
    country: string | null;
    created_at: Generated<string>;
    deleted_at: string | null;
    documents: string | null;
    entity_name: string | null;
    entity_type: string | null;
    estimated_volume_per_month: string | null;
    formation_date: string | null;
    has_kyc_screening: number | null;
    id: string;
    instance_id: string;
    kyb_status: string | null;
    kyc_status: string | null;
    postal_code: string | null;
    scenario: string | null;
    scenario_description: string | null;
    state_of_incorporation: string | null;
    state_province_region: string | null;
    tax_id: string | null;
    top_volume_by_country: string | null;
    trading_names: string | null;
    updated_at: Generated<string>;
    website: string | null;
}
export interface OnboardingOwner {
    created_at: Generated<string>;
    date_of_birth: string;
    deleted_at: string | null;
    documents: string;
    first_name: string;
    id: string;
    instance_id: string;
    job_title: string;
    last_name: string;
    role: string;
    status: string;
    updated_at: Generated<string>;
}
export interface Payout {
    created_at: Generated<string>;
    deleted_at: string | null;
    external_id: string | null;
    id: string;
    instance_id: string;
    quote_id: string;
    sender_wallet_address: string;
    status: string;
    tracking_complete: string;
    tracking_payment: string;
    tracking_transaction: string;
    updated_at: Generated<string>;
}
export interface Quote {
    bank_account_id: string;
    blindpay_quotation: number;
    commercial_quotation: number;
    cover_fees: number;
    created_at: Generated<string>;
    currency: string;
    currency_type: string;
    deleted_at: string | null;
    expires_at: number;
    id: string;
    instance_id: string;
    network: string;
    receiver_amount: number;
    request_amount: number;
    sender_amount: number;
    token: string;
    updated_at: Generated<string>;
}
export interface Receiver {
    address_line_1: string | null;
    address_line_2: string | null;
    business: string | null;
    city: string | null;
    country: string;
    created_at: Generated<string>;
    deleted_at: string | null;
    email: string;
    id: string;
    image_url: string | null;
    individual: string | null;
    instance_id: string;
    postal_code: string | null;
    state_province_region: string | null;
    tax_id: string | null;
    type: string;
    updated_at: Generated<string>;
}
export interface User {
    created_at: Generated<string>;
    deleted_at: string | null;
    email: string;
    first_name: string;
    id: string;
    image_url: string;
    last_name: string;
    middle_name: string | null;
    updated_at: Generated<string>;
}
export interface UserInstanceMap {
    created_at: Generated<string>;
    deleted_at: string | null;
    id: string;
    instance_id: string;
    updated_at: Generated<string>;
    user_id: string;
}
export interface WebhookEndpoint {
    created_at: Generated<string>;
    deleted_at: string | null;
    events: string | null;
    id: string;
    instance_id: string;
    last_event_at: Generated<string>;
    updated_at: Generated<string>;
    url: string;
}
export interface WebhookEndpointInstanceMap {
    created_at: Generated<string>;
    deleted_at: string | null;
    id: string;
    instance_id: string;
    updated_at: Generated<string>;
    webhook_endpoint_id: string;
}
export interface DB {
    api_key: ApiKey;
    api_key_instance_map: ApiKeyInstanceMap;
    bank_account: BankAccount;
    fee: Fee;
    instance: Instance;
    onboarding: Onboarding;
    onboarding_owner: OnboardingOwner;
    payout: Payout;
    quote: Quote;
    receiver: Receiver;
    user: User;
    user_instance_map: UserInstanceMap;
    webhook_endpoint: WebhookEndpoint;
    webhook_endpoint_instance_map: WebhookEndpointInstanceMap;
}

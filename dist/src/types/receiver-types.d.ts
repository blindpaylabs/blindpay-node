import { CountryCode } from "./util-types";
export declare enum ReceiverType {
    INDIVIDUAL = "individual",
    BUSINESS = "business"
}
export declare enum KYCType {
    LIGHT = "light",
    STANDARD = "standard",
    ENHANCED = "enhanced"
}
export declare enum IDDocType {
    PASSPORT = "PASSPORT",
    ID_CARD = "ID_CARD",
    DRIVERS = "DRIVERS"
}
export declare enum AddressDocType {
    UTILITY_BILL = "UTILITY_BILL",
    BANK_STATEMENT = "BANK_STATEMENT",
    RENTAL_AGREEMENT = "RENTAL_AGREEMENT",
    TAX_DOCUMENT = "TAX_DOCUMENT",
    GOVERNMENT_CORRESPONDENCE = "GOVERNMENT_CORRESPONDENCE"
}
export declare enum SourceOfFundsDocType {
    BUSINESS_INCOME = "business_income",
    GAMBLING_PROCEEDS = "gambling_proceeds",
    GIFTS = "gifts",
    GOVERNMENT_BENEFITS = "government_benefits",
    INHERITANCE = "inheritance"
}
export declare enum PurposeOfTransactions {
    BUSINESS_TRANSACTIONS = "business_transactions",
    CHARITABLE_DONATIONS = "charitable_donations",
    INVESTMENT_PURPOSES = "investment_purposes",
    PAYMENTS_TO_FRIENDS_OR_FAMILY_ABROAD = "payments_to_friends_or_family_abroad",
    PERSONAL_OR_LIVING_EXPENSES = "personal_or_living_expenses",
    PROTECT_WEALTH = "protect_wealth",
    PURCHASE_GOODS_AND_SERVICES = "purchase_goods_and_services",
    RECEIVE_PAYMENT_FOR_FREELANCING = "receive_payment_for_freelancing",
    RECEIVE_SALARY = "receive_salary",
    OTHER = "other"
}
interface BaseOwner {
    first_name: string;
    last_name: string;
    role: string;
    date_of_birth: string;
    tax_id: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state_province_region: string;
    country: string;
    postal_code: string;
    id_doc_country: string;
    id_doc_type: IDDocType;
    id_doc_front_file: string;
    id_doc_back_file: string;
}
interface ResponseOwner extends BaseOwner {
    id: string;
}
interface RequestOwner extends BaseOwner {
}
interface CommonReceiverFields {
    email: string;
    tax_id: string | null;
    address_line_1: string | null;
    address_line_2?: string | null;
    city: string | null;
    state_province_region: string | null;
    country: CountryCode;
    postal_code: string | null;
    ip_address: string | null;
    image_url: string | null;
    phone_number: string | null;
    proof_of_address_doc_type: AddressDocType | null;
    proof_of_address_doc_file: string | null;
    first_name: string | null;
    last_name: string | null;
    date_of_birth: string | null;
    id_doc_country: string | null;
    id_doc_type: IDDocType | null;
    id_doc_front_file: string | null;
    id_doc_back_file: string | null;
    legal_name: string | null;
    alternate_name: string | null;
    formation_date: string | null;
    website: string | null;
    incorporation_doc_file: string | null;
    proof_of_ownership_doc_file: string | null;
    source_of_funds_doc_type: SourceOfFundsDocType | null;
    source_of_funds_doc_file: string | null;
    individual_holding_doc_front_file: string | null;
    purpose_of_transactions: PurposeOfTransactions | null;
    purpose_of_transactions_explanation: string | null;
    external_id: string | null;
}
export interface CreateReceiverRequest extends CommonReceiverFields {
    type: ReceiverType;
    kyc_type: KYCType;
    owners?: RequestOwner[];
}
export interface UpdateReceiverRequest extends CommonReceiverFields {
    owners?: ResponseOwner[];
}
export interface ReceiverResponse extends CommonReceiverFields {
    id: string;
    type: ReceiverType;
    kyc_type: KYCType;
    kyc_status: string;
    kyc_warnings: Array<{
        code: string | null;
        message: string | null;
        resolution_status: string | null;
        warning_id: string | null;
    }>;
    owners: ResponseOwner[];
    instance_id: string;
    aiprise_validation_key: string;
    created_at: string;
    updated_at: string;
    limit: {
        per_transaction: number;
        daily: number;
        monthly: number;
    };
}
export interface DeleteReceiverResponse {
    success: boolean;
}
export {};
